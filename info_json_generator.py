import json
import math
import os
import time

cwd = os.getcwd()


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

def populate_big_dictionary(big_dictionary, raw_data_historical, raw_data_current, valid_tickers):
    # loop over historical raw data. add stocks 
    # to big_dictionary only they have clean data
    n = len(raw_data_historical)
    for index in range(0, n):
        for key in raw_data_historical[index]:
            ticker = raw_data_historical[index][key]
            if ticker in valid_tickers:
                big_dictionary[ticker] = raw_data_historical[index]

    # loop over current raw data. APPEND data to
    # big_dictionary entries only if it is clean data.
    n = len(raw_data_current)
    for index in range(0, n):
        for key in raw_data_current[index]:
            ticker = raw_data_current[index][key]
            if ticker in valid_tickers:
                big_dictionary[ticker]['pb_cur'] = raw_data_current[index]['pb_cur']
                big_dictionary[ticker]['pe_cur'] = raw_data_current[index]['pe_cur']
                big_dictionary[ticker]['ps_cur'] = raw_data_current[index]['ps_cur']
                big_dictionary[ticker]['div_cur'] = raw_data_current[index]['div_cur']


# populate the pb, pe, ps, div lists
def populate_ratio_lists(pb_list, pe_list, ps_list, div_list, big_dictionary):
    for key in big_dictionary:
        pb_list.append(big_dictionary[key].get('pb_cur'))
        pe_list.append(big_dictionary[key].get('pe_cur'))
        ps_list.append(big_dictionary[key].get('ps_cur'))
        div_list.append(big_dictionary[key].get('div_cur'))


# sort the pb, pe, ps, div lists
def sort_ratio_lists(pb_list, pe_list, ps_list, div_list):
    pb_list.sort()
    pe_list.sort()
    ps_list.sort()
    div_list.sort()


# called from main from a for-in block
# there are four dictionaries that use this function: pbDictionary, peDictionary, 
# psDictionary, divDictionary.  the goal is to populate dictionaries like this:
# peDictionary: {'A': '7.0', 'AAPL': '4.0', ...}.  the key is the ticker and the
# value is the decile score. each of the four dictionaries are created separately,
# then their values are averages to produce the s_score.  the s_scores are then
# sorted to produce the s_rank for each ticker.
def populate_decile_dictionary(key, ratio, ratio_list, decile_dictionary, big_dictionary, is_dividend_ratio):
    val = big_dictionary.get(key).get(ratio)
    location = ratio_list.index(val)
    decile = 0
    if is_dividend_ratio: # dividend ratio needs to be "backwards": higher is better
        decile = 11 - (math.ceil(10.0 * (location + 1) / NUM_VALID_TICKERS))
    else:
        decile = math.ceil(10.0 * (location + 1) / NUM_VALID_TICKERS)
    decile_dictionary[key] = decile


def populate_s_score_dictionary_s_score_list( s_score_dictionary, s_score_list, big_dictionary,
            pb_decile_dictionary, pe_decile_dictionary, ps_decile_dictionary, div_decile_dictionary):
    
    for key in big_dictionary:
        aggregate_score = (pb_decile_dictionary[key] + pe_decile_dictionary[key] + ps_decile_dictionary[key] + div_decile_dictionary[key]) / 4.0
        s_score_dictionary[key] = aggregate_score
        s_score_list.append(aggregate_score)

 
def sort_s_score_list(s_score_list):
    s_score_list.sort()


def populate_s_rank_dictionary(big_dictionary, s_score_dictionary, s_score_list, s_rank_dictionary):
    for key in big_dictionary:
        val = s_score_dictionary[key]
        location = s_score_list.index(val)
        s_rank_dictionary[key] = location + 1


def append_s_rank_to_big_dictionary(big_dictionary, s_rank_dictionary):
    for key in big_dictionary:
        big_dictionary[key]['s_rank'] = s_rank_dictionary[key]


def append_company_name_to_big_dictionary(big_dictionary, ticker_to_security_map):
    for key in big_dictionary:
        big_dictionary[key]['security'] = ticker_to_security_map[key]


def populate_big_list(big_list, big_dictionary):
    big_list = big_dictionary.values()

def read_biographical_data():
    with open(cwd+'/public/json_files/biographical.json') as infile:
        raw_data_biographical = json.load(infile)
    return raw_data_biographical

def read_historical_data():
    with open(cwd+'/public/json_files/historical.json') as infile:
        raw_data_historical = json.load(infile)
    return raw_data_historical

def read_current_data():
    with open(cwd+'/public/json_files/current.json') as infile:
        raw_data_current = json.load(infile)
    return raw_data_current

def read_valid_tickers():
    with open(cwd+'/public/json_files/valid_tickers.json') as infile:
        tickers_json = json.load(infile)
    return tickers_json

def generate_all_json_maps(raw_data_biographical, tickers_json, info_dict):
    tickers = set(tickers_json['valid_tickers'])
    biographical_json_pruned = prune_json(raw_data_biographical, tickers)

    industry_to_tickers_dictionary = create_dictionary(biographical_json_pruned, "industry")
    populate_dictionary(industry_to_tickers_dictionary, biographical_json_pruned, "industry", "ticker")

    # Industry to tickers
    industry_to_tickers_map = condition_dictionary(industry_to_tickers_dictionary)
    info_dict['industry_to_tickers'] = industry_to_tickers_map


    # Sector to industries
    sector_to_industries_dictionary = create_dictionary(biographical_json_pruned, "sector")
    populate_dictionary(sector_to_industries_dictionary, biographical_json_pruned, "sector", "industry")
    sector_to_industries_map = condition_dictionary(sector_to_industries_dictionary)
    info_dict['sector_to_industries'] = sector_to_industries_map

    # Industry to sector
    industry_to_sector_map = create_simple_map(biographical_json_pruned, "industry", "sector")
    info_dict['industry_to_sector'] = industry_to_sector_map

    # Ticker to security
    ticker_to_security_map = create_simple_map(biographical_json_pruned, "ticker", "security")
    info_dict['ticker_to_security'] = ticker_to_security_map

    # Ticker to industry
    ticker_to_industry_map = create_simple_map(biographical_json_pruned, "ticker", "industry")
    info_dict['ticker_to_industry'] = ticker_to_industry_map

    # Ticker to sector
    ticker_to_sector_map = create_simple_map(biographical_json_pruned, "ticker", "sector")
    info_dict['ticker_to_sector'] = ticker_to_sector_map

    # Security to ticker
    security_to_ticker_map = create_simple_map(biographical_json_pruned, "security", "ticker")
    info_dict['security_to_ticker'] = security_to_ticker_map

    # Security to industry
    security_to_industry_map = create_simple_map(biographical_json_pruned, "security", "industry")
    info_dict['security_to_industry'] = security_to_industry_map

    # Security to sector
    security_to_sector_map = create_simple_map(biographical_json_pruned, "security", "sector")
    info_dict['security_to_sector'] = security_to_sector_map

def generate_technical_map(raw_data_historical, raw_data_current, valid_tickers, ticker_to_security_map, info_dict):
    
    global NUM_VALID_TICKERS
    # collections and variables used throughout program
    big_dictionary = {} # this is what we are targeting throughout.  the data gets cleaned, sifted, and placed in here.
    big_list = [] # this is what gets dumped to json as the output file.  very important data target.
    pb_list = [] # holds the pb numerical values.  gets sorted. used to produce rankings.
    pe_list = [] # holds the pe numerical values.  gets sorted. used to produce rankings.
    ps_list = [] # holds the ps numerical values.  gets sorted. used to produce rankings.
    div_list = [] # holds the div numerical values.  gets sorted. used to produce rankings.
    s_score_list = [] # holds the s_score numerical values.  gets sorted. used to produce rankings.
    pb_decile_dictionary = {} # key=ticker, value=decile.  used to produce rankings.
    pe_decile_dictionary = {} # key=ticker, value=decile.  used to produce rankings.
    ps_decile_dictionary = {} # key=ticker, value=decile.  used to proudce rankings.
    div_decile_dictionary = {} # key=ticker, value=decile.  used to produce rankings.
    s_score_dictionary = {} # key=ticker, value=s_score.  used to produce rankings.
    s_rank_dictionary = {} # key=ticker, value=s_rank.  used to produce rankings.


    valid_tickers = set(valid_tickers['valid_tickers'])
    NUM_VALID_TICKERS = len(valid_tickers)

    populate_big_dictionary(big_dictionary, raw_data_historical, raw_data_current, valid_tickers)

    populate_ratio_lists(pb_list, pe_list, ps_list, div_list, big_dictionary)

    sort_ratio_lists(pb_list, pe_list, ps_list, div_list)

    # # keep this in main since you would have to pass 17 params otherwise
    # # populate pbDictionary, peDictionary, psDictionary, divDictionary
    for key in big_dictionary:
        populate_decile_dictionary(key, 'pb_cur', pb_list, pb_decile_dictionary, big_dictionary, False)
        populate_decile_dictionary(key, 'pe_cur', pe_list, pe_decile_dictionary, big_dictionary, False)
        populate_decile_dictionary(key, 'ps_cur', ps_list, ps_decile_dictionary, big_dictionary, False)
        populate_decile_dictionary(key, 'div_cur', div_list, div_decile_dictionary, big_dictionary, True)

    populate_s_score_dictionary_s_score_list(   s_score_dictionary, 
                                                s_score_list, 
                                                big_dictionary,
                                                pb_decile_dictionary, 
                                                pe_decile_dictionary, 
                                                ps_decile_dictionary, 
                                                div_decile_dictionary)
    
    sort_s_score_list(s_score_list)

    populate_s_rank_dictionary(big_dictionary, s_score_dictionary, s_score_list, s_rank_dictionary)

    append_s_rank_to_big_dictionary(big_dictionary, s_rank_dictionary)

    append_company_name_to_big_dictionary(big_dictionary, ticker_to_security_map)

    # big_list = big_dictionary.values()

    info_dict['technical_map'] = big_dictionary

def write_info_json(info_dict):
    with open(cwd+'/public/json_files/info.json', 'w') as outfile:
        json.dump(info_dict, outfile, indent=4)


def main():
    i = 1
    while True:
        print "Starting iteration: ", i
        i+= 1

        info_dict = {}

        raw_data_biographical = read_biographical_data()

        raw_data_historical = read_historical_data()

        raw_data_current = read_current_data()

        tickers_json = read_valid_tickers()

        generate_all_json_maps(raw_data_biographical, tickers_json, info_dict)

        generate_technical_map(raw_data_historical, raw_data_current, tickers_json, info_dict['ticker_to_security'], info_dict)

        write_info_json(info_dict)
    
        time.sleep(300)


if __name__ == "__main__":
    main()
