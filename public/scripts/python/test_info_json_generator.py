import unittest
from info_json_generator import *

class TestInfoJsonGenerator(unittest.TestCase):

    def test_key_error(self): 
        with self.assertRaises(KeyError):
            tickers = set(tickers_json['valid_tickers'])            

if __name__ == "__main__":
    unittest.main()