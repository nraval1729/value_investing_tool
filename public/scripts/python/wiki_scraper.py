import requests
import random
import json
from bs4 import BeautifulSoup
from collections import OrderedDict
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import urllib

def get_and_write_biographical_data():
	# Code to scrape the 500 tickers and other metadata from wikipedia and write to biographical.json

	requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

	page = requests.get("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies", verify=False)

	soup = BeautifulSoup(page.content, "lxml")

	biographical_list_of_dicts = []

	for index, row in enumerate(soup.findAll("table")[0].findAll('tr')):
		if index != 0:
			curr_dict = OrderedDict()
			td_list = row.findAll("td")
			# print "Ticker: ", td_list[0].find("a").contents[0]
			curr_dict["ticker"] = td_list[0].find("a").contents[0]

			# print "Security: ", td_list[1].find("a").contents[0]
			curr_dict["security"] = td_list[1].find("a").contents[0]

			# print "Sector: ", td_list[3].contents[0]
			curr_dict["sector"] = td_list[3].contents[0]

			# print "Industry: ", td_list[4].contents[0]
			curr_dict["industry"] = td_list[4].contents[0]

			biographical_list_of_dicts.append(curr_dict)
			# print "****************************"

	sorted_biographical_list_of_dicts = sorted(biographical_list_of_dicts, key=lambda k:k['ticker'])


	with open('biographical.json', 'w') as b:
		json.dump(sorted_biographical_list_of_dicts, b, indent = 4)

	return sorted_biographical_list_of_dicts


def write_historical_data(sorted_biographical_list_of_dicts):
	# Code to generate random historical ratio data, and write to historical.json. Will be modified soon so that this grabs (greps?) the actual data from morningstar

	historical_list_of_dicts = []

	# p/e: 5-30, p/s: 5-30, div: 0-20, pb: 5-30
	for my_dict in sorted_biographical_list_of_dicts:
		curr_dict = OrderedDict()
		curr_dict['ticker'] = my_dict['ticker']
		curr_dict["pe_avg"] = random.uniform(5, 30)
		curr_dict["ps_avg"] = random.uniform(5, 30)
		curr_dict["pb_avg"] = random.uniform(5, 30)
		curr_dict["div_avg"] = random.uniform(0, 20)

		historical_list_of_dicts.append(curr_dict)

	sorted_historical_list_of_dicts = sorted(historical_list_of_dicts, key=lambda k:k['ticker'])

	with open('historical.json', 'w') as h:
		json.dump(sorted_historical_list_of_dicts, h, indent = 4)

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

		with open('current.json', 'w') as c:
			json.dump(sorted_current_list_of_dicts, c, indent = 4)

def main():

	sorted_biographical_list_of_dicts = get_and_write_biographical_data()

	write_historical_data(sorted_biographical_list_of_dicts)

	write_current_data(sorted_biographical_list_of_dicts)

if __name__ == "__main__":
	main()
