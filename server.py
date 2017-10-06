
from flask import Flask, request, jsonify
import random
import time

#
# To start multiple servers that respond to React-frontend's queries, see startservers.py
#
# Run one server with
# >flask run
#
# If live updating and more debug info:
# >export FLASK_DEBUG=1
#
#


app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def index():
    delay = random.random() * 2
    if request.method == 'GET':
        print('GET w. delay: ', delay)
        time.sleep(delay)
        result = {'dimensions': [
            {'min_name': 'Sad', 'max_name': 'Happy'},
            {'min_name': 'Short', 'max_name': 'Long'}
        ]}
    else:
        tweet = request.form.get('value', '')
        print(f'POST w.delay: {delay}, received tweet: {tweet}')
        result = {'dimensions': [
            {'min_name': 'Sad', 'max_name': 'Happy', 'value': random.random()},
            {'min_name': 'Short', 'max_name': 'Long', 'value': len(tweet) / 144}
        ]}

    resp = jsonify(result)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp

    # Is it just a twitter handle?
    #tweet = tweet.strip()
    #if tweet.startswith('@') and len(tweet.split()) == 1:
    #    handle = tweet
    # fetch tweets from this handle...




