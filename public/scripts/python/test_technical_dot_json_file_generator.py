import unittest
from technical_dot_json_file_generator import *

class TestTechnicalDotJsonFileGenerator(unittest.TestCase):

    def test_populate_big_dictionary(self): 
        self.assertEqual(populate_big_dictionary(big_dictionary, raw_data_historical, raw_data_current, valid_tickers), populated_big_dictionary)

    def test_populate_ratio_lists(self):
        self.assertEqual(populate_ratio_lists(pb_list, pe_list, ps_list, div_list, big_dictionary), populated_ratio_lists)

    def test_sort_ratio_lists(self):
        self.assertEqual(sort_ratio_lists(pb_list, pe_list, ps_list, div_list), sorted_ratio_lists)

    def test_populate_s_score_dictionary_s_score_list(self):
        self.assertEqual(populate_s_score_dictionary_s_score_list(   s_score_dictionary, 
                                                s_score_list, 
                                                big_dictionary,
                                                pb_decile_dictionary, 
                                                pe_decile_dictionary, 
                                                ps_decile_dictionary, 
                                                div_decile_dictionary), populated_s_score_dictionary_s_score_list)

    def test_sort_s_score_list(self):
        self.assertEqual(sort_s_score_list(s_score_list), sorted_s_score_list)

    def test_populate_s_rank_dictionary(self):
        self.assertEqual(populate_s_rank_dictionary(big_dictionary, s_score_dictionary, s_score_list, s_rank_dictionary), populated_s_rank_dictionary)

    def test_append_s_rank_to_big_dictionary(self):
        self.assertEqual(append_s_rank_to_big_dictionary(big_dictionary, s_rank_dictionary), appended_s_rank_to_big_dictionary)

    def test_append_company_name_to_big_dictionary(self):
        self.assertEqual(append_company_name_to_big_dictionary(big_dictionary, ticker_to_security_map), appended_company_name_to_big_dictionary)

if __name__ == "__main__":
    unittest.main()