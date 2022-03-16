const answers_url = document.querySelector('meta[name="answers_url"]').content;
const choices_number = parseInt(document.querySelector('meta[name="choices_number"]').content);
const p_country = document.getElementById('country');
let score = 0;

function createAnswersButtons(country, countries, answers, todo_countries) {
    let bad_answer_country;
    let answer_button = document.createElement('button');
    answer_button.classList.add('answers-options');
    answer_button.id = 'good-answer';
    answer_button.onclick = function() { check_answer(true, todo_countries) };
    answer_button.textContent = answers[country];
    answer_button.style.border = 'none';

    let answers_options = [answer_button];
    while (answers_options.length < choices_number) {
        bad_answer_country = _.sample(countries);
        if (bad_answer_country != country) {
            answer_button = document.createElement('button');
            answer_button.classList.add('answers-options', 'bad-answers');
            answer_button.onclick = function() { check_answer(false, todo_countries) };
            answer_button.style.border = 'none';
            answer_button.textContent = answers[bad_answer_country];
            answers_options.push(answer_button);
        }
    }
    _.shuffle(answers_options).forEach(element => {
        let answers_buttons_div = document.createElement('div');
        answers_buttons_div.classList.add('answers-sub-div');
        answers_buttons_div.appendChild(element);
        document.getElementById('answers-div').appendChild(answers_buttons_div);
    })
}

function newQuestion(countries, todo_countries, answers) {
    if (todo_countries.length === 0) {
        alert(`Score de ${score}/27`)
    }

    document.querySelectorAll('.answers-options').forEach(e => e.remove());
    document.querySelectorAll('.answers-sub-div').forEach(e => e.remove());

    let country = _.sample(todo_countries);
    todo_countries = _.without(todo_countries, country);

    p_country.textContent = country;
    createAnswersButtons(country, countries, answers, todo_countries);
    return country;
}

function check_answer(good, todo_countries) {
    if (document.getElementById('next-button') != null) { return; }

    if (good) {
        score += 1;
        document.getElementById('good-answer').style.background = '#40ad11';
    } else {
        document.getElementById('good-answer').style.background = '#40ad11';
        document.querySelectorAll('.bad-answers').forEach(element => { element.style.background = '#bf1900'; })
    }
    let next_button = document.createElement('button');
    next_button.id = 'next-button';
    next_button.textContent = "Continuer";
    next_button.onclick = function() { next(todo_countries) };

    document.getElementById('answers-div').appendChild(next_button)
}

function next(todo_countries) {
    document.getElementById('next-button').remove();
    fetch(answers_url).then(resp => { if (resp.ok) { return resp.json() } }).then(answers => {
        answers = answers['CAPITALS'];
        const countries = Object.keys(answers);
        newQuestion(countries, todo_countries, answers);
    })
}

fetch(answers_url).then(resp => { if (resp.ok) { return resp.json() } }).then(answers => {

    answers = answers['CAPITALS'];
    const countries = Object.keys(answers);
    let todo_countries = _.shuffle(countries);

    newQuestion(countries, todo_countries, answers);

})
