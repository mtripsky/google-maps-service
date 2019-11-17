const Event = require('./models/events');
const mongoose = require('mongoose');
const https = require('https')
var moment = require('moment-timezone');

// connect to mongodb
const dotenv = require('dotenv').config();
const user = process.env.dbUser;
const password = process.env.dbPassword;
const dbName = process.env.dbName;
const dbUrl = "mongodb+srv://" + user + ":" + password + "@mylittlecluster-6yv9h.gcp.mongodb.net/" + dbName;
mongoose.connect(dbUrl,{ useNewUrlParser: true , useCreateIndex: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

const intervalInMin = 5;
const startHour = 6;
const endHour = 9;
const originAddress = "Jourdanplein+26,+1040+Etterbeek,+Belgium";
const destinationAddress = "ArcelorMittal,+John+F.+Kennedylaan+51,+9042+Gent,+Belgium";
const key = process.env.googleKey;

function GetDurationBetweenOriginAndDestination()
{
    const timeNow = moment().tz('Europe/Brussels');
    const day = timeNow.day();
    const hour = timeNow.hour();

    if(day > 0 && day < 6 && hour >= startHour && hour < endHour)
    {
        https.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + originAddress + "&destinations=" + destinationAddress + "&departure_time=now&traffic_model=best_guess&key=" + key,
        res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('error', error => {
                console.error(error)
            });

            res.on('end', () => {
                const result = JSON.parse(data).rows[0].elements[0];
                const record = {
                    dateTime: timeNow.format('YYYY-MM-DDTHH:mm:ss'),
                    distance: Math.ceil(parseFloat(result.distance.value) / 1000),
                    duration: Math.ceil(parseFloat(result.duration.value) / 60),
                    duration_in_traffic: Math.ceil(parseFloat(result.duration_in_traffic.value) / 60)
                };
                console.log(record);
                const dbRecord = {
                    dateTime: timeNow,
                    source: "DurationService",
                    content: JSON.stringify(record)
                };
                Event.create(dbRecord);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    return GetDurationBetweenOriginAndDestination;
}

setInterval(GetDurationBetweenOriginAndDestination(), intervalInMin*60*1000);
