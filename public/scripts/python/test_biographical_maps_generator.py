import unittest
from biographical_maps_generator import *

class TestBiographicalMapsGenerator(unittest.TestCase):

	def test_prune_json(self):
		self.assertEqual(prune_json(raw_data_biographical, tickers), biographical_json_pruned)

	def test_create_dictionary(self):
		self.assertEqual(create_dictionary(biographical_json_pruned, "industry"), industry_to_tickers_dictionary)
		self.assertEqual(create_dictionary(biographical_json_pruned, "sector"), sector_to_industries_dictionary)

	def test_condition_dictionary(self):
		self.assertEqual(condition_dictionary(industry_to_tickers_dictionary), industry_to_tickers_map)
		self.assertEqual(condition_dictionary(sector_to_industries_dictionary), sector_to_industries_map)

	def test_create_simple_list(self):
		self.assertEqual(create_simple_list(biographical_json_pruned, "ticker", "security"), ticker_to_security_list)
		self.assertEqual(create_simple_list(biographical_json_pruned, "security", "ticker"), security_to_ticker_list)

	def test_create_simple_map(self):
		self.assertEqual(create_simple_map(biographical_json_pruned, "industry", "sector"), industry_to_sector_map)
		self.assertEqual(create_simple_map(biographical_json_pruned, "ticker", "security"), ticker_to_security_map)
		self.assertEqual(create_simple_map(biographical_json_pruned, "ticker", "industry"), ticker_to_industry_map)
		self.assertEqual(create_simple_map(biographical_json_pruned, "ticker", "sector"), ticker_to_sector_map)
		self.assertEqual(create_simple_map(biographical_json_pruned, "security", "ticker"), security_to_ticker_map)
		self.assertEqual(create_simple_map(biographical_json_pruned, "security", "industry"), security_to_industry_map)
		self.assertEqual(create_simple_map(biographical_json_pruned, "security", "sector"), security_to_sector_map)

if __name__ == "__main__":
	unittest.main()
