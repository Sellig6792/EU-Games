const answers_url = document.querySelector('meta[name="answers_url"]').content;
const choices_number = parseInt(document.querySelector('meta[name="choices_number"]').content);



fetch(answers_url).then(resp => { if (resp.ok) { return resp.json() } }).then(answers => {
    answers = answers['CAPITALS'];
    const countries = _.shuffle(Object.keys(answers));
    let todo_countries = countries;

    console.table(countries)
    function newQuestion() {
        let country = _.sample(todo_countries);

        todo_countries = _.without(todo_countries, country)
        return country
    }
    console.log(newQuestion());
    console.table(todo_countries);
    function check_answer(obj) {
            console.log(obj.value);

        }


})
