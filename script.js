
const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

let firstNumber = null;
let currentInput = "0";
let operator = null;
let waitingForSecond = false;
let showingResult = false;
let hasError = false;

// Basic math functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) return null;
    return a / b;
}

function operate(op, a, b) {
    switch (op) {
        case "+":
            return add(a, b);
        case "−":
            return subtract(a, b);
        case "×":
            return multiply(a, b);
        case "÷":
            return divide(a, b);
        default:
            return null;
    }
}

function updateDisplay() {
    display.textContent = currentInput;
}

function clearCalculator() {
    firstNumber = null;
    currentInput = "0";
    operator = null;
    waitingForSecond = false;
    showingResult = false;
    hasError = false;
    updateDisplay();
}

function showError() {
    clearCalculator();
    hasError = true;
    display.textContent = "Nice try! ÷0";
}

function formatResult(value) {
    return String(Number(value.toPrecision(10)));
}

function inputNumber(number) {
    if (hasError) clearCalculator();

    if (waitingForSecond || showingResult) {
        currentInput = number;
        waitingForSecond = false;
        showingResult = false;
        if (operator === null) firstNumber = null;
    } else if (currentInput === "0") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (hasError) clearCalculator();

    if (waitingForSecond || showingResult) {
        currentInput = "0.";
        waitingForSecond = false;
        showingResult = false;
        if (operator === null) firstNumber = null;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (hasError) return;

    if (operator !== null && !waitingForSecond) {
        const answer = operate(
            operator,
            firstNumber,
            Number(currentInput)
        );

        if (answer === null || !Number.isFinite(answer)) {
            showError();
            return;
        }

        currentInput = formatResult(answer);
        firstNumber = Number(currentInput);
        updateDisplay();
    } else if (firstNumber === null || showingResult) {
        firstNumber = Number(currentInput);
    }

    operator = nextOperator;
    waitingForSecond = true;
    showingResult = false;
}

function calculate() {
    if (
        hasError ||
        operator === null ||
        firstNumber === null ||
        waitingForSecond
    ) {
        return;
    }

    const answer = operate(
        operator,
        firstNumber,
        Number(currentInput)
    );

    if (answer === null || !Number.isFinite(answer)) {
        showError();
        return;
    }

    currentInput = formatResult(answer);
    firstNumber = null;
    operator = null;
    waitingForSecond = false;
    showingResult = true;

    updateDisplay();
}

function backspace() {
    if (hasError || showingResult) {
        clearCalculator();
        return;
    }

    if (waitingForSecond) return;

    currentInput = currentInput.slice(0, -1) || "0";
    updateDisplay();
}

// Handle calculator button clicks
buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const value = button.textContent.trim();

    if (button.classList.contains("clear")) {
        clearCalculator();
    } else if (button.classList.contains("backspace")) {
        backspace();
    } else if (button.classList.contains("equals")) {
        calculate();
    } else if (/^[0-9]$/.test(value)) {
        inputNumber(value);
    } else if (value === ".") {
        inputDecimal();
    } else if (button.classList.contains("operator")) {
        chooseOperator(value);
    }
});

clearCalculator();
