from flask import Flask, render_template
import pandas as pd
import os

#to run "env FLASK_APP=w209_final_project_flask.py FLASK_ENV=development flask run"
app = Flask(__name__)
APP_FOLDER = os.path.dirname(os.path.realpath(__file__))
# joined = pd.read_json(os.path.join(APP_FOLDER, "data/demrep35j_113.json"),orient='split')

# print(joined.head())
# roll_1 = joined['Roll Call number']==1

party_df = pd.read_csv(os.path.join(APP_FOLDER, "data/HSall_parties.csv"))
roll_call_df = pd.read_csv(os.path.join(APP_FOLDER, "data/HS080_rollcalls.csv"))
all_votes_df = pd.read_csv(os.path.join(APP_FOLDER, "data/HSall_votes.csv"))
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getParty')
def getParty():
    return party_df.to_json(orient="records")

@app.route('/getRollCallByCongress/<int:congress>/<string:chamber>')
def getRollCallByCongress(congress,chamber):
	congressRollCall = roll_call_df[roll_call_df['congress'] == congress ]
	result = congressRollCall[congressRollCall['chamber'] == chamber]
	return result.to_json(orient="records")