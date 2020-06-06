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
jwriter=open('demrep35_113.json','w')
jwriter.write(json.dumps(json_objs,indent=4)+"\n")
jwriter.close()

