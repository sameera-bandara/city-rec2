FROM node:8
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./

RUN npm install
# Copy app source code
COPY . .

# add data
COPY mongo-seed/cityrec_cities.json /cityrec_cities.json
CMD mongoimport --host mongodb --db reach-engine --collection cities --type json --file /cityrec_cities.json --jsonArray

#Expose port and start application
EXPOSE 5000
CMD [ "npm", "start" ]