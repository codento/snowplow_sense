
from flask import Flask, jsonify

# If live updating and more debug info:
# >export FLASK_DEBUG=1
#


app = Flask(__name__, static_folder='static', static_url_path='')


@app.route("/")
def index():
    return app.send_static_file('index.html')


@app.route("/api")
def api_root():
    result = {'api': 'enhanced snow plow'}
    resp = jsonify(result)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp


if __name__ == "__main__":
    app.run(port=8000)
