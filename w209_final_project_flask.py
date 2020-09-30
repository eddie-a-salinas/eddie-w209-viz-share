from flask import Flask, render_template,send_file, abort
import json
import re
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

		memberVoteDF = all_votes_house_df[(all_votes_house_df['congress']==congress) & (all_votes_house_df['rollnumber']==rollcall)    ]
	else:
		memberVoteDF = all_votes_senate_df[(all_votes_senate_df['congress']==congress) & (all_votes_senate_df['rollnumber']==rollcall) ]
	#avoid records where pres or vice-pres is a congressperson!
	memberVoteDF=memberVoteDF[~(memberVoteDF['bioname'].isnull())]

	return memberVoteDF.to_json(orient='records')

@app.route('/pct_party/<int:congress>/<string:chamber>')
def getPctPartyCache(congress,chamber):
	c_int=int(congress)
	f_base=APP_FOLDER+"/data/memo_party/wdpp."+chamber+"."+str(c_int).zfill(3)+".json"
	if(os.path.exists(f_base)):
		#print("f_base is "+str(f_base))
		return send_file(f_base)
	else:
		abort(404, description="Resource not found")


@app.route('/data/<data_file>')
def returnDataFile(data_file):
	dpath=APP_FOLDER+"/data/"+data_file
	if(os.path.exists(dpath)):
		return send_file(dpath)
	else:
		abort(404, description="Data resource not found")		

@app.route('/images/<path:ipath>')
def ipathRet(ipath):
	#print("ipath is "+str(ipath))
	fpath=APP_FOLDER+'/static/images/'+ipath
	if(os.path.exists(fpath)):
		return send_file(fpath)
	else:
		abort(404,description="Image not found!")


def getCongNumFromMemoFile(mp_bn):
	return int(re.search("\.([0-9]{3})\.json$",mp_bn).group(1))


@app.route('/rc_datatable/<chamber>')
def getrcdatatable(chamber):
	#/bin/echo -ne "SELECT rollnumber,date,vote_result,vote_desc,vote_question,dtl_desc FROM rollcalls WHERE chamber='Senate' AND CAST(congress as int)>=35 AND CAST(congress as int)<=113;"| sqlite3  data/cong_data.db
	min_congress=35
	max_congress=113
	mp_files=list()
	for cn in range(min_congress,max_congress+1):
		#mp_file="data/memo_party/wdpp.Senate.116.json
		mp_file=APP_FOLDER+"/data/memo_party/wdpp."+chamber.capitalize()+"."+str(cn).zfill(3)+".json"
		mp_files.append(mp_file)
	data_arr=list()
	for mp_file in mp_files:
		#print(mp_file)
		with open(mp_file,'r') as json_reader:
			json_data=json.load(json_reader)
			rcdata=json_data['roll_calldata']
			for rci in range(len(rcdata)):
				yay_count=0
				nay_count=0
				other_count=0
				for party in rcdata[rci]['vote_data']:
					for cast_code in rcdata[rci]['vote_data'][party]:
						cast_code_count=rcdata[rci]['vote_data'][party][cast_code]
						if(cast_code=="1"):
							yay_count+=cast_code_count
						elif(cast_code=="6"):
							nay_count+=cast_code_count
						else:
							other_count+=cast_code_count
				nay_and_yay=nay_count+yay_count
				if(nay_and_yay>0):
					pct_yay=100.0*(float(yay_count)/float(nay_and_yay))
				else:
					pct_yay=0.0
				temp_arr=list()
				temp_arr.append(getCongNumFromMemoFile(os.path.basename(mp_file)))
				temp_arr.append(rcdata[rci]['rollcall'])
				temp_arr.append(rcdata[rci]['rollcall_date'])
				nice_desc=[rcdata[rci]['vote_question'],rcdata[rci]['vote_description'],rcdata[rci]['vote_detail_description']]
				nice_desc=filter(lambda x: len(str(x))>=2,nice_desc)
				temp_arr.append(" : ".join(nice_desc))
				temp_arr.append("{:.2f}".format(pct_yay))
				data_arr.append(temp_arr)
	final_data_obj=dict()
	final_data_obj['data']=data_arr
	return final_data_obj



@app.route('/rc_detail/<int:congress>/<int:rcnum>/<chamber>')
def getRollCallDetail(congress,rcnum,chamber):
    c_int=int(congress)
    f_base=APP_FOLDER+"/data/memo_party/wdpp."+chamber.capitalize()+"."+str(c_int).zfill(3)+".json"
    if(os.path.exists(f_base)):
        #print("f_base is "+str(f_base))
        #return send_file(f_base)
        with open(f_base,'r') as reader:
            ddict=json.load(reader)
            rcdata=ddict['roll_calldata']
            desired_rcdata=[rcd for rcd in rcdata if int(rcd["rollcall"])==rcnum ]
            return json.dumps(desired_rcdata)
    else:
        abort(404, description="Resource not found")    
    #chamber=chamber.lower()
    #return roll_call_df[(roll_call_df['Roll_Call_number']==rcnum) & (roll_call_df['Congress_number']==congress) & (roll_call_df['House']==chamber)].to_json(orient='records')

