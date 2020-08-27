"use strict";

var express = require('express');

var app = express();

var fetch = require('node-fetch');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var convert = require('xml-js');

var parse = require('csv-parse/lib/sync');

var jsonResponse;
var dataLength;
var rawData = null;
app.listen(3000, function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('listening at 3000');
          _context.next = 3;
          return regeneratorRuntime.awrap(getData());

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.use(express["static"]('public'));

function getData() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'http://www.emodnet-physics.eu/map/service/WSEmodnet2.asmx', true); // build SOAP request

  var sr = '<?xml version="1.0" encoding="utf-8"?>' + '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' + '<soap12:Body>' + '<GetAllLatestData60Days xmlns="https://www.emodnet-physics.eu">' + '<PlatformID>' + 978456 + '</PlatformID>' + '</GetAllLatestData60Days>' + '</soap12:Body>' + '</soap12:Envelope>';

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
  }; // Send the POST request


  xmlhttp.setRequestHeader('Content-Type', 'text/xml');
  xmlhttp.send(sr); // send request
  // ...
}

app.get('/dataLatest', function _callee2(request, response) {
  var latestData, latestDataValue, latestTemp, latestLat, latestLon, latestInfo;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // Keep only latest data
          latestData = rawData.elements[dataLength - 1].elements; // Parse the data
          // Looks like this : TEMP_QC=2;TEMP=20,7;VGHS_QC=1;VGHS=1,3;VDIR_QC=1;VDIR=287;DEPH_QC=7;DEPH=0;POSITION_QC=1;LONGITUDE=1,201;LATITUDE=49,98933;TIME_QC=1;TIME=25801,5486111111

          latestDataValue = parse(latestData[4].elements[0].text, {
            delimiter: ";"
          }); // Get only number value from temperature, lat and lon

          latestTemp = parse(latestDataValue[0][1], {
            delimiter: "="
          })[0][1];
          latestLat = parse(latestDataValue[0][10], {
            delimiter: "="
          })[0][1];
          latestLon = parse(latestDataValue[0][9], {
            delimiter: "="
          })[0][1]; // Create json object with all this processed data

          latestInfo = {
            platformID: latestData[1].elements[0].text,
            date: latestData[2].elements[0].text,
            temp: latestTemp.replace(",", "."),
            lat: latestLat.replace(",", "."),
            lon: latestLon.replace(",", ".")
          }; // Send response back

          response.json(latestInfo);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.get('/dataFull', function _callee3(request, response) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Send response back
          response.json(rawData);

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});
app.get('/dataFullTempDate', function _callee4(request, response) {
  var temperatureDateData, i, temperatureValue, dateTimeValue, parsedElement;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (rawData != null) {
            temperatureDateData = {};
            console.log('Processing date and temperature...');

            for (i = 0; i < rawData.length; i++) {
              temperatureValue = -1;
              dateTimeValue = -1; // Parse the data
              // Looks like this : TEMP_QC=2;TEMP=20,7;VGHS_QC=1;VGHS=1,3;VDIR_QC=1;VDIR=287;DEPH_QC=7;DEPH=0;POSITION_QC=1;LONGITUDE=1,201;LATITUDE=49,98933;TIME_QC=1;TIME=25801,5486111111

              parsedElement = parse(rawData[i].elements[4].elements[0].text, {
                delimiter: ";"
              })[0]; // RESULT : parsedElement = [TEMP_QC=2, TEMP=20,7, VGHS_QC=1, ...]

              if (parsedElement.length == 13) {
                // Data is the right size, we can extract the temperature value from index 1 of our array
                temperatureValue = parse(parsedElement[1], {
                  delimiter: "="
                })[0][1]; // Get date and time

                dateTimeValue = parse(rawData[i].elements[2].elements[0].text, {
                  delimiter: " "
                })[0]; // Associate temperature to date

                temperatureDateData[i] = {
                  'date': dateTimeValue[0].toString(),
                  'time': dateTimeValue[1].toString(),
                  'temp': temperatureValue.toString().replace(',', '.')
                };
              }
            }

            console.log('Done date and temperature!'); // Send response back

            response.json(temperatureDateData);
          } else {
            response.json(null);
          }

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
});