from flask import Flask, redirect, url_for
from .games.games import games

app = Flask(__name__)
app.register_blueprint(games, url_prefix='/games')


@app.route('/')
def index():
    return redirect(url_for('games.index'))
