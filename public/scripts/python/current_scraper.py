
import os
from collections import OrderedDict
import requests
import json
import sys
import urllib
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import time

sorted_biographical_list_of_dicts = []
current_data = []

cwd = os.getcwd()

def write_current_data(sorted_biographical_list_of_dicts):
	current_list_of_dicts = []
	base_url = 'https://query.yahooapis.com/v1/public/yql?'
	placeholder = '?'
	ticker_list = []

	for index, my_dict in enumerate(sorted_biographical_list_of_dicts):
		ticker_list.append(str(my_dict['ticker']))

	ticker_tuple = tuple(ticker_list)

	query = {
	    'q': 'select * from yahoo.finance.quotes where symbol in ' +str(ticker_tuple),
	    'format': 'json',
	    'env': 'store://datatables.org/alltableswithkeys'
	}

	url = base_url + urllib.urlencode(query)
	response = urllib.urlopen(url)
	data = response.read()
	quote = json.loads(data)

	for q in quote['query']['results']['quote']:
		if q['symbol']:
			curr_dict = OrderedDict()
			try:
				curr_dict['ticker'] = q['symbol']
			except KeyError:
				print "Key does not exist"

			try:
				curr_dict['pe_cur'] = q['PERatio']
			except KeyError:
				print "Key does not exist"

			try:
				curr_dict['ps_cur'] = q['PriceSales']
			except KeyError:
				print "Key does not exist"

			try:
				curr_dict['pb_cur'] = q['PriceBook']
			except KeyError:
				print "Key does not exist"

			try:
				curr_dict['div_cur'] = q['DividendYield']
			except KeyError:
				print "Key does not exist"

		else:
			print "Symbol is this: ", q['symbol']

		current_list_of_dicts.append(curr_dict)

		sorted_current_list_of_dicts = sorted(current_list_of_dicts, key=lambda k:k['ticker'])

		try:
			with open(cwd +'/public/json_files/current.json', 'w') as c:
				json.dump(sorted_current_list_of_dicts, c, indent = 4)
		except IOError:
			print "Unable to write file"

def main():

	global sorted_biographical_list_of_dicts
	global current_data

	try:
		with open(cwd+'/public/json_files/sorted_biographical_list_of_dicts.json', 'r') as s:
			sorted_biographical_list_of_dicts = json.load(s)
	except IOError:
		print "Unable to open file"

	# Make sure to hit the yql api every 5 mins aka 300 secs, and update the current.json
	while True:
		current_data = write_current_data(sorted_biographical_list_of_dicts)
		time.sleep(300)

if __name__ == "__main__":
	main()