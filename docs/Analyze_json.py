#!/usr/bin/python3.5
# -*- coding: Utf-8 -*-

import json


data = json.load(open("europe.geojson", 'r'))

iso2 = []
fips = []
names = []
iso3 = []
for country in data['features'] :
	iso2.append(country['properties']['ISO2'])
	fips.append(country['properties']['FIPS'])
	names.append(country['properties']['NAME'])
	iso3.append(country['properties']['ISO3'])

iso2Toiso3 = {}

for i in range(len(iso2)) :
	print("Name : " + names[i])
	print("ISO2 : " + iso2[i])
	print("ISO3 : " + iso3[i])
	print("FIPS : " + fips[i])
	iso2Toiso3[iso2[i]] = iso3[i]

with open('iso2Toiso3.json', 'w') as outfile:
		json.dump(iso2Toiso3, outfile, ensure_ascii=False)
		
print(iso2Toiso3)


	
