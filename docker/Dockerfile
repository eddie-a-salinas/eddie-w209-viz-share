FROM python:3.8.6
RUN python3 -m pip install numpy===1.19.2
RUN python3 -m pip install pandas===1.1.2
RUN python3 -m pip install werkzeug===1.0.1
RUN python3 -m pip install flask===1.1.2
COPY run_site.sh /usr/local/bin/
CMD /usr/local/bin/run_site.sh
#esalina@2018comp:/mnt/five_tera/eddie-w209-viz-share/docker$ flask --version
#Python 3.6.9
#Flask 1.1.2
#Werkzeug 1.0.1
#esalina@2018comp:/mnt/five_tera/eddie-w209-viz-share$ find . -iname "*.py" -exec grep -Pi 'import' {} \;|sort|uniq
#from flask import Flask, render_template,send_file, abort
#import csv
#import json
#import numpy as np
#import os
#import pandas as pd
#import re

