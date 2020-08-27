let latestData = null;

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

function draw() {

}

async function getLatestData() {
  const api_url = '/dataLatest';
  console.log('Requesting data !');
  const response = await fetch(api_url);
  latestData = await response.json();
  console.log('latestData :>> ', latestData);
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

async function show60DayTemperature() {
  let temperatureData = null;
  while (temperatureData == null) {
    temperatureData = await requestData('/dataFullTempDate');
  }
  console.log('temperatureData :>> ', temperatureData);
  if (temperatureData != null) {
    clear();
    background(75);

    let valueCount = Object.keys(temperatureData).length;
    // console.log('valueCount :>> ', valueCount);

    let tempMin = 17;
    let tempMax = 24;

    // TITLE
    fill(255);
    noStroke();
    textSize(20);
    text('Dieppe sea temperature over last 60 days (°C)', 40, 30);

    // AXIS
    let graphStartX = 30;
    let graphStartY = height * .8;
    // Y axis
    stroke(255);
    strokeWeight(2);
    line(graphStartX, graphStartY, graphStartX, 60);

    textSize(15);
    noStroke();
    text(tempMin, graphStartX - 20, graphStartY);
    text(tempMax, graphStartX - 20, 70);

    // X axis
    stroke(255);
    strokeWeight(2);
    line(graphStartX, graphStartY, width - 10, graphStartY);

    textSize(15);
    noStroke();
    text(temperatureData[0].date, graphStartX, graphStartY + 20);
    text(temperatureData[valueCount - 1].date, width - 80, graphStartY + 20);

    for (const key in temperatureData) {
      if (temperatureData.hasOwnProperty(key)) {
        const element = temperatureData[key];
        // console.log('element.temp :>> ', element.temp);

        // TEMPERATURE POINTS
        let xCoord = map(key, 0, valueCount, graphStartX + 10, width - 30);
        let yCoord = map(element.temp, tempMin, tempMax, graphStartY, 10);

        stroke(255);
        strokeWeight(3);
        point(xCoord, yCoord);
      }
    }

    // console.log('temperatureData.length :>> ', temperatureData.length);
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
}

async function requestData(requestAPI_URL) {
  console.log('Requesting data from ' + requestAPI_URL);
  const response = await fetch(requestAPI_URL);
  let data = await response.json();
  console.log('data :>> ', data);
  return data;
}