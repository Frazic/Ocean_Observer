const express = require('express');
const app = express();
const fetch = require('node-fetch');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const convert = require('xml-js');
const parse = require('csv-parse/lib/sync');

let jsonResponse;
let dataLength;
let rawData = null;

app.listen(3000, async () => {
  console.log('listening at 3000');
  await getData();
});
app.use(express.static('public'));

function getData() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'http://www.emodnet-physics.eu/map/service/WSEmodnet2.asmx', true);

  // build SOAP request
  var sr =
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
    '<soap12:Body>' +
    '<GetAllLatestData60Days xmlns="https://www.emodnet-physics.eu">' +
    '<PlatformID>' + 978456 + '</PlatformID>' +
    '</GetAllLatestData60Days>' +
    '</soap12:Body>' +
    '</soap12:Envelope>';

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        // Process response into a readable format
        jsonResponse = JSON.parse(convert.xml2json(xmlhttp.responseText));
        dataLength = jsonResponse.elements[0].elements[0].elements[0].elements[0].elements.length;
        rawData = jsonResponse.elements[0].elements[0].elements[0].elements[0].elements;
        console.log('Data is ready');
      }
    }
  }
  // Send the POST request
  xmlhttp.setRequestHeader('Content-Type', 'text/xml');
  xmlhttp.send(sr);
  // send request
  // ...
}


app.get('/dataLatest', async (request, response) => {
  // Keep only latest data
  let latestData = rawData.elements[dataLength - 1].elements;

  // Parse the data
  // Looks like this : TEMP_QC=2;TEMP=20,7;VGHS_QC=1;VGHS=1,3;VDIR_QC=1;VDIR=287;DEPH_QC=7;DEPH=0;POSITION_QC=1;LONGITUDE=1,201;LATITUDE=49,98933;TIME_QC=1;TIME=25801,5486111111
  let latestDataValue = parse(latestData[4].elements[0].text, {
    delimiter: ";"
  });

  // Get only number value from temperature, lat and lon
  let latestTemp = parse(latestDataValue[0][1], {
    delimiter: "="
  })[0][1];
  let latestLat = parse(latestDataValue[0][10], {
    delimiter: "="
  })[0][1];
  let latestLon = parse(latestDataValue[0][9], {
    delimiter: "="
  })[0][1];

  // Create json object with all this processed data
  let latestInfo = {
    platformID: latestData[1].elements[0].text,
    date: latestData[2].elements[0].text,
    temp: latestTemp.replace(",", "."),
    lat: latestLat.replace(",", "."),
    lon: latestLon.replace(",", ".")
  };

  // Send response back
  response.json(latestInfo);
});

app.get('/dataFull', async (request, response) => {
  // Send response back
  response.json(rawData);
});

app.get('/dataFullTempDate', async (request, response) => {
  if (rawData != null) {
    let temperatureDateData = {};
    console.log('Processing date and temperature...');

    for (let i = 0; i < rawData.length; i++) {
      let temperatureValue = -1;
      let dateTimeValue = -1;

      // Parse the data
      // Looks like this : TEMP_QC=2;TEMP=20,7;VGHS_QC=1;VGHS=1,3;VDIR_QC=1;VDIR=287;DEPH_QC=7;DEPH=0;POSITION_QC=1;LONGITUDE=1,201;LATITUDE=49,98933;TIME_QC=1;TIME=25801,5486111111
      let parsedElement = parse(rawData[i].elements[4].elements[0].text, {
        delimiter: ";"
      })[0];
      // RESULT : parsedElement = [TEMP_QC=2, TEMP=20,7, VGHS_QC=1, ...]

      if (parsedElement.length == 13) {
        // Data is the right size, we can extract the temperature value from index 1 of our array
        temperatureValue = parse(parsedElement[1], {
          delimiter: "="
        })[0][1];

        // Get date and time
        dateTimeValue = parse(rawData[i].elements[2].elements[0].text, {
          delimiter: " "
        })[0];


        // Associate temperature to date
        temperatureDateData[i] = {
          'date': dateTimeValue[0].toString(),
          'time': dateTimeValue[1].toString(),
          'temp': temperatureValue.toString().replace(',', '.')
        };
      }
    }

    console.log('Done date and temperature!');

    // Send response back
    response.json(temperatureDateData);
  } else {
    response.json(null);
  }

});