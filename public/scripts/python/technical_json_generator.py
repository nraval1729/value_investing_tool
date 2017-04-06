import json
import math
import os
import time

# Current working directory. Top level aka where server.js is
cwd = os.getcwd()

# establish variables and functions
rawDataHistorical = [] # captures historical.json data from file
rawDataCurrent = [] # caputres current.json data from file
rawDataHistoricalLength = 0 # the number of elements in rawDataHistorical
rawDataCurrentLength = 0 # the number of elements in rawDataCurrent
validSymbolsHistorical = set() # only symbols with complete historical data make it into this set 
validSymbolsCurrent = set() # only symbols with complete current data make it into this set
symbolsIntersection = set() # the intersection of the above two sets.  only these symbols ultimately get used.
symbolsIntersectionSize = 0 # the number of elements in symbolsIntersection
bigDictionary = {} # this is what we are targeting throughout.  the data gets cleaned, sifted, and placed in here.
bigList = [] # this is what gets dumped to json as the output file.  very important data target.
pbList = [] # holds the pb numerical values.  gets sorted. used to produce rankings.
peList = [] # holds the pe numerical values.  gets sorted. used to produce rankings.
psList = [] # holds the ps numerical values.  gets sorted. used to produce rankings.
divList = [] # holds the div numerical values.  gets sorted. used to produce rankings.
sScoreList = [] # holds the s_score numerical values.  gets sorted. used to produce rankings.
pbDecileDictionary = {} # key=ticker, value=decile.  used to produce rankings.
peDecileDictionary = {} # key=ticker, value=decile.  used to produce rankings.
psDecileDictionary = {} # key=ticker, value=decile.  used to proudce rankings.
divDecileDictionary = {} # key=ticker, value=decile.  used to produce rankings.
sScoreDictionary = {} # key=ticker, value=s_score.  used to produce rankings.
sRankDictionary = {} # key=ticker, value=s_rank.  used to produce rankings.


# there are four dictionaries that use this function: pbDictionary, peDictionary, 
# psDictionary, divDictionary.  the goal is to populate dictionaries like this:
# peDictionary: {'A': '7.0', 'AAPL': '4.0', ...}.  the key is the ticker and the
# value is the decile score. each of the four dictionaries are created separately
# then their values are averages to produce the s_score.  the s_scores are then
# sorted to produce the s_rank for each ticker.
def populateDecileDictionary(key, ratio, ratioList, decileDictionary, isDividendRatio):
	val = bigDictionary[key][ratio]
	location = ratioList.index(val)
	decile = 0
	if isDividendRatio: # dividend ratio needs to be "backwards": higher is better
		decile = 11 - (math.ceil(10.0 * (location + 1) / symbolsIntersectionSize))
	else:
		decile = math.ceil(10.0 * (location + 1) / symbolsIntersectionSize)
	decileDictionary[key] = decile


# this function scans the raw data for junk input.  if any part of the raw input
# is junk (i.e. either u'\u2014' or Null) , the entire symbol gets thrown out.  
# only symbols that are free from bad data make it into the validSymbolSet.
def populateValidSymbolSet(rawDataList, validSymbolSet, rawDataListLength, badDataIndicator):
	for index in range(0, rawDataListLength):
		isGoodData = True
		for key in rawDataList[index]:
			if rawDataList[index][key] == badDataIndicator:
				isGoodData = False
		if isGoodData == True:
			validSymbolSet.add(rawDataList[index]['ticker'])

while True:
	# get handles on the json files
	with open(cwd+'/public/json_files/historical.json') as infile:
		rawDataHistorical = json.load(infile)

	with open(cwd+'/public/json_files/current.json') as infile:
		rawDataCurrent = json.load(infile)


	# get lengths of the json file handles
	rawDataHistoricalLength = len(rawDataHistorical)
	rawDataCurrentLength = len(rawDataCurrent)


	# examine the raw data.  only if the data is clean, its symbol gets added to the valid symbols set.
	populateValidSymbolSet(rawDataHistorical, validSymbolsHistorical, rawDataHistoricalLength, u'\u2014')
	populateValidSymbolSet(rawDataCurrent, validSymbolsCurrent, rawDataCurrentLength, None)


	# take the intersection of the valid symbol sets.  we will only use symbols that appear
	# in both data sets and are clean in both data sets (historical.json, current.json).
	symbolsIntersection = validSymbolsHistorical.intersection(validSymbolsCurrent)
	symbolsIntersectionSize = len(symbolsIntersection)


	# loop over historical raw data. add stocks 
	# to bigDictionary only if it is clean data.
	for index in range(0, rawDataHistoricalLength):
		for key in rawDataHistorical[index]:
			symbol = rawDataHistorical[index][key]
			if symbol in symbolsIntersection:
				bigDictionary[symbol] = rawDataHistorical[index]


	# loop over current raw data. append data to
	# bigDictionary only if it is clean data.
	for index in range(0, rawDataCurrentLength):
		for key in rawDataCurrent[index]:
			symbol = rawDataCurrent[index][key]
			if symbol in symbolsIntersection:
				bigDictionary[symbol]['pb_cur'] = rawDataCurrent[index]['pb_cur']
				bigDictionary[symbol]['pe_cur'] = rawDataCurrent[index]['pe_cur']
				bigDictionary[symbol]['ps_cur'] = rawDataCurrent[index]['ps_cur']
				bigDictionary[symbol]['div_cur'] = rawDataCurrent[index]['div_cur']


	# populate the pb, pe, ps, div lists
	for key in bigDictionary:
		pbList.append(bigDictionary[key]['pb_cur'])
		peList.append(bigDictionary[key]['pe_cur'])
		psList.append(bigDictionary[key]['ps_cur'])
		divList.append(bigDictionary[key]['div_cur'])


	# sort the pb, pe, ps, div lists
	pbList.sort()
	peList.sort()
	psList.sort()
	divList.sort()


	# populate pbDictionary, peDictionary, psDictionary, divDictionary
	for key in bigDictionary:
		populateDecileDictionary(key, 'pb_cur', pbList, pbDecileDictionary, False)
		populateDecileDictionary(key, 'pe_cur', peList, peDecileDictionary, False)
		populateDecileDictionary(key, 'ps_cur', psList, psDecileDictionary, False)
		populateDecileDictionary(key, 'div_cur', divList, divDecileDictionary, True)


	# populate sScoreDictionary, sScoreList
	for key in bigDictionary:
		aggregateScore = (pbDecileDictionary[key] + peDecileDictionary[key] + psDecileDictionary[key] + divDecileDictionary[key]) / 4.0
		sScoreDictionary[key] = aggregateScore
		sScoreList.append(aggregateScore)


	#sort sScoreList
	sScoreList.sort()


	# populate sRankDictionary
	for key in bigDictionary:
		val = sScoreDictionary[key]
		location = sScoreList.index(val)
		sRankDictionary[key] = location + 1


	# append s_rank key-value info into bigDictionary
	for key in bigDictionary:
		bigDictionary[key]['s_rank'] = sRankDictionary[key]

	# convert dictionary to list for desired json output
	bigList = bigDictionary.values()

	# write the json file
	with open(cwd+'/public/json_files/technical.json', 'w') as outfile:
		json.dump(bigList, outfile, indent=4)

	time.sleep(300)
