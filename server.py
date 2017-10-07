
from flask import Flask, jsonify
import json
import time
import datetime

# If live updating and more debug info:
# >export FLASK_DEBUG=1
#

class RouteServer(Flask):

    def __init__(self, datafile, start_index):
        Flask.__init__(self, __name__, static_folder='static', static_url_path='')
        datafile = open(datafile)
        self.input_data = json.load(datafile)['location_history']
        self.start_index = start_index
        self.current_index = 1


app = RouteServer('data/94694.json', 1000)


@app.route("/")
def index():
    return app.send_static_file('index.html')


@app.route("/still")
def still():
    return app.send_static_file('still_route.html')


@app.route("/api")
def past_route(*args, **kwargs):
    return jsonify({'location_history': app.input_data[:app.start_index]})


@app.route("/api/help")
def api_root():
    result = {'api': 'enhanced snow plow'}
    resp = jsonify(result)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp


@app.route("/api/current")
def next_tick():
    data = app.input_data[app.current_index]
    app.current_index += 1
    return jsonify(data)


if __name__ == "__main__":
    app.run(port=8000)
    
