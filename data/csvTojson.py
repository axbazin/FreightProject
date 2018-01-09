#!/usr/bin/python3.5
# -*- coding: Utf-8 -*-


import json


##### EXPORT #####

"""
Make dictionnary of export, from the export file in tsv format, to write it in json format
Uses Init Dict Export, get Data and add Total functions
"""

def Make_dictionary_Export(input_file, translate) :

	#Init of Dictionnary :
	megaDict = Init_Dict_Export(input_file, translate)

	get_Data_Export(input_file, translate, megaDict)

	add_Total_Export(megaDict)
	
	##for cload in sorted(megaDict["2016"]) :
		##print(cload + " : ")
	##for typeGood in sorted(megaDict["2016"]["FRA"]) :
		##print(typeGood + " : ") 
		##print(megaDict["2016"]["FRA"][typeGood])

	# Used for verif, data in dictionnary corresponds to the tsv file, yeepee =D
	
	return megaDict



"""
Initialize the dictionnary for the export
"""
def Init_Dict_Export(input_file, translate) : 

	#Init empty dictionnary
	megaDict = {}

	#Init dates, from 2008 to 2016 
	for i in range(2016, 2007, -1) :
		megaDict[str(i)] = {}

	#Open file, to get every country load, unload, and type of good 
	f = open(input_file, 'r')
	f.readline()
	Fini = False
	countryLoad = []
	countryUnload = []
	typeOfgood = []
	while not Fini :
		line = f.readline()
		if line == "" :
			Fini = True
		else :
			# Split by tabulation first (tsv file), and first cell by comma after (separator for the first cell, don't ask why, idk) 
			Line = line.split("\t")
			Info = Line[0]
			Info = Line[0].split(",")
			#First cell contains all info useful (type of carriage, country of load/unload, etc. 
			carriage = Info[0]
			cLoad = Info[1]
			cUnload = Info[2]
			typeGood = Info[3]
			unit = Info[4]
			geoTime = Info[5]

			# Then get the numbers for each year (Totally useless now i guess - 09/01/18)
			year2016 = Line[1]
			year2015 = Line[2]
			year2014 = Line[3]
			year2013 = Line[4]
			year2012 = Line[5]
			year2011 = Line[6]
			year2010 = Line[7]
			year2009 = Line[8]
			year2008 = Line[9]

			# we have a list of the countries in which goods have been loaded. To init the dictionnary. So we put cload in that list if it's not already in it. 
			if cLoad not in countryLoad :
				countryLoad.append(cLoad)
			# Same for unload countries 
			if cUnload not in countryUnload :
				countryUnload.append(cUnload)
			# And for type of goods
			if typeGood not in typeOfgood :
				typeOfgood.append(typeGood)

	# Translate cload and cunload, to only keep the ones in our map, and to get the ISO3 denomination to match with what we have in our map 
	cloadTrans = []
	cunloadTrans = []
	for country in sorted(countryLoad) :
		if country in translate.keys() : 
			cloadTrans.append(translate[country])
	for country in sorted(countryUnload) :
		if country in translate.keys() :
			cunloadTrans.append(translate[country])

	# in cloadTrans, each country load in our basic europe map, translated to ISO3 denomination
	# idem in cunloadTrans, for the unload country
	# in typeOfGood, each type of good (GT01 to GT20)

	# From that, we can init the dictionnary
	for year in range(2016, 2007, -1) : 
		for country in sorted(cloadTrans) :
			megaDict[str(year)][country] = {}
			for typeGood in typeOfgood :
				megaDict[str(year)][country][typeGood] = {}
				for unload in cunloadTrans :
					megaDict[str(year)][country][typeGood][unload] = 0 

	# megaDict initalized, with all value to 0. Follow this representation : 
	# {
		# 2016 :
			# { FRA :
				#{ GT01 :
					# { ENG : 0, SVK : 0, ... }
				#  GT02 :
					#{ ... }
				# ...
				#  TOTAL :
					# { ENG : 0, SVK : 0 .... } }
			# BEL :
				# { GT01 :
					# { FRA : 0 .... }
				# ...
			# ...
		# 2015 : ...

	return megaDict

"""
get the data from the exports
"""
def get_Data_Export(input_file, translate, megaDict) :

	f = open(input_file, 'r')
	f.readline()
	Fini = False
	while not Fini :
		line = f.readline()
		if line == "" :
			Fini = True
		else :
			# Split by tabulation, then by comma, see function above to get why if it's not obvious 
			Line = line.split("\t")
			Info = Line[0]
			Info = Line[0].split(",")
			carriage = Info[0]
			cLoad = Info[1]
			cUnload = Info[2]
			typeGood = Info[3]
			unit = Info[4]
			geoTime = Info[5]

			# Get data for each year 
			year2016 = Line[1]
			year2015 = Line[2]
			year2014 = Line[3]
			year2013 = Line[4]
			year2012 = Line[5]
			year2011 = Line[6]
			year2010 = Line[7]
			year2009 = Line[8]
			year2008 = Line[9]

			# We dont take the TOT lines, cause they are useless and break everything. We'll get the total from our total function, i checked, it changes nothing except focus on data we will use with our method 
			if carriage != "TOT" :

				# We verify if the countries is in translate. In translate, we have every country of interest, with their ISO2 and ISO3 denomination 
				Okay = False
				# Verify country of loading
				if cLoad in translate.keys() :
					# AND country of unloading
					if cUnload in translate.keys() :
						# if both are in translate, we have an exchange between 2 countries of interest. So we translate their ISO2 in ISO3 (to use them in the map properly without translation to make in js, which would be less easy to do. 
						cLoad = translate[cLoad]
						cUnload = translate[cUnload]
						Okay = True

				# Okay is True, both countries are translated and of interest, we can add their data to the megaDict for each year. 
				if Okay == True : 
					megaDict["2008"][cLoad][typeGood][cUnload] += int(year2008)
					megaDict["2009"][cLoad][typeGood][cUnload] += int(year2009)
					megaDict["2010"][cLoad][typeGood][cUnload] += int(year2010)
					megaDict["2011"][cLoad][typeGood][cUnload] += int(year2011)
					megaDict["2012"][cLoad][typeGood][cUnload] += int(year2012)
					megaDict["2013"][cLoad][typeGood][cUnload] += int(year2013)
					megaDict["2014"][cLoad][typeGood][cUnload] += int(year2014)
					megaDict["2015"][cLoad][typeGood][cUnload] += int(year2015)
					megaDict["2016"][cLoad][typeGood][cUnload] += int(year2016)

"""
Add the total in the dict. Cause we want them for the map. Total for each type of good by country, and for all type of good for each country
"""
def add_Total_Export(megaDict) :
	# For each year ... 
	for year in sorted(megaDict) :
		# And each country ... 
		for country in sorted(megaDict[year]) :
			# And each type of good : 
			for tGood in sorted(megaDict[year][country]) :
				tot = 0
				# get number from the unload country, and add it to the total 
				for cunload in sorted(megaDict[year][country][tGood]) :
					tot += int(megaDict[year][country][tGood][cunload])
				# So the total for this type of good can be added to the dictionnary 
				megaDict[year][country][tGood]["TOTAL"] = tot




##### IMPORT #####

"""
basically the same things as the exports, just switch load and unload, so to get more precision, see functions above, they are the same 
"""

def Make_dictionary_Import(input_file, translate) :
	# Init dictionary 
	megaDict = Init_Dict_Import(input_file, translate)

	# Get Data 
	get_Data_Import(input_file, translate, megaDict)

	# Add total 
	add_Total_Import(megaDict)

	return megaDict

def Init_Dict_Import(input_file, translate) : 

	#Init empty dictionnary
	megaDict = {}

	#Init dates, from 2008 to 2016 
	for i in range(2016, 2007, -1) :
		megaDict[str(i)] = {}

	#Open file, to get every country load, unload, and type of good 
	f = open(input_file, 'r')
	f.readline()
	Fini = False
	countryLoad = []
	countryUnload = []
	typeOfgood = []
	while not Fini :
		line = f.readline()
		if line == "" :
			Fini = True
		else :
			Line = line.split("\t")
			Info = Line[0]
			Info = Line[0].split(",")
			carriage = Info[0]
			cLoad = Info[1]
			cUnload = Info[2]
			typeGood = Info[3]
			unit = Info[4]
			geoTime = Info[5]
			
			year2016 = Line[1]
			year2015 = Line[2]
			year2014 = Line[3]
			year2013 = Line[4]
			year2012 = Line[5]
			year2011 = Line[6]
			year2010 = Line[7]
			year2009 = Line[8]
			year2008 = Line[9]

			if cLoad not in countryLoad :
				countryLoad.append(cLoad)
			if cUnload not in countryUnload :
				countryUnload.append(cUnload)
			if typeGood not in typeOfgood :
				typeOfgood.append(typeGood)


	# Translate cload and cunload, to only keep the ones in our map, and to get the ISO3 denomination to match with what we have in our map 
	cloadTrans = []
	cunloadTrans = []
	for country in sorted(countryLoad) :
		if country in translate.keys() : 
			cloadTrans.append(translate[country])
	for country in sorted(countryUnload) :
		if country in translate.keys() :
			cunloadTrans.append(translate[country])
	
	# in cloadTrans, each country load in our basic europe map, translated to ISO3 denomination
	# idem in cunloadTrans, for the unload country
	# in typeOfGood, each type of good (GT01 to GT20)

	# From that, we can init the dictionnary
	for year in range(2016, 2007, -1) : 
		for country in sorted(cunloadTrans) :
			megaDict[str(year)][country] = {}
			for typeGood in typeOfgood :
				megaDict[str(year)][country][typeGood] = {}
				for load in cloadTrans :
					megaDict[str(year)][country][typeGood][load] = 0

	return megaDict

def get_Data_Import(input_file, translate, megaDict) :

	f = open(input_file, 'r')
	f.readline()
	Fini = False
	countryLoad = []
	countryUnload = []
	typeOfgood = []
	while not Fini :
		line = f.readline()
		if line == "" :
			Fini = True
		else :
			Line = line.split("\t")
			Info = Line[0]
			Info = Line[0].split(",")
			carriage = Info[0]
			cLoad = Info[1]
			cUnload = Info[2]
			typeGood = Info[3]
			unit = Info[4]
			geoTime = Info[5]
			
			year2016 = Line[1]
			year2015 = Line[2]
			year2014 = Line[3]
			year2013 = Line[4]
			year2012 = Line[5]
			year2011 = Line[6]
			year2010 = Line[7]
			year2009 = Line[8]
			year2008 = Line[9]

			if carriage != "TOT" :
				
				Okay = False
				if cLoad in translate.keys() :
					if cUnload in translate.keys() :
						cLoad = translate[cLoad]
						cUnload = translate[cUnload]
						Okay = True

				if Okay == True : 
					megaDict["2008"][cUnload][typeGood][cLoad] += int(year2008)
					megaDict["2009"][cUnload][typeGood][cLoad] += int(year2009)
					megaDict["2010"][cUnload][typeGood][cLoad] += int(year2010)
					megaDict["2011"][cUnload][typeGood][cLoad] += int(year2011)
					megaDict["2012"][cUnload][typeGood][cLoad] += int(year2012)
					megaDict["2013"][cUnload][typeGood][cLoad] += int(year2013)
					megaDict["2014"][cUnload][typeGood][cLoad] += int(year2014)
					megaDict["2015"][cUnload][typeGood][cLoad] += int(year2015)
					megaDict["2016"][cUnload][typeGood][cLoad] += int(year2016)


def add_Total_Import(megaDict) :

	for year in sorted(megaDict) :
		for country in sorted(megaDict[year]) :
			for tGood in sorted(megaDict[year][country]) :
				tot = 0
				for cunload in sorted(megaDict[year][country][tGood]) :
					tot += int(megaDict[year][country][tGood][cunload])
				megaDict[year][country][tGood]["TOTAL"] = tot
	


def main() :

	
	ISO_Translate = json.load(open("iso2Toiso3.json", 'r'))
	# We add manually 2 translation for greece and UK, cause there is more than one ISO3 for these 2 countries 
	ISO_Translate["UK"] = "GBK"
	ISO_Translate["EL"] = "GRC"

	# Get the export dictionnary 
	exports = Make_dictionary_Export("Data_exchange_by_type_of_goods.tsv", ISO_Translate)

	# Get the import dictionnary 
	imports = Make_dictionary_Import("Data_exchange_by_type_of_goods.tsv", ISO_Translate)

	
	## print(imports["2016"]["FRA"]["GT01"])

	# Make the freight dictionnary, to only write in one file instead of two, with just one more stratum 
	freight = {}
	# In import, imports dictionnary, in export, export dictionnary 
	freight["import"] = imports
	freight["export"] = exports

	##print(exports["2016"]["FRA"]["GT01"])
	##print(imports["2016"]["FRA"]["GT01"])

	# Write in json file 
	with open('freight.json', 'w') as outfile :
		json.dump(freight, outfile, ensure_ascii=False)

	
if __name__ == "__main__" :
	main()
