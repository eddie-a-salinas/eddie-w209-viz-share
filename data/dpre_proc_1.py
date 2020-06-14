#!/usr/bin/python3

import re
import json

def getColNames():
	names=list()
	name_re=re.compile(r'^\s*\d+\.\s+(.*)$')
	with open('cols.dat','r') as reader:
		for line in reader:
			search_res=re.search(name_re,line)
			if(search_res):
				the_name=search_res.group(1)
				the_name=the_name.strip()				
				names.append(the_name)
	return names

import json

file_to_house=dict({'hdemrep35_113.dat':'house','sdemrep35_113.dat':'senate'})
col_names=getColNames()
json_objs=list()
for f in file_to_house:
	with open(f,'r') as dreader:
		for line in dreader:
			dpieces=re.sub(r'\s+','\t',line.strip()).split('\t')
			ddict=dict()
			for i in range(len(dpieces)):
				ddict[col_names[i]]=dpieces[i]
			ddict['house']=file_to_house[f]
			json_objs.append(ddict)

###############################
# to avoid repeating the strings for the keys a lot ust an array here, reduce file size and parsing time!
#esalina@2018comp:~/Documents/UC_Berkeley_MIDS/W209_DataVisualization/git_repos/w209-su2020-cybersec/data$ cat cols.dat |grep -Po '\..*'|tr -d "."|sed -r "s/^.//"|sort|uniq|awk '{print "\"" $0 "\"" }'|tr "\n" ","|sed -#r "s/,$/\n/"|awk '{print "[" $0 "]"}'
keys=["Congress number","Day","Month","Number Democrat Nays","Number Democrat Yeas","Number Missing Votes (not voting and not in Congress)","Number Nays","Number Northern Democrat Nays","Number Northern Democrat Yeas","Number Northern Republican Nays","Number Northern Republican Yeas","Number Republican Nays","Number Republican Yeas","Number Southern Democrat Nays","Number Southern Democrat Yeas (11 States of Confederacy plus KY and OK)","Number Southern Republican Nays","Number Southern Republican Yeas (11 States of Confederacy plus KY and OK)","Number Yeas","Roll Call number","Year"]
json_compact=dict()
json_compact['keys']=keys
json_compact_data=list()
for j in range(len(json_objs)):
	temp_list=[json_objs[j][keys[k]] for k in range(len(keys))]
	json_compact_data.append(temp_list)
json_compact['data']=json_compact_data

jwriter=open('demrep35_113.json','w')
jwriter.write(json.dumps(json_compact,indent=4)+"\n")
jwriter.close()

