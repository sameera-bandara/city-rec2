FROM mongo

COPY cityrec_cities.json /cityrec_cities.json
CMD mongoimport --host mongodb --db city-rec-2 --collection cities --type json --file /cityrec_cities.json
