import json
import math
import sys

# global variables needed for testing
raw_data_biographical = []
biographical_json_pruned = []
tickers = []
industry_to_tickers_dictionary = {}
industry_to_tickers_map = {}
sector_to_industries_dictionary = {}
sector_to_industries_map = {}
industry_to_sector_map = {}
ticker_to_security_map = {}
ticker_to_industry_map = {}
ticker_to_security_list = []
security_to_ticker_list = []
ticker_to_sector_map = {}
security_to_ticker_map = {}
security_to_industry_map = {}
security_to_sector_map = {}


# for testing purposes
def display_json_array(json_array):
	n = len(json_array)
	for index in range(0, n):
		try:
			curr = json_array[index]
		except KeyError:
			print "Key does not exist"
		for key in curr:
			print key + ": ", json_array[index][key]
		print


# input: dictionary whose values are populated sets
# output: dictionary whose values are populated lists
# need to do this because json requires values to be lists
# rather than sets
def condition_dictionary(dictionary):
	my_dictionary = {}
	for key in dictionary:
		try: 
			my_dictionary[key] = list(dictionary[key])
		except KeyError:
			print "Key does not exist"
	return my_dictionary


# creates a key: multi-value dictionary
# input: json array, attribute
# output: dictionary which maps each unique element of the attribute to a blank set
# example input: (biographical_json, "industry")
# example output: {u'Airlines': set([]), u'Automotive Retail': set([])}
def create_dictionary(json_array, attribute):
	my_dictionary = {}
	my_list = list(get_unique_values(json_array, attribute))
	my_list.sort()
	n = len(my_list)
	for index in range(0, n):
		my_dictionary[my_list[index]] = set()
	return my_dictionary


# creates a simple one-to-one key: value dictionary (i.e. the value
# in each key-value pair is a single element rather than a collection)
# note: will represent the dictionary as a list, since we will have to
# send the json as a list
def create_simple_list(json_array, key_attribute, value_attribute):
	my_list = []
	keys = set()
	n = len(json_array)
	for index in range(0, n):
		if json_array[index][key_attribute] not in keys:
			json = {json_array[index][key_attribute]: json_array[index][value_attribute]}
			my_list.append(json)
			keys.add(json_array[index][key_attribute])
	return my_list


# creates a simple one-to-one key: value dictionary (i.e. the value
# in each key-value pair is a single element rather than a collection)
# note: will represent the dictionary as a list, since we will have to
# send the json as a list
def create_simple_map(json_array, key_attribute, value_attribute):
	my_map = {}
	keys = set()
	n = len(json_array)
	for index in range(0, n):
		if json_array[index][key_attribute] not in keys:
			my_map[json_array[index][key_attribute]] = json_array[index][value_attribute]
			#json = {json_array[index][key_attribute]: json_array[index][value_attribute]}
			#my_list.append(json)
			keys.add(json_array[index][key_attribute])
	return my_map


# for a particular attribute, gets its set of unique values
def get_unique_values(json_array, attribute):
	my_set = set()
	n = len(json_array)
	for index in range(0, n):
		my_set.add(json_array[index][attribute])
	return my_set


# populates a key: multi-value dictionary
# input: dictionary whose values are currently blank sets
# output: dictionary with its sets populated with the appropriate values
def populate_dictionary(dictionary, json_array, key_attribute, value_attribute):
	n = len(json_array)
	for index in range(0, n):
		key =  json_array[index][key_attribute]
		value = json_array[index][value_attribute]
		#print key, value
		dictionary[key].add(value)


# returns a valid-ticker-only version of the json input array
# input: json array
# output: json array with elements that have valid tickers
def prune_json(json_array, valid_tickers):
	my_array = []
	n = len(json_array)
	for index in range(0, n):
		ticker = json_array[index]['ticker']
		if ticker in valid_tickers:
			my_array.append(json_array[index])
	return my_array


def main():
	
	# allow variable access for test_biographical_maps_generator.py tests
	global raw_data_biographical
	global tickers
	global biographical_json_pruned
	global industry_to_tickers_dictionary
	global industry_to_tickers_map
	global sector_to_industries_dictionary
	global sector_to_industries_map
	global industry_to_sector_map
	global ticker_to_security_map
	global ticker_to_industry_map
	global ticker_to_security_list
	global security_to_ticker_list
	global ticker_to_sector_map
	global security_to_ticker_map
	global security_to_industry_map
	global security_to_sector_map

	# get handles on the json files
	try: 
		with open('biographical.json') as infile:
			raw_data_biographical = json.load(infile)
	except IOError:
		print "Unable to open file"

	try:
		with open('valid_tickers.json') as infile:
			tickers_json = json.load(infile)
	except IOError:
		print "Unable to open file"

	try:
		tickers = set(tickers_json['valid_tickers'])
	except KeyError:
		print "Key does not exist"

	biographical_json_pruned = prune_json(raw_data_biographical, tickers)

	industry_to_tickers_dictionary = create_dictionary(biographical_json_pruned, "industry")
	populate_dictionary(industry_to_tickers_dictionary, biographical_json_pruned, "industry", "ticker")
	industry_to_tickers_map = condition_dictionary(industry_to_tickers_dictionary)

	sector_to_industries_dictionary = create_dictionary(biographical_json_pruned, "sector")
	populate_dictionary(sector_to_industries_dictionary, biographical_json_pruned, "sector", "industry")
	sector_to_industries_map = condition_dictionary(sector_to_industries_dictionary)

	industry_to_sector_map = create_simple_map(biographical_json_pruned, "industry", "sector")
	ticker_to_security_map = create_simple_map(biographical_json_pruned, "ticker", "security")
	ticker_to_industry_map = create_simple_map(biographical_json_pruned, "ticker", "industry")
	ticker_to_security_list = create_simple_list(biographical_json_pruned, "ticker", "security")
	security_to_ticker_list = create_simple_list(biographical_json_pruned, "security", "ticker")
	ticker_to_sector_map = create_simple_map(biographical_json_pruned, "ticker", "sector")
	security_to_ticker_map = create_simple_map(biographical_json_pruned, "security", "ticker")
	security_to_industry_map = create_simple_map(biographical_json_pruned, "security", "industry")
	security_to_sector_map = create_simple_map(biographical_json_pruned, "security", "sector")


 	# NISARG: DO NOT DELETE THE COMMENTED-OUT PRINT STATEMENTS BELOW FOR NOW.  THANKS.  CRAIG 
	
	# print industry_to_sector_map
	# print industry_to_sector_map['Life & Health Insurance']

	# print industry_to_tickers_map
	# print industry_to_tickers_map['Life & Health Insurance']

	# print sector_to_industries_map
	# print sector_to_industries_map['Industrials']

	# print security_to_industry_map
	# print security_to_industry_map['Ford Motor']

	# print security_to_sector_map
	# print security_to_sector_map['Ford Motor']

	# print security_to_ticker_list
	# print security_to_ticker_list[0]

	# print security_to_ticker_map
	# print security_to_ticker_map['Ford Motor']

	# print ticker_to_industry_map
	# print ticker_to_industry_map['F']

	# print ticker_to_sector_map
	# print ticker_to_sector_map['F']

	# print ticker_to_security_list
	# print ticker_to_security_list[0]

	# print ticker_to_security_map
	# print ticker_to_security_map['F']
	

	# industry_to_sector_map
	try:
	 	with open('industry_to_sector_map.json', 'w') as outfile:
	 		json.dump(industry_to_sector_map, outfile, indent=4)
	except IOError:
		print "Unable to write file"

	# industry_to_tickers_map
	try:
	 	with open('industry_to_tickers_map.json', 'w') as outfile:
	 		json.dump(industry_to_tickers_map, outfile, indent=4)
	except IOError:
		print "Unable to write file"

	# sector_to_industries_map
	try:
	 	with open('sector_to_industries_map.json', 'w') as outfile:
	 		json.dump(sector_to_industries_map, outfile, indent=4)
	except IOError:
		print "Unable to write file"

	# security_to_industry_map
	try: 
	 	with open('security_to_industry_map.json', 'w') as outfile:
	 		json.dump(security_to_industry_map, outfile, indent=4)
	except IOError:
		print "Unable to write file"

	# security_to_sector_map
	try: 
	 	with open('security_to_sector_map.json', 'w') as outfile:
	 		json.dump(security_to_sector_map, outfile, indent=4)
	except IOError:
		print "Unable to write file"

 	# security_to_ticker_list
 	try: 
	 	with open('security_to_ticker_list.json', 'w') as outfile:
	 		json.dump(security_to_ticker_list, outfile, indent=4)		
	except IOError:
		print "Unable to write file"

	# security_to_ticker_map
	try: 
	 	with open('security_to_ticker_map.json', 'w') as outfile:
	 		json.dump(security_to_ticker_map, outfile, indent=4)
	except IOError:
		print "Unable to write file"

	# ticker_to_industry_map
	try: 
	 	with open('ticker_to_industry_map.json', 'w') as outfile:
	 		json.dump(ticker_to_industry_map, outfile, indent=4)
	except IOError:
		print "Unable to write file"

	# ticker_to_sector_map
	try:
	 	with open('ticker_to_sector_map.json', 'w') as outfile:
	 		json.dump(ticker_to_sector_map, outfile, indent=4)
	except IOError:
		print "Unable to write file"

	# ticker_to_security_list
	try: 
	 	with open('ticker_to_security_list.json', 'w') as outfile:
	 		json.dump(ticker_to_security_list, outfile, indent=4)
	except IOError:
		print "Unable to write file"

 	# ticker_to_security_map
 	try:
	 	with open('ticker_to_security_map.json', 'w') as outfile:
	 		json.dump(ticker_to_security_map, outfile, indent=4)
	except IOError:
		print "Unable to write file"


if __name__ == "__main__":
	main()
