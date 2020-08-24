"use strict";

var latestData = null;

function setup() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function _callee(position) {
      var api_url, response;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              api_url = '/platform';
              _context.next = 3;
              return regeneratorRuntime.awrap(fetch(api_url));

            case 3:
              response = _context.sent;
              _context.next = 6;
              return regeneratorRuntime.awrap(response.json());

            case 6:
              latestData = _context.sent;
              console.log('latestData :>> ', latestData);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      });
    });
  } else {
    throw 'Geolocation not available';
  }

  createCanvas(500, 500);
  background(0);
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


function draw() {
  if (latestData != null) {
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