document.addEventListener('DOMContentLoaded', (event) => {
    const saveNextButton = document.getElementById('save-next');
    const skipButton = document.getElementById('skip');
    const questionText = document.getElementById('question-text');
    const optionsList = document.getElementById('options-list');
    const questionStatus = document.querySelector('.status-grid');
    const timeDisplay = document.getElementById('time');
    const progressBar = document.getElementById('progress'); 

    let currentQuestionIndex = 0;
    let questions = [];
    let score = 0;
    let timer; 

    function startTimer(duration) {
        let timerSeconds = duration;
        timer = setInterval(function () {
            const minutes = Math.floor(timerSeconds / 60);
            const seconds = timerSeconds % 60;

            const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

            timeDisplay.textContent = `${displayMinutes}:${displaySeconds}`;

            if (--timerSeconds < 0) {
                clearInterval(timer);
                timerExpired();
            }
        }, 1000);
    }

    function timerExpired() {
        alert('Time is up! Quiz has ended.');
        completeQuiz();
    }
 
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestion();
            startTimer(180); // Set timer to 3 minutes (180 seconds)
            initQuestionStatus(questions.length);
        });

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionText.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
            optionsList.innerHTML = '';
            question.options.forEach((option, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<input type="radio" name="q${currentQuestionIndex}" id="q${currentQuestionIndex}a${index}" value="${option}">
                                <label for="q${currentQuestionIndex}a${index}">${option}</label>`;
                optionsList.appendChild(li);
            });

            if (currentQuestionIndex === questions.length - 1) {
                saveNextButton.textContent = 'Submit';
            } else {
                saveNextButton.textContent = 'Save & Next';
            }
        } else {
            completeQuiz();
        }
        updateProgressBar();
    }

    function initQuestionStatus(numQuestions) {
        for (let i = 0; i < numQuestions; i++) {
            const statusDiv = document.createElement('div');
            statusDiv.classList.add('status', 'not-attempted');
            statusDiv.id = `status-${i + 1}`;
            statusDiv.textContent = i + 1;
            questionStatus.appendChild(statusDiv);
        }
    }

    saveNextButton.addEventListener('click', () => {
        const selectedOption = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
        if (selectedOption && selectedOption.value === questions[currentQuestionIndex].answer) {
            score++;
        }
        markQuestionAsAttempted(currentQuestionIndex);
        currentQuestionIndex++;
        displayQuestion();
    });

    skipButton.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    questionStatus.addEventListener('click', (event) => {
        if (event.target.classList.contains('status')) {
            currentQuestionIndex = parseInt(event.target.id.split('-')[1]) - 1;
            displayQuestion();
        }
    });

    function markQuestionAsAttempted(index) {
        const statusDiv = document.getElementById(`status-${index + 1}`);
        if (statusDiv) {
            statusDiv.classList.remove('not-attempted');
            statusDiv.classList.add('attempted');
        }
    }

    function completeQuiz() {
        localStorage.setItem('quizScore', score);
        window.location.href = 'result.html';
    }

    function updateProgressBar() {
        const progress = (currentQuestionIndex + 1) / questions.length * 100;
        progressBar.style.width = `${progress}%`;
    }
});
