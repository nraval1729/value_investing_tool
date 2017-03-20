import os
from collections import OrderedDict
import requests
import json
import sys
import urllib
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import time

cwd = os.getcwd()

def write_current_data(sorted_biographical_list_of_dicts):
	current_list_of_dicts = []
	base_url = 'https://query.yahooapis.com/v1/public/yql?'
	placeholder = '?'
	ticker_list = []

	for index, my_dict in enumerate(sorted_biographical_list_of_dicts):
		# curr_dict = OrderedDict()
		# curr_dict['ticker'] = my_dict['ticker']
		ticker_list.append(str(my_dict['ticker']))
		# current_list_of_dicts.append(curr_dict)

	ticker_tuple = tuple(ticker_list)

	query = {
	    'q': 'select * from yahoo.finance.quotes where symbol in ' +str(ticker_tuple),
	    'format': 'json',
	    'env': 'store://datatables.org/alltableswithkeys'
	}

	# print query['q']

	url = base_url + urllib.urlencode(query)
	response = urllib.urlopen(url)
	data = response.read()
	quote = json.loads(data)

	for q in quote['query']['results']['quote']:
		if q['symbol']:
			curr_dict = OrderedDict()
			curr_dict['ticker'] = q['symbol']
			curr_dict['pe_cur'] = q['PERatio']
			curr_dict['ps_cur'] = q['PriceSales']
			curr_dict['pb_cur'] = q['PriceBook']
			curr_dict['div_cur'] = q['DividendYield']
			# print "Ticker: ", q['symbol']
			# print "PE: ", q['PERatio']
			# print "PS: ", q['PriceSales']
			# print "PB: ",  q['PriceBook']
			# print "Div: ", q['DividendYield']
			# print "*******************************************************************"
		else:
			print "Symbol is this: ", q['symbol']

		current_list_of_dicts.append(curr_dict)

		sorted_current_list_of_dicts = sorted(current_list_of_dicts, key=lambda k:k['ticker'])

		with open(cwd +'/public/json_files/current.json', 'w') as c:
			json.dump(sorted_current_list_of_dicts, c, indent = 4)

def main():
	sorted_biographical_list_of_dicts = []
	with open(cwd+'/public/json_files/sorted_biographical_list_of_dicts.json', 'r') as s:
		sorted_biographical_list_of_dicts = json.load(s)

	# Make sure to hit the yql api every 5 mins aka 300 secs, and update the current.json
	while True:
		write_current_data(sorted_biographical_list_of_dicts)
		time.sleep(300)

if __name__ == "__main__":
	main()