
from flask import Flask, jsonify
import json
import time

# If live updating and more debug info:
# >export FLASK_DEBUG=1
#


app = Flask(__name__, static_folder='static', static_url_path='')

with open('data/94694.json') as json_text:
    input_data = json.load(json_text)

@app.route("/")
def index():
    return app.send_static_file('index.html')

@app.route("/")
def emulate_motion(input_data):
    for elem in input_data['location_history']:
        time.sleep(1)
        print(elem['timestamp'])

@app.route("/api")
def api_root():
    result = {'api': 'enhanced snow plow'}
    resp = jsonify(result)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp


if __name__ == "__main__":
    emulate_motion(input_data)
    app.run(port=8000)
    
