import unittest
from valid_tickers_generator import *

class TestValidTickersGenerator(unittest.TestCase):

    def test_get_biographical_tickers(self): 
        self.assertEqual(get_biographical_tickers(raw_data_biographical, len(raw_data_biographical)), valid_tickers_biographical)

    def test_get_valid_tickers(self):
    	self.assertEqual(get_valid_tickers(raw_data_current, len(raw_data_current), None), valid_tickers_current) 
    	self.assertEqual(get_valid_tickers(raw_data_historical, len(raw_data_historical), u'\u2014'), valid_tickers_historical) 

    def test_intersection(self):
    	self.assertEqual(valid_tickers_biographical.intersection(valid_tickers_current).intersection(valid_tickers_historical), tickers_intersection)

    def test_make_dictionary_from_set(self):
    	self.assertEqual(make_dictionary_from_set("valid_tickers", tickers_intersection), valid_tickers_dictionary)

if __name__ == "__main__":
    unittest.main()