# Snowplow sense

Tarkempaa dataa lumiaurojen ja muiden tiehuoltokoneiden tilasta.

Miili Halkka, Turo Mikkonen ja Jukka Purma, Codento Oy.
StreetReboot -hackathoniin. 

The map visualisation is a fork from Sampsa Kuronen's Aurat kartalla (https://github.com/sampsakuronen/auratkartalla).

## What we have here

The idea is that we serve one static html page, index.html, that fetches data from the API provided by the same server.
The API is an enhanced version of Stara's snowplow API, http://dev.stadilumi.fi/api/v1/snowplow/ , enhanced with more 
exact information about the state of the machine, e.g. is it actually plowing or not.

The enhanced API uses data from real snowplow API and combines it with sensor data from our other sources: in first 
prototype it receives some data from Arduino sensors in a lego tractor.

## Dependencies

Python & Flask for api server, 
SaSS for compiling CSS. 

See requirements.txt.
Use virtualenv for python:

### Preparing and using virtualenv
It is recommended but not necessary to have *Portfolio visualizer* running in `virtualenv`: then it will have its own dedicated python interpreter and libraries for required dependencies. In that way requirements for *Portfolio visualizer* won't affect your other python projects, anv vice versa.

The following command will create virtualenv named 'venv' with Python3.6 and its default libraries.

    $ virtualenv venv

The command will report which python version it used as a base. If the reported version is python version is 2.x, delete the venv folder and try again with argument `--python=python3`, or with the full path to your python3 interpreter.

Now, when doing anything related to *Portfolio visualizer* and its python scripts, you want to be *inside* the virtual environment. Activate it with:

    $ source venv/bin/activate

Now your command prompt should be prefixed with `(venv)`. All the following requirement installation and python commands should be done in (venv)-terminal. In following commands it is unnecessary to use `python3`, just `python` will do.    

To deactivate virtualenv, just call

    $ venv/bin/deactivate

Remember that whenever you start a new terminal and want to work with *Snowplow sense*, you have to start virtualenv with the previous `source venv/bin/activate`.

### Installing requirements

Ensure that you have necessary libraries installed by running requirements.txt from the project root folder.
```
$ pip install -r requirements.txt
```


## Compiling sass to css

We removed Compass from dependencies, SASS file in sass -folder can be compiled to css with `sass main.sass ../static/css/main.css`

## Starting servers 


    $ python server.py
    
Open `localhost:8000 in browser. See also `localhost:8000/api`.

## MIT License`

Copyright (c) 2017 Codento Oy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

