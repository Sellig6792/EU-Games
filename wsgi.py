from eu_games.main import app
from os import environ

if __name__ == "__main__":
    if environ.get("ENV") != "PROD":
        app.run(host='0.0.0.0', debug=True)
    else:
        app.run(debug=False)
