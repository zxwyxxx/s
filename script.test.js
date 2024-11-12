describe('addQuestion', () => {
    beforeEach(() => {
        document.getElementById = jest.fn();
        document.getElementById.mockReturnValue({ value: '' });

        global.localStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
        };
    });

    it('should add a question to the test array and store it in localStorage', () => {
        // Setup mock values for input fields
        document.getElementById.mockReturnValueOnce({ value: 'Test Question' });
        document.getElementById.mockReturnValueOnce({ value: 'Option 1' });
        document.getElementById.mockReturnValueOnce({ value: 'Option 2' });
        document.getElementById.mockReturnValueOnce({ value: 'Option 3' });
        document.getElementById.mockReturnValueOnce({ value: 'Option 4' });
        document.getElementById.mockReturnValueOnce({ value: '1' });

        addQuestion();

        // Check if localStorage.setItem was called
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'test',
            expect.stringContaining('Test Question')
        );
    });

    it('should alert if fields are missing', () => {
        global.alert = jest.fn();  // Mock alert
        addQuestion();  // Call the function without proper fields

        // Check if alert was called
        expect(global.alert).toHaveBeenCalledWith('Please fill in all fields correctly.');
    });
});

describe('displayTestPreview', () => {
    it('should display the test preview correctly', () => {
        const mockContainer = { innerHTML: '', appendChild: jest.fn() };
        document.getElementById.mockReturnValue(mockContainer);

        localStorage.getItem.mockReturnValueOnce(JSON.stringify([{
            question: 'Question 1',
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            answer: 1
        }]));

        displayTestPreview();

        expect(mockContainer.appendChild).toHaveBeenCalled();
    });
});

describe('clearTest', () => {
    it('should clear the test from localStorage', () => {
        global.localStorage.removeItem.mockClear();
        clearTest();

        expect(localStorage.removeItem).toHaveBeenCalledWith('test');
    });
});

describe('downloadTest', () => {
    it('should create a download link and send data', () => {
        document.getElementById.mockReturnValueOnce({ value: 'Test 1' });
        localStorage.getItem.mockReturnValueOnce(JSON.stringify([{
            question: 'Question 1',
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            answer: 1
        }]));

        downloadTest();

        expect(localStorage.getItem).toHaveBeenCalled();
    });

    it('should alert if no test name or questions exist', () => {
        global.alert = jest.fn();
        document.getElementById.mockReturnValueOnce({ value: '' });

        downloadTest();

        expect(global.alert).toHaveBeenCalledWith('Please enter a test name and create at least one question.');
    });
});
