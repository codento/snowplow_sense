
from flask import Flask, jsonify
import json
import time

# If live updating and more debug info:
# >export FLASK_DEBUG=1
#


app = Flask(__name__, static_folder='static', static_url_path='')

with open('data/94694.json') as json_text:
    input_data = json.load(json_text)['location_history']

start_index = 300
global current_index

@app.route("/")
def index():
    return app.send_static_file('index.html')


@app.route("/api")
def past_route(*args, **kwargs):
    return jsonify({'location_history': input_data[:start_index]})


@app.route("/api/help")
def api_root():
    result = {'api': 'enhanced snow plow'}
    resp = jsonify(result)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp


@app.route("/api/recent")
def next_tick():
    global current_index
    data = input_data[current_index]
    current_index += 1
    return jsonify(data)


if __name__ == "__main__":
    app.run(port=8000)
    
