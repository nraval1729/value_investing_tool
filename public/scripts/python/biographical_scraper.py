import requests
import random
import json
from bs4 import BeautifulSoup
from collections import OrderedDict
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import urllib
import sys
import os

cwd = os.getcwd()

def get_and_write_biographical_data():
	requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

	page = requests.get("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies", verify=False)

	soup = BeautifulSoup(page.content, "lxml")

	biographical_list_of_dicts = []

	for index, row in enumerate(soup.findAll("table")[0].findAll('tr')):
		if index != 0:
			curr_dict = OrderedDict()
			td_list = row.findAll("td")
			curr_dict["ticker"] = td_list[0].find("a").contents[0]

			curr_dict["security"] = td_list[1].find("a").contents[0]

			curr_dict["sector"] = td_list[3].contents[0]

			if not td_list[4].contents:
				continue
				
			curr_dict["industry"] = td_list[4].contents[0]

			biographical_list_of_dicts.append(curr_dict)

	sorted_biographical_list_of_dicts = sorted(biographical_list_of_dicts, key=lambda k:k['ticker'])


	with open(cwd+'/public/json_files/biographical.json', 'w') as b:
		json.dump(sorted_biographical_list_of_dicts, b, indent = 4)

	return sorted_biographical_list_of_dicts

def dump_sorted_biographical_list_of_dicts(sorted_biographical_list_of_dicts):
	with open(cwd+'/public/json_files/sorted_biographical_list_of_dicts.json', 'w') as c:
			json.dump(sorted_biographical_list_of_dicts, c, indent = 4)

def main():

	sorted_biographical_list_of_dicts = get_and_write_biographical_data()

	dump_sorted_biographical_list_of_dicts(sorted_biographical_list_of_dicts)

if __name__ == "__main__":
	main()