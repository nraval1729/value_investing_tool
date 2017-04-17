var industryToTickers = [
    {
    "Life & Health Insurance": [
        "AFL", 
        "MET", 
        "PFG", 
        "PRU"
    ], 
    "Home Improvement Retail": [
        "HD"
    ], 
    "Food Retail": [
        "KR"
    ], 
    "Health Care Services": [
        "DGX"
    ], 
    "Industrial Machinery": [
        "PNR", 
        "CMI", 
        "FLS", 
        "IR", 
        "GWW", 
        "ITW", 
        "PH", 
        "DOV"
    ], 
    "Apparel, Accessories & Luxury Goods": [
        "COH", 
        "NKE", 
        "PVH"
    ], 
    "Oil & Gas Refining & Marketing": [
        "MPC"
    ], 
    "Electronic Components": [
        "APH", 
        "GLW"
    ], 
    "Computer & Electronics Retail": [
        "BBY"
    ], 
    "Investment Banking & Brokerage": [
        "GS", 
        "MS"
    ], 
    "Multi-Utilities": [
        "NI", 
        "EXC", 
        "CNP", 
        "NEE", 
        "DTE", 
        "AEE", 
        "PNW", 
        "CMS", 
        "ES"
    ], 
    "Office REITs": [
        "BXP"
    ], 
    "Aerospace & Defense": [
        "BA", 
        "LMT", 
        "NOC", 
        "GD", 
        "LLL", 
        "COL"
    ], 
    "Construction Materials": [
        "MLM"
    ], 
    "Restaurants": [
        "DRI"
    ], 
    "Automotive Retail": [
        "AAP"
    ], 
    "Automobile Manufacturers": [
        "F"
    ], 
    "Semiconductors": [
        "MCHP", 
        "NVDA", 
        "INTC", 
        "ADI"
    ], 
    "Health Care Equipment": [
        "A", 
        "MDT", 
        "ABT", 
        "BCR", 
        "BAX"
    ], 
    "Department Stores": [
        "M", 
        "JWN"
    ], 
    "Drug Retail": [
        "CVS"
    ], 
    "Research & Consulting Services": [
        "EFX"
    ], 
    "Regional Banks": [
        "PNC", 
        "BBT", 
        "KEY", 
        "HBAN"
    ], 
    "Agricultural Products": [
        "ADM"
    ], 
    "Housewares & Specialties": [
        "NWL"
    ], 
    "IT Consulting & Other Services": [
        "ACN", 
        "IBM"
    ], 
    "Diversified Support Services": [
        "CTAS"
    ], 
    "Industrial Conglomerates": [
        "HON", 
        "MMM", 
        "GE"
    ], 
    "Multi-line Insurance": [
        "L", 
        "LNC", 
        "AIZ"
    ], 
    "Integrated Telecommunication Services": [
        "CTL"
    ], 
    "Specialized REITs": [
        "DLR", 
        "PSA", 
        "EXR", 
        "AMT", 
        "IRM"
    ], 
    "Data Processing & Outsourced Services": [
        "GPN"
    ], 
    "Diversified Chemicals": [
        "EMN"
    ], 
    "Construction Machinery & Heavy Trucks": [
        "PCAR"
    ], 
    "Home Furnishings": [
        "LEG"
    ], 
    "Residential REITs": [
        "MAA", 
        "EQR", 
        "ESS", 
        "AVB"
    ], 
    "Insurance Brokers": [
        "AON", 
        "MMC", 
        "AJG"
    ], 
    "Packaged Foods & Meats": [
        "GIS", 
        "HRL", 
        "CPB", 
        "MDLZ", 
        "MKC", 
        "HSY", 
        "CAG"
    ], 
    "Asset Management & Custody Banks": [
        "AMP", 
        "BEN", 
        "IVZ", 
        "BLK", 
        "NTRS"
    ], 
    "Railroads": [
        "KSU", 
        "NSC", 
        "CSX"
    ], 
    "Hotels, Resorts & Cruise Lines": [
        "CCL", 
        "MAR"
    ], 
    "Internet & Direct Marketing Retail": [
        "EXPE"
    ], 
    "Systems Software": [
        "CA"
    ], 
    "Apparel Retail": [
        "FL", 
        "GPS"
    ], 
    "Fertilizers & Agricultural Chemicals": [
        "MOS", 
        "FMC"
    ], 
    "Specialty Chemicals": [
        "PPG", 
        "IFF", 
        "ECL", 
        "ALB", 
        "LYB"
    ], 
    "Diversified Banks": [
        "C", 
        "JPM", 
        "BAC", 
        "CMA"
    ], 
    "Personal Products": [
        "EL", 
        "PG"
    ], 
    "Pharmaceuticals": [
        "LLY", 
        "PFE"
    ], 
    "Building Products": [
        "FAST"
    ], 
    "Water Utilities": [
        "AWK"
    ], 
    "Homebuilding": [
        "LEN", 
        "DHI"
    ], 
    "Consumer Electronics": [
        "GRMN"
    ], 
    "Household Products": [
        "CLX", 
        "CHD"
    ], 
    "Retail REITs": [
        "O", 
        "MAC", 
        "GGP", 
        "KIM", 
        "FRT"
    ], 
    "Electronic Equipment & Instruments": [
        "FLIR"
    ], 
    "Steel": [
        "NUE"
    ], 
    "Electrical Components & Equipment": [
        "AYI", 
        "AME", 
        "ETN"
    ], 
    "Tobacco": [
        "MO"
    ], 
    "Semiconductor Equipment": [
        "AMAT", 
        "KLAC"
    ], 
    "Trucking": [
        "JBHT"
    ], 
    "Broadcasting": [
        "CBS"
    ], 
    "Internet Software & Services": [
        "INTU", 
        "FIS", 
        "PAYX", 
        "MA", 
        "ADP"
    ], 
    "Industrial REITs": [
        "PLD"
    ], 
    "Multi-Sector Holdings": [
        "LUK"
    ], 
    "Specialty Stores": [
        "GPC"
    ], 
    "Managed Health Care": [
        "ANTM", 
        "HUM", 
        "AET"
    ], 
    "Paper Packaging": [
        "IP", 
        "AVY"
    ], 
    "Publishing": [
        "FOXA", 
        "FOX"
    ], 
    "General Merchandise Stores": [
        "KSS"
    ], 
    "Airlines": [
        "LUV"
    ], 
    "Oil & Gas Storage & Transportation": [
        "OKE", 
        "KMI"
    ], 
    "Air Freight & Logistics": [
        "CHRW", 
        "FDX", 
        "EXPD"
    ], 
    "Soft Drinks": [
        "KO", 
        "DPS", 
        "PEP"
    ], 
    "Communications Equipment": [
        "CSCO", 
        "HRS"
    ], 
    "Property & Casualty Insurance": [
        "CINF", 
        "CB", 
        "ALL", 
        "PGR"
    ], 
    "Health Care REITs": [
        "HCP", 
        "HCN"
    ], 
    "Advertising": [
        "OMC", 
        "IPG"
    ], 
    "Metal & Glass Containers": [
        "BLL"
    ], 
    "Biotechnology": [
        "AMGN"
    ], 
    "Health Care Supplies": [
        "PDCO"
    ], 
    "Home Entertainment Software": [
        "ATVI"
    ], 
    "Industrial Gases": [
        "PX", 
        "APD"
    ], 
    "Application Software": [
        "ORCL"
    ], 
    "Consumer Finance": [
        "AXP", 
        "DFS", 
        "COF"
    ], 
    "Health Care Distributors": [
        "MCK", 
        "BMY", 
        "CAH"
    ], 
    "Motorcycle Manufacturers": [
        "HOG"
    ], 
    "Construction & Engineering": [
        "FLR"
    ], 
    "Leisure Products": [
        "HAS", 
        "MAT"
    ], 
    "Financial Exchanges & Data": [
        "CME", 
        "CBOE", 
        "NDAQ"
    ], 
    "Electric Utilities": [
        "AEP", 
        "DUK", 
        "D", 
        "EIX", 
        "ED", 
        "PPL", 
        "LNT"
    ]
}]