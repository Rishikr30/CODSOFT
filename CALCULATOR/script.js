// Calculator state variables
let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

// DOM elements
const display = document.getElementById('currentDisplay');

// Update display function
function updateDisplay() {
    if (currentInput.length > 12) {
        display.textContent = parseFloat(currentInput).toExponential(6);
    } else {
        display.textContent = currentInput;
    }
}

// Append number to current input
function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }

    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else if (currentInput.length < 15) {
        currentInput += number;
    }

    updateDisplay();
}

// Append decimal point
function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }

    updateDisplay();
}

// Set operation
function setOperation(op) {
    if (operator !== '' && !shouldResetDisplay) {
        calculate();
    }

    // Remove active class from all operator buttons
    document.querySelectorAll('.btn-operator').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to current operator
    document.querySelector(`[data-operation="${op}"]`).classList.add('active');

    operator = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
}

// Perform calculation
function calculate() {
    if (operator === '' || shouldResetDisplay) return;

    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;

    // Perform calculation based on operator
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                showError('Cannot divide by zero');
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    // Handle result formatting
    if (isNaN(result) || !isFinite(result)) {
        showError('Invalid operation');
        return;
    }

    // Round to prevent floating point errors
    result = Math.round(result * 1000000000000) / 1000000000000;

    currentInput = result.toString();
    operator = '';
    previousInput = '';
    shouldResetDisplay = true;

    // Remove active class from all operator buttons
    document.querySelectorAll('.btn-operator').forEach(btn => {
        btn.classList.remove('active');
    });

    updateDisplay();
}

// Clear all
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;

    // Remove active class from all operator buttons
    document.querySelectorAll('.btn-operator').forEach(btn => {
        btn.classList.remove('active');
    });

    display.classList.remove('error');
    updateDisplay();
}

// Clear entry
function clearEntry() {
    currentInput = '0';
    display.classList.remove('error');
    updateDisplay();
}

// Delete last character
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }

    display.classList.remove('error');
    updateDisplay();
}

// Show error message
function showError(message) {
    display.textContent = message;
    display.classList.add('error');
    document.querySelector('.calculator').classList.add('shake');

    setTimeout(() => {
        document.querySelector('.calculator').classList.remove('shake');
    }, 300);

    // Reset after showing error
    setTimeout(() => {
        clearAll();
    }, 2000);
}

// Keyboard support
document.addEventListener('keydown', function (event) {
    const key = event.key;

    // Prevent default behavior for calculator keys
    if (/[0-9+\-*/.=]|Enter|Escape|Backspace/.test(key)) {
        event.preventDefault();
    }

    // Handle number keys
    if (/[0-9]/.test(key)) {
        appendNumber(key);
    }

    // Handle operator keys
    else if (key === '+') {
        setOperation('+');
    }
    else if (key === '-') {
        setOperation('-');
    }
    else if (key === '*') {
        setOperation('*');
    }
    else if (key === '/') {
        setOperation('/');
    }

    // Handle special keys
    else if (key === '.' || key === ',') {
        appendDecimal();
    }
    else if (key === '=' || key === 'Enter') {
        calculate();
    }
    else if (key === 'Escape') {
        clearAll();
    }
    else if (key === 'Backspace') {
        deleteLast();
    }
});

// Initialize display
updateDisplay();