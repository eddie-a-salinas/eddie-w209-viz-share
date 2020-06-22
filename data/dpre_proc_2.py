#!/usr/bin/python3

import json
import csv

in_json='demrep35_113.json'
out_json='demrep35j_113.json'
csv_name='HSall_rollcalls.csv'

#join with columns J , add the other columns
#J congress	
#J chamber
#J rollnumber
#A bill_number
#A vote_result
#A vote_desc

keys_for_join=['congress','chamber','rollnumber']
keys_to_add=['bill_number','vote_result','vote_desc']


in_dict=json.load(open(in_json,'r'))
#print(str(in_dict))
keys=in_dict['keys']
keys.extend(keys_to_add)
print(str(keys))
data=in_dict['data']
join_dict=dict()
#https://docs.python.org/3/library/csv.html#csv.DictReader
with open(csv_name) as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		join_arr_vals=[row[i] for i in keys_for_join]
		join_key_str=",".join(join_arr_vals)
		if(join_key_str in join_dict):
			raise Exception('double key!')
		else:
			join_dict[join_key_str]=[row[i] for i in keys_to_add]
print("Done loading join data....")
print(str(str(join_dict)[-1000:]))
# example key/value pair  => '116,Senate,530': ['PN1430', 'Cloture Motion Agreed to', 'John Leonard Badalamenti, of Florida, to be United States District Judge for the Middle District of Florida']
e_keys=['Congress number','House','Roll Call number']
e_idx=[i for i in range(len(keys)) if keys[i] in e_keys]
#print("e_idx "+str(e_idx))
new_data=list()
for darr in data:
	cong_house_roll=[darr[e_idx[i]] for i in range(len(e_idx))]
	cong_house_roll[1]=cong_house_roll[1].capitalize()
	this_lookup_key=",".join(cong_house_roll)
	values_to_use=join_dict[this_lookup_key]
	darr.extend(values_to_use)
	#print(str(darr))
	new_data.append(darr)
out_dict=dict()
out_dict['keys']=keys
out_dict['data']=new_data
jwriter=open(out_json,'w')
jwriter.write(json.dumps(out_dict,indent=4)+"\n")
jwriter.close()
	
	




