const Nea = require('../models/Nea');
const csvtojson = require('csvtojson');
const path = require('path')
const mongoose = require('mongoose');

// Connecting to MongoDB to fill the NEAS collection with the initial data
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

const seed = async () => {

    try {
        // get the file location
        let dir = '../../OrbitalParameters_PHAs.csv';
        const csvfilepath = path.resolve(__dirname, dir);

        //console.log(csvfilepath);

        // Using the csvtojson to convert the data from the csv file to json 
        // and then in the promise we add the data to the database

        csvtojson().fromFile(csvfilepath).then( (rows) => {
            rows.forEach( async row => {
                const nea = new Nea(row);
                await nea.save();
            });
        });

        mongoose.connection.close();
        return true;

    } catch (error) {
        console.log('Error:', error);
    }

}

seed();