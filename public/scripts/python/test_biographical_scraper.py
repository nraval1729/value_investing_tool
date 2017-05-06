import unittest
from biographical_scraper import *

class TestBiographicalScraper(unittest.TestCase):

    # def test_get_and_write_biographical_data(self): 
    #     self.assertEqual(get_and_write_biographical_data(), sorted_biographical_list_of_dicts)

    def test_dump_sorted_biographical_list_of_dicts(self): 
        self.assertEqual(dump_sorted_biographical_list_of_dicts(sorted_biographical_list_of_dicts)
, dumped_sorted_biographical_list_of_dicts)

if __name__ == "__main__":
    unittest.main()