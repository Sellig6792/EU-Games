from flask import Flask
from .games.games import games

app = Flask(__name__)
app.register_blueprint(games, url_prefix='/games')


@app.route('/')
def index():
    return ''
