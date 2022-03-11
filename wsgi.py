from eu_games.main import app
from eu_games.games.games import games_bp
from os import environ

if __name__ == "__main__":
    app.register_blueprint(games_bp, url_prefix='/games')
    if environ.get("ENV") != "PROD":
        app.run(debug=True)
    else:
        app.run(debug=False)
