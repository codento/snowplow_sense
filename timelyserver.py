
from flask import Flask, jsonify
import json
import time
from datetime import datetime, timedelta

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
        self.time_diff = 0
        self.start_time = datetime.now()


app = RouteServer('data/94694.json', 1000)


@app.route("/")
def index():
    return app.send_static_file('index.html')


@app.route("/still")
def still():
    return app.send_static_file('still_route.html')


@app.route("/api")
def past_route(*args, **kwargs):
    ts = app.input_data[app.start_index]['timestamp']
    route_start_time = datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S")
    app.time_diff = datetime.now() - route_start_time
    return jsonify({'location_history': app.input_data[:app.start_index]})


@app.route("/api/help")
def api_root():
    result = {'api': 'enhanced snow plow'}
    resp = jsonify(result)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp


@app.route("/api/current")
def next_tick():
    this_data = app.input_data[app.current_index]
    this_datapoint_time = datetime.strptime(this_data['timestamp'], "%Y-%m-%dT%H:%M:%S")
    next_data = app.input_data[app.current_index + 1]
    next_datapoint_time = datetime.strptime(next_data['timestamp'], "%Y-%m-%dT%H:%M:%S")
    now = datetime.now() - app.time_diff

    while next_datapoint_time < now:
        app.current_index += 1
        this_data = app.input_data[app.current_index]
        this_datapoint_time = datetime.strptime(this_data['timestamp'], "%Y-%m-%dT%H:%M:%S")
        next_data = app.input_data[app.current_index + 1]
        next_datapoint_time = datetime.strptime(next_data['timestamp'], "%Y-%m-%dT%H:%M:%S")
        print('this: ', (this_datapoint_time + app.time_diff).timestamp())
        print('next: ', (next_datapoint_time + app.time_diff).timestamp())
        print('current:', datetime.now().timestamp())
    dist_between_timepoints = (next_datapoint_time - this_datapoint_time).total_seconds()
    ratio = (now - this_datapoint_time).total_seconds() / dist_between_timepoints
    #print(now - next_datapoint_time, now - this_datapoint_time)
    #print('this: ', (this_datapoint_time + app.time_diff).timestamp())
    #print('next: ', (next_datapoint_time + app.time_diff).timestamp())
    #print('current:', datetime.now().timestamp())
    buff_data = this_data.copy()
    buff_data['index'] = app.current_index
    this_x = this_data['coords'][0]
    this_y = this_data['coords'][1]
    dist_x = next_data['coords'][0] - this_x
    dist_y = next_data['coords'][1] - this_y
    buff_data['coords'] = [this_x + dist_x * ratio, this_y + dist_y * ratio]
    return jsonify(buff_data)


if __name__ == "__main__":
    app.run(port=8000)
