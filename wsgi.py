from eu_games.main import app
from eu_games.games.games import games
from os import environ

if __name__ == "__main__":
    app.register_blueprint(games, url_prefix='/games')
    if environ.get("ENV") != "PROD":
        app.run(host='0.0.0.0', debug=True)
    else:
        app.run(debug=False)
