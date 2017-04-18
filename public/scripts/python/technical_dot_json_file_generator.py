import json
import math

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
        pb_list.append(big_dictionary[key]['pb_cur'])
        pe_list.append(big_dictionary[key]['pe_cur'])
        ps_list.append(big_dictionary[key]['ps_cur'])
        div_list.append(big_dictionary[key]['div_cur'])


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
    val = big_dictionary[key][ratio]
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



def main():

    # collections and variables used throughout program
    global NUM_VALID_TICKERS
    valid_tickers = set()
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

    # get handles on the json files
    with open('historical.json') as infile:
        raw_data_historical = json.load(infile)

    with open('current.json') as infile:
        raw_data_current = json.load(infile)

    with open('valid_tickers.json') as infile:
        valid_tickers = json.load(infile)

    with open('ticker_to_security_map.json') as infile:
        ticker_to_security_map = json.load(infile)

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

    big_list = big_dictionary.values()

    # write the json files
    with open('technical_map.json', 'w') as outfile:
        json.dump(big_dictionary, outfile, indent=4)

    with open('technical.json', 'w') as outfile:
        json.dump(big_list, outfile, indent=4)

if __name__ == "__main__":
    main()