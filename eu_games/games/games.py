from flask import Blueprint, render_template

games_bp = Blueprint('games', __name__, static_folder='static', static_url_path='static',
                     template_folder='templates')


@games_bp.route('/')
def games():
    return "This is an example app"


@games_bp.route('/capitals', defaults={'level': None})
@games_bp.route('/capitals/<int:level>')
def capitals(level: int = None):
    if level is None:
        return render_template('level_choice.html', game='games.capitals')
    return render_template('capitals.html', level=level)
