const answers_url = document.querySelector('meta[name="answers_url"]').content;
const choices_number = parseInt(document.querySelector('meta[name="choices_number"]').content);
const game_answers_key = document.querySelector('meta[name="game_answers_key"]').content;
const redirect_to_games = function () { document.location.href = document.querySelector('meta[name="games_url"]').content; }
const p_question = document.getElementById('question');
const answers_div = document.getElementById('answers-div');
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
let score = 0;

// Génère les boutons avec les réponses vraies et fausses
function createAnswersButtons(question, questions, answers, todo_questions) {
    let bad_answer_question, bad_answer;
    let answer_button = document.createElement('button');
    answer_button.classList.add('answers-options');
    answer_button.id = 'good-answer';
    answer_button.onclick = function () { checkAnswer(true, todo_questions) };
    answer_button.textContent = answers[question];
    answer_button.style.border = 'none';

    let answers_options = [answer_button];
    let answers_options_text = [answers[question]];
    while (answers_options.length < choices_number) {
        bad_answer_question = _.sample(questions);
        bad_answer = answers[bad_answer_question];
        if (answers_options_text.indexOf(bad_answer) < 0) {
            answer_button = document.createElement('button');
            answer_button.classList.add('answers-options', 'bad-answers');
            answer_button.onclick = function () { checkAnswer(false, todo_questions) };
            answer_button.style.border = 'none';
            answer_button.textContent = bad_answer;
            answers_options_text.push(bad_answer);
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
    let answer_submit = document.createElement('button');
    let good_answer = document.createElement('p');
    answer_input.id = 'answer-input';
    answer_input.placeholder = "Entrez la réponse";
    answer_input.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('answer-submit').click();
        }
    })

    answer_submit.type = 'submit';
    answer_submit.textContent = ">";
    answer_submit.id = 'answer-submit';
    answer_submit.onclick = function () {
        checkAnswer(document.getElementById('answer-input').value.trim() == answers[question], todo_questions);
        document.getElementById('answer-submit').remove();
    }
    if (isSafari) { answer_submit.style.height = '132px'; }

    good_answer.id = 'good-answer';
    good_answer.textContent = answers[question];
    good_answer.style.display = 'none';
    good_answer.style.color = '#e0e0e0';
    answers_div.appendChild(answer_input);
    answers_div.appendChild(answer_submit);
    answers_div.appendChild(good_answer);
}
// Génère une nouvelle question
function newQuestion(questions, todo_questions, answers) {
    if (todo_questions.length === 0) {
        alert(`Score de ${score}/27`)
        redirect_to_games();
    }

    document.querySelectorAll('.answers-options').forEach(e => e.remove());
    document.querySelectorAll('.answers-sub-div').forEach(e => e.remove());
    document.querySelectorAll('#answer-input').forEach(e => e.remove());
    document.querySelectorAll('#good-answer').forEach(e => e.remove());
    answers_div.style.backgroundColor = 'unset';

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
function checkAnswer(good, todo_questions) {
    if (document.getElementById('next-button') != null) { return; }
    if (choices_number == 0) {
        let answer_input = document.getElementById('answer-input');
        answer_input.style.borderRadius = '40px';
        answer_input.style.width = '100%';
        answer_input.style.borderWidth = '0';
        answer_input.disabled = true;
        answer_input.style.color = '#e0e0e0';
        answer_input.style.webkitTextFillColor = '#e0e0e0';
        answer_input.style.opacity = '1';
        answers_div.style.height = '200px';
    } else if (choices_number == 4) {
        answers_div.style.height = '502px';
    } else if (choices_number == 2) {
        answers_div.style.height = '248px';
    }
    if (isSafari && choices_number === 0) {
        answers_div.style.height = (parseInt(answers_div.style.height.substring(0, 3)) + 25).toString() + 'px';
    }

    if (good) {
        score += 1;
        if (choices_number == 0) {
            document.getElementById('answer-input').style.background = '#40ad11';
        } else {
            document.getElementById('good-answer').style.background = '#40ad11';
            document.getElementById('good-answer').style.color = '#e0e0e0';
        }
    } else {
        let good_answer = document.getElementById('good-answer');
        answers_div.style.backgroundColor = '#bf1900';

        if (choices_number == 0) {
            let answer_input = document.getElementById('answer-input');
            answer_input.style.background = '#bf1900';
            if (answer_input.value == '') { answer_input.value = ' '; }
            good_answer.style.display = 'unset';
            good_answer.style.fontSize = '80px';
            good_answer.style.fontFamily = '\'Fredoka\', sans-serif';

        } else {
            good_answer.style.backgroundColor = '#40ad11';
            document.querySelectorAll('.bad-answers').forEach(e => { e.style.background = '#bf1900'; });
            document.querySelectorAll('.answers-options').forEach(e => { e.style.color = '#e0e0e0'; });
        }
    }
    let next_button = document.createElement('button');
    next_button.id = 'next-button';
    next_button.textContent = "Continuer →";
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