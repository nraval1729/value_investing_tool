import json
from contextlib import closing
from selenium.webdriver import Firefox # pip install selenium
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from collections import OrderedDict
import time
from random import randint
from selenium import webdriver


def start_browser():
	fp = webdriver.FirefoxProfile()
	fp.set_preference("dom.max_chrome_script_run_time", 0)
	fp.set_preference("dom.max_script_run_time", 0)
	browser = Firefox(firefox_profile=fp)
	return browser

def load_tickers():
	with open("../../json_files/sorted_biographical_list_of_dicts.json", "r") as s:
		sorted_biographical_list_of_dicts = json.load(s)
		return sorted_biographical_list_of_dicts


def scrape_morningstar(sorted_biographical_list_of_dicts, sorted_historical_list_of_dicts, base_url, browser):

	# First tab of the browser
	browser.get("http://www.google.com/")

	for curr_dict in sorted_biographical_list_of_dicts:
		# Sleep one second to avoid overloading the morningstar servers
		time.sleep(randint(1, 4))

		my_dict = OrderedDict()

		curr_ticker = curr_dict["ticker"]
		my_dict['ticker'] = curr_ticker

		curr_url = base_url + curr_ticker +'&region=usa&culture=en-US'
		# print "this is the url: ", curr_url
		# print
		print "Curr ticker: ", curr_ticker
		
		# Open new tab
		browser.find_element_by_tag_name('body').send_keys(Keys.COMMAND + 't')

		# Open morningstar pages
		browser.get(curr_url)
		# wait for the page to load
		try:
			WebDriverWait(browser, timeout=30).until(
		     lambda x: x.find_element_by_id('currentValuationTable'))
			valutation_table = browser.find_element_by_id('currentValuationTable')

			# store it to string variable
			print "Valuation table*****************************"
			for index, row in enumerate(valutation_table.find_elements_by_tag_name("tr")[1::2]):
			 		if index != 0 and index != 4 and index != 6:
			 			cells = row.find_elements_by_tag_name('td')
			 			data = cells[-1].text
			 			if index == 1:
			 				my_dict['pe_avg'] = data
			 			if index == 2:
			 				my_dict['pb_avg'] = data
			 			if index == 3:
			 				my_dict['ps_avg'] = data
			 			if index == 5:
			 				my_dict['div_avg'] = data

			sorted_historical_list_of_dicts.append(my_dict)

			browser.find_element_by_tag_name('body').send_keys(Keys.COMMAND + 'w')
			
			browser.close()

		except Exception:
			pass

def write_sorted_historical_list_of_dicts(sorted_historical_list_of_dicts):
	with open("../../json_files/historical.json", 'w') as c:
		json.dump(sorted_historical_list_of_dicts, c, indent = 4)

def main():
	browser = start_browser()

	base_url = 'http://financials.morningstar.com/valuation/price-ratio.html?t='

	sorted_historical_list_of_dicts = []

	sorted_biographical_list_of_dicts = load_tickers()

	scrape_morningstar(sorted_biographical_list_of_dicts, sorted_historical_list_of_dicts, base_url, browser)

	write_sorted_historical_list_of_dicts(sorted_historical_list_of_dicts)

if __name__ == "__main__":
	main()

