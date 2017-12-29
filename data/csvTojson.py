#!/usr/bin/python3.5
# -*- coding: Utf-8 -*-


import json


##### EXPORT #####

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

	# Used for verif, data in dictionnary corresponds to the tsv file =D
	
	return megaDict
	
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
		for country in sorted(cloadTrans) :
			megaDict[str(year)][country] = {}
			for typeGood in typeOfgood :
				megaDict[str(year)][country][typeGood] = {}
				for unload in cunloadTrans :
					megaDict[str(year)][country][typeGood][unload] = 0 

	# megaDict initalized, with all value to 0.
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
	
def get_Data_Export(input_file, translate, megaDict) :

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
					megaDict["2008"][cLoad][typeGood][cUnload] += int(year2008)
					megaDict["2009"][cLoad][typeGood][cUnload] += int(year2009)
					megaDict["2010"][cLoad][typeGood][cUnload] += int(year2010)
					megaDict["2011"][cLoad][typeGood][cUnload] += int(year2011)
					megaDict["2012"][cLoad][typeGood][cUnload] += int(year2012)
					megaDict["2013"][cLoad][typeGood][cUnload] += int(year2013)
					megaDict["2014"][cLoad][typeGood][cUnload] += int(year2014)
					megaDict["2015"][cLoad][typeGood][cUnload] += int(year2015)
					megaDict["2016"][cLoad][typeGood][cUnload] += int(year2016)

def add_Total_Export(megaDict) :

	for year in sorted(megaDict) :
		for country in sorted(megaDict[year]) :
			for tGood in sorted(megaDict[year][country]) :
				tot = 0
				for cunload in sorted(megaDict[year][country][tGood]) :
					tot += int(megaDict[year][country][tGood][cunload])
				megaDict[year][country][tGood]["TOTAL"] = tot




##### IMPORT #####

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
	##print(ISO_Translate)
	exports = Make_dictionary_Export("Data_exchange_by_type_of_goods.tsv", ISO_Translate)

	imports = Make_dictionary_Import("Data_exchange_by_type_of_goods.tsv", ISO_Translate)


	##print(exports["2016"]["FRA"]["GT01"])
	##print(imports["2016"]["FRA"]["GT01"])
	
	with open('exports.json', 'w') as outfile:
		json.dump(exports, outfile, ensure_ascii=False)

	with open('imports.json', 'w') as outfile :
		json.dump(imports, outfile, ensure_ascii=False)

	
if __name__ == "__main__" :
	main()




			##if cLoad in translate.keys() :
				##megaDict["2016"][cLoad][typeGood][cUnload] = year2016
				##megaDict["2015"][cLoad][typeGood][cUnload] = year2015
				##megaDict["2014"][cLoad][typeGood][cUnload] = year2014
				##megaDict["2013"][cLoad][typeGood][cUnload] = year2013
				##megaDict["2012"][cLoad][typeGood][cUnload] = year2012
				##megaDict["2011"][cLoad][typeGood][cUnload] = year2011
				##megaDict["2010"][cLoad][typeGood][cUnload] = year2010
				##megaDict["2009"][cLoad][typeGood][cUnload] = year2009
				##megaDict["2008"][cLoad][typeGood][cUnload] = year2008
				
			##print("Carriage : " + carriage + " Country Load : " + cLoad + " Country unload : " + cUnload + " type of good : " + typeGood)
			##print("2016 : " + year2016)
			##print("2015 : " + year2015)
			##print("2014 : " + year2014)
			##print("2013 : " + year2013)
			##print("2012 : " + year2012)
			##print("2011 : " + year2011)
			##print("2010 : " + year2010)
			##print("2009 : " + year2009)
			##print("2008 : " + year2008)
