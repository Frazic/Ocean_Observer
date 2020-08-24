let latestData = null;

function setup() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async position => {
      const api_url = '/platform';
      const response = await fetch(api_url);
      latestData = await response.json();
      console.log('latestData :>> ', latestData);
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