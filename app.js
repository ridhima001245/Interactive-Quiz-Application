// Quiz data with different question types
const quizData = [
    {
        type: "multiple-choice",
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        correctAnswer: "JavaScript"
    },
    {
        type: "true-false",
        question: "CSS stands for Cascading Style Sheets",
        correctAnswer: true
    },
    {
        type: "fill-blank",
        question: "The HTML tag for creating a paragraph is called ______",
        correctAnswer: "p"
    },
    {
        type: "multiple-choice",
        question: "What year was JavaScript launched?",
        options: ["1996", "1995", "1994", "None of the above"],
        correctAnswer: "1995"
    },
    {
        type: "true-false",
        question: "React is a framework for building user interfaces",
        correctAnswer: false
    },
    {
        type: "fill-blank",
        question: "HTTP stands for HyperText ______ Protocol",
        correctAnswer: "Transfer"
    }
];

// DOM elements
const quizContainer = document.getElementById('quiz');
const progressBar = document.createElement('div');
const timerElement = document.createElement('div');
const questionCountElement = document.createElement('div');
const questionTextElement = document.createElement('div');
const answerSectionElement = document.createElement('div');
const controlsElement = document.createElement('div');
const nextButton = document.createElement('button');
const restartButton = document.createElement('button');

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let selectedAnswer = null;
let quizCompleted = false;

// Initialize the quiz
function initQuiz() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';

    const progressBarOuter = document.createElement('div');
    progressBarOuter.className = 'progress-bar';

    progressBar.className = 'progress';
    progressBarOuter.appendChild(progressBar);

    timerElement.className = 'timer';
    timerElement.innerHTML = `⏱️ ${timeLeft}s`;

    progressContainer.appendChild(document.createTextNode(`Question ${currentQuestionIndex + 1}/${quizData.length}`));
    progressContainer.appendChild(progressBarOuter);
    progressContainer.appendChild(timerElement);

    questionCountElement.className = 'question-count';
    questionTextElement.className = 'question-text';
    answerSectionElement.className = 'answer-section';
    answerSectionElement.id = 'answer-section';

    controlsElement.className = 'controls';

    nextButton.className = 'next-btn disabled';
    nextButton.textContent = 'Next';
    nextButton.disabled = true;

    restartButton.className = 'restart-btn';
    restartButton.textContent = 'Restart';
    restartButton.style.display = 'none';

    controlsElement.appendChild(nextButton);
    controlsElement.appendChild(restartButton);

    quizContainer.innerHTML = '';
    quizContainer.appendChild(progressContainer);
    quizContainer.appendChild(questionCountElement);
    quizContainer.appendChild(questionTextElement);
    quizContainer.appendChild(answerSectionElement);
    quizContainer.appendChild(controlsElement);

    loadQuestion();
    startTimer();

    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', restartQuiz);
}

function loadQuestion() {
    const current = quizData[currentQuestionIndex];

    progressBar.style.width = `${(currentQuestionIndex / quizData.length) * 100}%`;

    questionCountElement.textContent = `Question ${currentQuestionIndex + 1}/${quizData.length}`;
    questionTextElement.textContent = current.question;
    answerSectionElement.innerHTML = '';

    timeLeft = 15;
    timerElement.innerHTML = `⏱️ ${timeLeft}s`;
    selectedAnswer = null;
    nextButton.disabled = true;
    nextButton.classList.add('disabled');

    switch (current.type) {
        case 'multiple-choice': loadMultipleChoice(current); break;
        case 'true-false': loadTrueFalse(current); break;
        case 'fill-blank': loadFillBlank(current); break;
    }
}

function loadMultipleChoice(question) {
    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.addEventListener('click', () => selectAnswer(option, question.correctAnswer));
        answerSectionElement.appendChild(btn);
    });
}

function loadTrueFalse(question) {
    ['True', 'False'].forEach(val => {
        const btn = document.createElement('button');
        btn.textContent = val;
        btn.addEventListener('click', () => selectAnswer(val === 'True', question.correctAnswer));
        answerSectionElement.appendChild(btn);
    });
}

function loadFillBlank(question) {
    const container = document.createElement('div');
    container.className = 'fill-in-section';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'fill-in-input';
    input.placeholder = 'Type your answer here...';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.className = 'next-btn';
    submitBtn.style.marginTop = '1rem';

    submitBtn.addEventListener('click', () => {
        const userAnswer = input.value.trim().toLowerCase();
        selectAnswer(userAnswer, question.correctAnswer.toString().toLowerCase());
    });

    container.appendChild(input);
    container.appendChild(submitBtn);
    answerSectionElement.appendChild(container);
}

function selectAnswer(answer, correctAnswer) {
    clearInterval(timer);
    if (quizCompleted) return;

    const buttons = answerSectionElement.querySelectorAll('button:not(.next-btn)');
    const input = answerSectionElement.querySelector('input');

    if (buttons.length) {
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correctAnswer.toString()) btn.classList.add('correct');
            if (btn.textContent === answer.toString() && answer !== correctAnswer) btn.classList.add('incorrect');
            if (btn.textContent === answer.toString()) btn.classList.add('selected');
        });
    } else if (input) {
        input.disabled = true;
        const submitBtn = answerSectionElement.querySelector('button.next-btn');
        if (submitBtn) submitBtn.disabled = true;

        const resultText = document.createElement('div');
        resultText.style.marginTop = '1rem';
        resultText.style.fontWeight = 'bold';

        if (answer === correctAnswer.toLowerCase()) {
            resultText.textContent = 'Correct!';
            resultText.style.color = 'var(--success-color)';
            score++;
        } else {
            resultText.textContent = `Incorrect! The correct answer is: ${correctAnswer}`;
            resultText.style.color = 'var(--error-color)';
        }

        answerSectionElement.appendChild(resultText);
    }

    if (answer.toString().toLowerCase() === correctAnswer.toString().toLowerCase() && !input) {
        score++;
    }

    selectedAnswer = answer;
    nextButton.disabled = false;
    nextButton.classList.remove('disabled');
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timerElement.innerHTML = `⏱️ ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = `⏱️ ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerExpired();
        }
    }, 1000);
}

function timerExpired() {
    if (quizCompleted) return;

    const current = quizData[currentQuestionIndex];
    const buttons = answerSectionElement.querySelectorAll('button:not(.next-btn)');
    const input = answerSectionElement.querySelector('input');

    if (buttons.length) {
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === current.correctAnswer.toString()) btn.classList.add('correct');
        });
    } else if (input) {
        input.disabled = true;
        const submitBtn = answerSectionElement.querySelector('button.next-btn');
        if (submitBtn) submitBtn.disabled = true;

        const msg = document.createElement('div');
        msg.style.marginTop = '1rem';
        msg.style.fontWeight = 'bold';
        msg.textContent = `Time's up! The correct answer is: ${current.correctAnswer}`;
        msg.style.color = 'var(--error-color)';
        answerSectionElement.appendChild(msg);
    }

    nextButton.disabled = false;
    nextButton.classList.remove('disabled');
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        startTimer();
    } else {
        showResults();
    }
}

function showResults() {
    clearInterval(timer);
    quizCompleted = true;

    const percentage = Math.round((score / quizData.length) * 100);

    quizContainer.innerHTML = `
        <div class="score-section">
            <h2>Quiz Completed!</h2>
            <p>Your final score is ${score} out of ${quizData.length} (${percentage}%)</p>
        </div>

        <div class="score-details">
            <div class="score-box">
                <h3>Correct Answers</h3>
                <div class="score-value">${score}</div>
            </div>
            <div class="score-box">
                <h3>Total Questions</h3>
                <div class="score-value">${quizData.length}</div>
            </div>
            <div class="score-box">
                <h3>Percentage</h3>
                <div class="score-value">${percentage}%</div>
            </div>
        </div>

        <button class="restart-btn" id="restart-btn">Restart Quiz</button>
    `;

    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizCompleted = false;
    initQuiz();
}

document.addEventListener('DOMContentLoaded', initQuiz);
