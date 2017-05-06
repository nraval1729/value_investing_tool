import unittest
from historical_scraper import *

class TestHistoricalScraper(unittest.TestCase):

    def test_key_error(self): 
    	with self.assertRaises(KeyError):
        	curr_ticker = global_curr_dict["ticker"]

if __name__ == "__main__":
    unittest.main()