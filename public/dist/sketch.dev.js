"use strict";

var latestData = null;

function setup() {
  // getLatestData();
  createCanvas(windowWidth, 500);
  background(0);
  show60DayTemperature();
}
/*
latestData {
  platformID,
  date,
  temp,
  lat,
  lon
}
*/


function draw() {}

function getLatestData() {
  var api_url, response;
  return regeneratorRuntime.async(function getLatestData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          api_url = '/dataLatest';
          console.log('Requesting data !');
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(api_url));

        case 4:
          response = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          latestData = _context.sent;
          console.log('latestData :>> ', latestData);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}

function showLatestData() {
  if (latestData != null) {
    clear();
    fill(255);
    noStroke();
    textSize(28);
    text('Marine Data off the coast of Dieppe', 30, 30);
    textSize(24);
    text('Platform ID : ' + latestData.platformID, 30, 90);
    text('Date : ' + latestData.date, 30, 120);
    text('Temperature : ' + latestData.temp + '°C', 30, 150);
    text('Latitude : ' + latestData.lat, 30, 180);
    text('Longitude : ' + latestData.lon, 30, 210);
  }
}

function show60DayTemperature() {
  var temperatureData, valueCount, tempMin, tempMax, graphStartX, graphStartY, key, element, xCoord, yCoord;
  return regeneratorRuntime.async(function show60DayTemperature$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          temperatureData = null;

        case 1:
          if (!(temperatureData == null)) {
            _context2.next = 7;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(requestData('/dataFullTempDate'));

        case 4:
          temperatureData = _context2.sent;
          _context2.next = 1;
          break;

        case 7:
          console.log('temperatureData :>> ', temperatureData);

          if (temperatureData != null) {
            clear();
            background(75);
            valueCount = Object.keys(temperatureData).length; // console.log('valueCount :>> ', valueCount);

            tempMin = 17;
            tempMax = 24; // TITLE

            fill(255);
            noStroke();
            textSize(20);
            text('Dieppe sea temperature over last 60 days (°C)', 40, 30); // AXIS

            graphStartX = 30;
            graphStartY = height * .8; // Y axis

            stroke(255);
            strokeWeight(2);
            line(graphStartX, graphStartY, graphStartX, 60);
            textSize(15);
            noStroke();
            text(tempMin, graphStartX - 20, graphStartY);
            text(tempMax, graphStartX - 20, 70); // X axis

            stroke(255);
            strokeWeight(2);
            line(graphStartX, graphStartY, width - 10, graphStartY);
            textSize(15);
            noStroke();
            text(temperatureData[0].date, graphStartX, graphStartY + 20);
            text(temperatureData[valueCount - 1].date, width - 80, graphStartY + 20);

            for (key in temperatureData) {
              if (temperatureData.hasOwnProperty(key)) {
                element = temperatureData[key]; // console.log('element.temp :>> ', element.temp);
                // TEMPERATURE POINTS

                xCoord = map(key, 0, valueCount, graphStartX + 10, width - 30);
                yCoord = map(element.temp, tempMin, tempMax, graphStartY, 10);
                stroke(255);
                strokeWeight(3);
                point(xCoord, yCoord);
              }
            } // console.log('temperatureData.length :>> ', temperatureData.length);
            // for (let i = 0; i < temperatureData.length; i++) {
            //   const element = temperatureData[i];
            //   console.log('element.temp :>> ', element.temp);
            // }
            //
            // JSON.parse(temperatureData).forEach(element => {
            //   temperatureArray.push(element.temp);
            // });
            // console.log('temperatureArray :>> ', temperatureArray);

          }

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function requestData(requestAPI_URL) {
  var response, data;
  return regeneratorRuntime.async(function requestData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log('Requesting data from ' + requestAPI_URL);
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetch(requestAPI_URL));

        case 3:
          response = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          data = _context3.sent;
          console.log('data :>> ', data);
          return _context3.abrupt("return", data);

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
}