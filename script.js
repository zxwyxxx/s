function addQuestion() {
    const question = document.getElementById('question').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const option3 = document.getElementById('option3').value;
    const option4 = document.getElementById('option4').value;
    const answer = parseInt(document.getElementById('answer').value);

    if (question && option1 && option2 && option3 && option4 && answer >= 1 && answer <= 4) {
        const newQuestion = {
            question: question,
            options: [option1, option2, option3, option4],
            answer: answer
        };

        // Retrieve existing test data from local storage or initialize an empty array
        let test = JSON.parse(localStorage.getItem('test')) || [];

        // Add the new question to the test array
        test.push(newQuestion);

        // Store the updated test data in local storage
        localStorage.setItem('test', JSON.stringify(test));

        // Clear input fields
        document.getElementById('question').value = '';
        document.getElementById('option1').value = '';
        document.getElementById('option2').value = '';
        document.getElementById('option3').value = '';
        document.getElementById('option4').value = '';
        document.getElementById('answer').value = '';

        // Update the test preview
        displayTestPreview();
    } else {
        alert("Please fill in all fields correctly.");
    }
}

function displayTestPreview() {
    const test = JSON.parse(localStorage.getItem('test')) || [];
    const container = document.getElementById('questions-container');
    container.innerHTML = ''; // Clear previous preview

    test.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-preview');

        const questionText = document.createElement('p');
        questionText.innerHTML = `<strong>${index + 1}. ${q.question}</strong>`;
        questionDiv.appendChild(questionText);

        q.options.forEach((option, i) => {
            const optionText = document.createElement('p');
            optionText.innerText = `${i + 1}. ${option}`;
            questionDiv.appendChild(optionText);
        });

        const answerText = document.createElement('p');
        answerText.innerHTML = `<strong>Answer: ${q.answer}</strong>`;
        questionDiv.appendChild(answerText);

        container.appendChild(questionDiv);
    });
}

function downloadTest() {
    const testName = document.getElementById('test-name').value; // Get the test name
    const test = JSON.parse(localStorage.getItem('test'));

    if (testName && test && test.length > 0) {
        const testData = {
            name: testName,
            questions: test
        };
        const testJson = JSON.stringify(testData);

        // Create a Blob with the JSON data
        const blob = new Blob([testJson], { type: 'application/json' });

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = testName + '.json'; // Include test name in filename

        // Append the link to the DOM and trigger a click to download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Send the test data to the server using Fetch API
        fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: testJson  // Send the test data with the name
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    } else {
        alert("Please enter a test name and create at least one question.");
    }
}

// Clear local storage for testing or reset purposes (Optional for testing)
function clearTest() {
    localStorage.removeItem('test');
    displayTestPreview(); // Update preview after clearing
}

// Export functions for testing
module.exports = {
    addQuestion,
    displayTestPreview,
    downloadTest,
    clearTest
};
