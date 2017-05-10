import json
import math

# for testing purposes
def display_json_array(json_array):
	n = len(json_array)
	for index in range(0, n):
		curr = json_array[index]
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
		my_dictionary[key] = list(dictionary[key])
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


# peforms main program operations
def main():
	# get handles on the json files
	with open('biographical.json') as infile:
		raw_data_biographical = json.load(infile)

	with open('valid_tickers.json') as infile:
		tickers_json = json.load(infile)

	tickers = set(tickers_json['valid_tickers'])
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

	# industry_to_sector_map
 	with open('industry_to_sector_map.json', 'w') as outfile:
 		json.dump(industry_to_sector_map, outfile, indent=4)

	# industry_to_tickers_map
 	with open('industry_to_tickers_map.json', 'w') as outfile:
 		json.dump(industry_to_tickers_map, outfile, indent=4)

	# sector_to_industries_map
 	with open('sector_to_industries_map.json', 'w') as outfile:
 		json.dump(sector_to_industries_map, outfile, indent=4)

	# security_to_industry_map
 	with open('security_to_industry_map.json', 'w') as outfile:
 		json.dump(security_to_industry_map, outfile, indent=4)

	# security_to_sector_map
 	with open('security_to_sector_map.json', 'w') as outfile:
 		json.dump(security_to_sector_map, outfile, indent=4)

 	# security_to_ticker_list
 	with open('security_to_ticker_list.json', 'w') as outfile:
 		json.dump(security_to_ticker_list, outfile, indent=4)		

	# security_to_ticker_map
 	with open('security_to_ticker_map.json', 'w') as outfile:
 		json.dump(security_to_ticker_map, outfile, indent=4)

	# ticker_to_industry_map
 	with open('ticker_to_industry_map.json', 'w') as outfile:
 		json.dump(ticker_to_industry_map, outfile, indent=4)

	# ticker_to_sector_map
 	with open('ticker_to_sector_map.json', 'w') as outfile:
 		json.dump(ticker_to_sector_map, outfile, indent=4)

	# ticker_to_security_list
 	with open('ticker_to_security_list.json', 'w') as outfile:
 		json.dump(ticker_to_security_list, outfile, indent=4)

 	# ticker_to_security_map
 	with open('ticker_to_security_map.json', 'w') as outfile:
 		json.dump(ticker_to_security_map, outfile, indent=4)


if __name__ == "__main__":
	main()
