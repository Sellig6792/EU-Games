from flask import Blueprint, render_template

games_bp = Blueprint('games_bp', __name__, static_folder='static', template_folder='templates')


@games_bp.route('/')
def games():
    return "This is an example app"


@games_bp.route('/capitals')
def capitals():
    return render_template('')
