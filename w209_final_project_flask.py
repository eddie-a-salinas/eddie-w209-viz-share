from flask import Flask, render_template,send_file, abort
import pandas as pd
import numpy as np
import os

#to run "env FLASK_APP=w209_final_project_flask.py FLASK_ENV=development flask run"
app = Flask(__name__)
APP_FOLDER = os.path.dirname(os.path.realpath(__file__))
# joined = pd.read_json(os.path.join(APP_FOLDER, "data/demrep35j_113.json"),orient='split')

# print(joined.head())
# roll_1 = joined['Roll Call number']==1

roll_call_df = pd.read_csv(os.path.join(APP_FOLDER, "data/demrep35j_113_clean.csv"))
all_votes_house_df = pd.read_csv(os.path.join(APP_FOLDER, "data/house_vote.csv"))
all_votes_senate_df = pd.read_csv(os.path.join(APP_FOLDER, "data/senate_vote.csv"))

def get_total_votes_per_congress(df_raw, chamber):
    df = df_raw.copy()   
    df["Total_Dem_Votes"] =  df.apply(lambda row: row['Number_Democrat_Nays'] + row['Number_Democrat_Yeas'], axis=1)
    df["Total_Rep_Votes"] =  df.apply(lambda row: row['Number_Republican_Nays'] + row['Number_Republican_Yeas'], axis=1)
     
    columns = ['Congress_number', 'House', 'Total_Dem_Votes', 'Total_Rep_Votes' ]               
    df = df.loc[df.House == chamber, columns]
    
    df_agg = df.groupby('Congress_number').agg(Dem_Votes = pd.NamedAgg(column='Total_Dem_Votes', aggfunc=sum),
                                           Rep_Votes = pd.NamedAgg(column='Total_Rep_Votes', aggfunc=sum))
    return df_agg

def get_total_rollcalls_per_congress(df_raw, chamber):
    df = df_raw.copy()    
    columns = ['Congress_number', 'House', 'Roll_Call_number']               
    df = df.loc[df.House == chamber, columns]    

    df_agg = df.groupby('Congress_number').agg(Total_Roll_Calls=('Roll_Call_number', 'count'))
    Congress_Year = [1857 + (2 * i) for i in range(79)]
    df_agg['Congress_Year'] = Congress_Year
    return df_agg
house_rollcalls_df = get_total_rollcalls_per_congress(roll_call_df, 'house')
senate_rollcalls_df = get_total_rollcalls_per_congress(roll_call_df, 'senate')
house_vote_per_congress_df = get_total_votes_per_congress(roll_call_df, "house")
senate_vote_per_congress_df = get_total_votes_per_congress(roll_call_df, "senate")



@app.route('/')
def index():
    return render_template('index.html')


# @app.route('/getRollCall')
# def getRollCall():
# 	return roll_call_df.to_json(orient="records")

@app.route('/getRollCallByCongress/<int:congress>/<string:chamber>')
def getRollCallByCongress(congress,chamber):
	congressRollCall = roll_call_df[roll_call_df['Congress_number'] == congress ]
	result = congressRollCall[congressRollCall['House'] == chamber]
	return result.to_json(orient="records")

@app.route('/getVotesPerCongress/<string:chamber>')
def getVotesPerCongress(chamber):

	if chamber == 'house':
		return house_vote_per_congress_df.to_json(orient='records')
	else:
		return senate_vote_per_congress_df.to_json(orient='records')

@app.route('/getTotalRollcallsPerCongress/<string:chamber>')
def getTotalRollcallsPerCongress(chamber):

	if chamber == 'house':
		return house_rollcalls_df.to_json(orient='records')
	else:
		return senate_rollcalls_df.to_json(orient='records')

@app.route('/getMemberVote/<int:congress>/<int:rollcall>/<string:chamber>')
def getMemberVote(congress,rollcall,chamber):
	if str(chamber).lower() == 'house':

		memberVoteDF = all_votes_house_df[(all_votes_house_df['congress']==congress) & (all_votes_house_df['rollnumber']==rollcall)]
	else:
		memberVoteDF = all_votes_senate_df[(all_votes_senate_df['congress']==congress) & (all_votes_senate_df['rollnumber']==rollcall)]

	return memberVoteDF.to_json(orient='records')

@app.route('/pct_party/<int:congress>/<string:chamber>')
def getPctPartyCache(congress,chamber):
	c_int=int(congress)
	f_base="data/memo_party/pp."+chamber+"."+str(c_int).zfill(3)+".json"
	if(os.path.exists(f_base)):
		#print("f_base is "+str(f_base))
		return send_file(f_base)
	else:
		abort(404, description="Resource not found")


@app.route('/data/<data_file>')
def returnDataFile(data_file):
	dpath="data/"+data_file
	if(os.path.exists(dpath)):
		return send_file(dpath)
	else:
		abort(404, description="Data resource not found")		

@app.route('/images/<path:ipath>')
def ipathRet(ipath):
	#print("ipath is "+str(ipath))
	fpath='static/images/'+ipath
	if(os.path.exists(fpath)):
		return send_file(fpath)
	else:
		abort(404,description="Image not found!")


@app.route('/rc_detail/<int:congress>/<int:rcnum>/<chamber>')
def getRollCallDetail(congress,rcnum,chamber):
    chamber=chamber.lower()
    return roll_call_df[(roll_call_df['Roll_Call_number']==rcnum) & (roll_call_df['Congress_number']==congress) & (roll_call_df['House']==chamber)].to_json(orient='records')

