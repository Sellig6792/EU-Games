from flask import Blueprint, render_template
games = Blueprint('games', __name__, static_folder='static', static_url_path='static',
                  template_folder='templates')


@games.route('/')
def index():
    return "This is an example app"


@games.route('/capitals', defaults={'choices_number': None})
@games.route('/capitals/<int:choices_number>')
def capitals(choices_number: int = None):
    if choices_number is None:
        return render_template('level_choice.html', game='games.capitals')
    print(choices_number)
    return render_template('capitals.html', choices_number=choices_number, game_answers_key='CAPITALS')
