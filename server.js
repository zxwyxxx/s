const express = require('express');
const app = express();
const fs = require('fs');
const port = 80;

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// To parse JSON request bodies
app.use(express.json());

// Handle the /download route 
app.post('/download', (req, res) => {
    const testData = req.body; // Get the test data including the name
    const testJson = JSON.stringify(testData);

    // Create the 'tests' directory if it doesn't exist
    if (!fs.existsSync('./tests')) {
        fs.mkdirSync('./tests');
    }

    // Use the test name from the request data to create the filename
    const fileName = `./tests/${testData.name}.json`;

    // Write the file to the 'tests' directory with the test name
    fs.writeFile(fileName, testJson, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            res.status(500).send("Error saving the test.");
        } else {
            console.log("Test saved successfully!");
            res.send('Test data received and processed!');
        }
    });
});

// Route to get the list of tests
app.get('/tests', (req, res) => {
    fs.readdir('./tests', (err, files) => {
        if (err) {
            console.error("Error reading tests directory:", err);
            res.status(500).send("Error fetching tests.");
        } else {
            const testFiles = files.filter(file => file.endsWith('.json')); // Filter for .json files
            res.json(testFiles); // Send the list of test files
        }
    });
});

// Route to get a specific test
app.get('/tests/:testName', (req, res) => {
    const testName = req.params.testName;
    const filePath = `./tests/${testName}`;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading test file:", err);
            res.status(500).send("Error fetching the test.");
        } else {
            res.json(JSON.parse(data)); // Send the test data
        }
    });
});

// Route to delete a test
app.delete('/tests/:testName', (req, res) => {
    const testName = req.params.testName;
    const filePath = `./tests/${testName}`;
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting test file:", err);
            res.status(500).send("Error deleting the test.");
        } else {
            console.log("Test deleted successfully!");
            res.send('Test deleted!');
        }
    });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});