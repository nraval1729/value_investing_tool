import unittest
from current_scraper import *

class TestCurrentScraper(unittest.TestCase):

    def test_write_current_data(self): 
        self.assertEqual(current_data, write_current_data(sorted_biographical_list_of_dicts))

if __name__ == "__main__":
    unittest.main()