const express = require('express');
const app = express();
const fetch = require('node-fetch');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const convert = require('xml-js');
const parse = require('csv-parse/lib/sync');

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));


app.get('/platform', async (request, response) => {

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
        let jsonResponse = JSON.parse(convert.xml2json(xmlhttp.responseText));
        let dataLength = jsonResponse.elements[0].elements[0].elements[0].elements[0].elements.length;

        // Keep only latest data
        let latestData = jsonResponse.elements[0].elements[0].elements[0].elements[0].elements[dataLength - 1].elements;

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
      }
    }
  }
  // Send the POST request
  xmlhttp.setRequestHeader('Content-Type', 'text/xml');
  xmlhttp.send(sr);
  // send request
  // ...
});