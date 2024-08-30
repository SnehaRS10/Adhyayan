document.addEventListener('DOMContentLoaded', (event) => {
    const scoreDisplay = document.getElementById('score-display');
    
    const quizScore = localStorage.getItem('quizScore');

    if (quizScore) {
        scoreDisplay.textContent = `Your score: ${quizScore}`;
    } else {
        scoreDisplay.textContent = 'Score not available';
    }
});
