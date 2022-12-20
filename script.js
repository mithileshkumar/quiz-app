let questionStore = [];
let count = 0;
let score = 0;
let chance = 3;

/**
 * Displays the final score and an option to restart the game.
 * All the configurations gets reset.
 */
function restartQuiz() {
    questionStore = [];
    count = 0;
    score = 0;
    chance = 3;

    document.getElementById('quiz-restart').style.visibility = 'hidden';
    document.getElementById('quiz-container').style.visibility = 'visible';
    document.getElementById('quiz-chance').textContent = chance;
    document.getElementById('quiz-score').textContent = score;
    document.getElementById('quiz-question').textContent = '';
    fetchQuestions();
}

/**
 * Switches between dark and light mode.
 */
function toggleMode() {
    document.body.classList.toggle('dark-mode');
}

/**
 * Only one question is shown at a time.
 * Since, the API brings list of 5 questions we maintain a counter which when reaches 5, 
 * the API to get questions is triggered again.
 * The answer which is converted to lowercase is decrypted and matched. 
 * The score and chances left depends upon this check.
 */
function showQuestions() {
    let answer = document.getElementById('quiz-answer').value.toLowerCase();
    if (sha1(answer) === questionStore[count].answerSha1) {
        score++;
    } else {
        chance--;
    }
    document.getElementById('quiz-answer').value = '';
    if (chance <= 0) {
        document.getElementById('quiz-container').style.visibility = 'hidden';
        document.getElementById('quiz-restart').style.visibility = 'visible';
        document.getElementById('quiz-final').textContent = score;
    } else {
        count++;
        document.getElementById('quiz-score').textContent = score;
        document.getElementById('quiz-chance').textContent = chance;
        document.getElementById('quiz-question').textContent = questionStore[count].question;
    }
    if (count > questionStore.length - 1) {
        fetchQuestions();
    }
}

/**
 * 
 * @param resQuestions : list of questions fetched via API
 * Checks duplicate entries and pushes only unique questions to question store.
 * If no new unique questions is found then the request is sent again.
 * TODO : Discuss and seek for optimized solution. 
 */
function pushUniqueQuestions(resQuestions) {
    const uniqueQuestions = resQuestions.filter(response => {
        const matched = questionStore.filter(store => store.question === response.question)
        return matched.length ? false : true;
    });
    if (uniqueQuestions.length === 0) {
        fetchQuestions();
    } else {
        questionStore = [...questionStore, ...uniqueQuestions];
    }
}

/**
 * Uses Promise API to fetch question list from server.
 * Loading handling is done to show indicator while fetching questions. 
 */
function fetchQuestions() {
    fetch('https://eok9ha49itquif.m.pipedream.net').then(res => res.json()).then(response => {
        pushUniqueQuestions(response.questions);
        document.getElementById('quiz-container').style.visibility = 'visible';
        document.getElementById('quiz-loading').style.visibility = 'hidden';
        document.getElementById('quiz-question').textContent = questionStore[count].question;
    }).catch(err => {
        document.getElementById('quiz-loading').style.visibility = 'hidden';
    });
}

document.getElementById('quiz-button').addEventListener('click', showQuestions);
document.getElementById('quiz-mode').addEventListener('click', toggleMode);
document.getElementById('quiz-restart__button').addEventListener('click', restartQuiz);
fetchQuestions();
