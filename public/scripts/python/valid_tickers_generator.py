import json
import os
import time


cwd = os.getcwd()

# input: raw json data
# output: set of tickers
# this function scans the raw data for junk input.  if any part of the raw input
# is junk (i.e. either u'\u2014' or Null) , the element gets rejected.  
# only tickers associated with fully-valid data make it into the return set.
def get_valid_tickers(raw_data, raw_data_length, bad_data_indicator):
	valid_tickers = set()
	for index in range(0, raw_data_length):
		is_good_data = True
		for key in raw_data[index]:
			if key == "div_avg" or key == "div_cur":
				pass
			else:
				if raw_data[index][key] == bad_data_indicator:
					is_good_data = False
		if is_good_data == True:
			valid_tickers.add(raw_data[index]['ticker'])
	return valid_tickers

# input: raw json data
# output: set of tickers
# biographical data is assumed to be clean.  therefore this function
# collects the tickers without checking for data validity
def get_biographical_tickers(raw_data, raw_data_length):
	valid_tickers = set()
	for index in range(0, raw_data_length):
		valid_tickers.add(raw_data[index]['ticker'])
	return valid_tickers

# input: tickers set
# output: dictionary: {key: [list]}
# takes the valid tickers intersection and makes
# a dictionary of of them (to be used for json
# file output)
def make_dictionary_from_set(my_key, my_set):
	my_list = list(my_set)
	my_list.sort()
	return {my_key: my_list}

# peforms main program operations
def main():

	while True:
		# get handles on the json files
		with open(cwd+'/public/json_files/biographical.json') as infile:
			raw_data_biographical = json.load(infile)

		with open(cwd+'/public/json_files/current.json') as infile:
			raw_data_current = json.load(infile)

		with open(cwd+'/public/json_files/historical.json') as infile:
			raw_data_historical = json.load(infile)

		valid_tickers_biographical = get_biographical_tickers(raw_data_biographical, len(raw_data_biographical))
		valid_tickers_current = get_valid_tickers(raw_data_current, len(raw_data_current), None)
		valid_tickers_historical = get_valid_tickers(raw_data_historical, len(raw_data_historical), u'\u2014')
		tickers_intersection = valid_tickers_biographical.intersection(valid_tickers_current).intersection(valid_tickers_historical)
		valid_tickers_dictionary = make_dictionary_from_set("valid_tickers", tickers_intersection)

		with open(cwd+'/public/json_files/valid_tickers.json', 'w') as outfile:
			json.dump(valid_tickers_dictionary, outfile, indent=4)

		time.sleep(300)



if __name__ == "__main__":
	main()