const answers_url = document.querySelector('meta[name="answers_url"]').content;
const choices_number = parseInt(document.querySelector('meta[name="choices_number"]').content);
const game_answers_key = document.querySelector('meta[name="game_answers_key"]').content;
const p_question = document.getElementById('question');
const answers_div = document.getElementById('answers-div');
let score = 0;

// Génère les boutons avec les réponses vraies et fausses
function createAnswersButtons(question, questions, answers, todo_questions) {
    let bad_answer_question;
    let answer_button = document.createElement('button');
    answer_button.classList.add('answers-options');
    answer_button.id = 'good-answer';
    answer_button.onclick = function () { checkAnswer(true, todo_questions) };
    answer_button.textContent = answers[question];
    answer_button.style.border = 'none';

    let answers_options = [answer_button];
    while (answers_options.length < choices_number) {
        bad_answer_question = _.sample(questions);
        if (bad_answer_question != question) {
            answer_button = document.createElement('button');
            answer_button.classList.add('answers-options', 'bad-answers');
            answer_button.onclick = function () { checkAnswer(false, todo_questions) };
            answer_button.style.border = 'none';
            answer_button.textContent = answers[bad_answer_question];
            answers_options.push(answer_button);
        }
    }
    _.shuffle(answers_options).forEach(element => {
        let answers_buttons_div = document.createElement('div');
        answers_buttons_div.classList.add('answers-sub-div');
        answers_buttons_div.appendChild(element);
        answers_div.appendChild(answers_buttons_div);
    })
}

// Génère le champs de texte
function createAnswerInput(question, answers, todo_questions) {
    let answer_input = document.createElement('input');
    let answer_submit = document.createElement('input');
    answer_input.id = 'answer-input';
    answer_input.placeholder = "Entrez la réponse";
    answer_input.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('answer-submit').click();
        }
    })
    answer_submit.type = 'submit';
    answer_submit.value = "OK";
    answer_submit.id = 'answer-submit';
    answer_submit.onclick = function () {
        checkAnswer(document.getElementById('answer-input').value == answers[question], todo_questions, bg = false);
        document.getElementById('answer-submit').remove();
    }
    answers_div.appendChild(answer_input);
    answers_div.appendChild(answer_submit);
}
// Génère une nouvelle question
function newQuestion(questions, todo_questions, answers) {
    if (todo_questions.length === 0) {
        alert(`Score de ${score}/27`)
    }

    document.querySelectorAll('.answers-options').forEach(e => e.remove());
    document.querySelectorAll('.answers-sub-div').forEach(e => e.remove());
    document.querySelectorAll('#answer-input').forEach(e => e.remove());

    let question = _.sample(todo_questions);
    todo_questions = _.without(todo_questions, question);

    p_question.textContent = question;
    if (choices_number > 1) {
        createAnswersButtons(question, questions, answers, todo_questions);
    } else {
        createAnswerInput(question, answers, todo_questions);
    }
}

// Vérifie la réponse donnée
function checkAnswer(good, todo_questions, bg = true) {
    if (document.getElementById('next-button') != null) { return; }

    if (good) {
        score += 1;
        alert(score);
        if (bg) {
            document.getElementById('good-answer').style.background = '#40ad11';
        }
    } else if (bg && good === false) {
        document.getElementById('good-answer').style.background = '#40ad11';
        document.querySelectorAll('.bad-answers').forEach(element => { element.style.background = '#bf1900'; })
    }
    let next_button = document.createElement('button');
    next_button.id = 'next-button';
    next_button.textContent = "Continuer";
    next_button.onclick = function () { next(todo_questions) };

    document.getElementById('answers-div').appendChild(next_button)
}

function next(todo_questions) {
    document.getElementById('next-button').remove();
    fetch(answers_url).then(resp => { if (resp.ok) { return resp.json() } }).then(answers => {
        answers = answers[game_answers_key];
        const questions = Object.keys(answers);
        newQuestion(questions, todo_questions, answers);
    })
}

fetch(answers_url).then(resp => { if (resp.ok) { return resp.json() } }).then(answers => {

    answers = answers[game_answers_key];
    const questions = Object.keys(answers);
    let todo_questions = _.shuffle(questions);

    newQuestion(questions, todo_questions, answers);

})
