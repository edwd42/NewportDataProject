// js and Leaflet video tutorial https://youtu.be/fDfkjx-VhLI

let map = L.map("map", {
  center: [41.488509, -71.315153],
  zoom: 15
});

// this is the map
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 18
}).addTo(map);

// add markers
// green marker for hotels
let greenMarker = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// red marker for Newport Crosswalk Safety Survey (2014) dataset
// source https://github.com/NewportDataPortal/newport-crosswalk-survey-2014
let redMarker = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// add some data
// nice leaflet-ajax plugin
// https://github.com/calvinmetcalf/leaflet-ajax
let items = [];

function newportHotels(feature, layer) {
  layer.bindPopup(
    "<strong>" +
      feature.properties.name +
      "</strong><br/>" +
      feature.properties.street +
      "<br/>" +
      feature.properties.city +
      ", " +
      feature.properties.state
  );
  layer.setIcon(greenMarker);
  layer.on("mouseover", function(e) {
    this.openPopup();
  });
  layer.on("mouseout", function(e) {
    this.closePopup();
  });
}

let hotelsLayer = L.geoJson
  .ajax("data/newport_hotels.geojson", {
    onEachFeature: newportHotels
  })
  .addTo(map);

// Newport Crosswalk Safety Survey (2014)
// https://github.com/NewportDataPortal/newport-crosswalk-survey-2014
function bpacSurvey2014(feature, layer) {
  layer.bindPopup(
    "<table id='crosswalkSurvey'>" +
      "<tr>" +
      "<th colspan='2'>" +
      "<a href=https://github.com/NewportDataPortal/newport-crosswalk-survey-2014 target='_blank'>" +
      "Newport Crosswalk Safety Survey (2014)" +
      "</a>" +
      "</th>" +
      "</tr>" +
      "<tr>" +
      "<td>ID</td>" +
      "<td>" +
      feature.properties.id +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Safe</td>" +
      "<td>" +
      feature.properties.Safe +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Unsafe</td>" +
      "<td>" +
      feature.properties.Unsafe +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>I don't know</td>" +
      "<td>" +
      feature.properties.Idontknow +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Score</td>" +
      "<td>" +
      feature.properties.score +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>n</td>" +
      "<td>" +
      feature.properties.n +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Size</td>" +
      "<td>" +
      feature.properties.size +
      "</td>" +
      "</tr>" +
      "</table>"
  );
  layer.setIcon(redMarker);
  layer.on("mouseover", function(e) {
    this.openPopup();
  });
  layer.on("mouseout", function(e) {
    this.closePopup();
  });
}

let crosswalksLayer = L.geoJson
  .ajax("data/bpac_survey_2014.geojson", {
    onEachFeature: bpacSurvey2014
  })
  .addTo(map);

// add sidewalks layer
// npt-sidewalks.geojson is a map of sidewalks in Newport
let sidewalks = [];

let sidewalksLayer = L.geoJson
  .ajax("data/npt-sidewalks.geojson", {
    onEachFeature: function(data, layer) {
      sidewalks.push(layer);
    }
  })
  .addTo(map);

$(document).ready(function(e) {
  $("#sidewalksButton").click(function() {
    if (map.hasLayer(sidewalksLayer)) {
      map.removeLayer(sidewalksLayer);
    } else {
      map.addLayer(sidewalksLayer);
    }
  });

  $("#crosswalksButton").click(function() {
    if (map.hasLayer(crosswalksLayer)) {
      map.removeLayer(crosswalksLayer);
    } else {
      map.addLayer(crosswalksLayer);
    }
  });

  $("#hotelsButton").click(function() {
    if (map.hasLayer(hotelsLayer)) {
      map.removeLayer(hotelsLayer);
    } else {
      map.addLayer(hotelsLayer);
    }
  });

  $("#GPSTraceButton").click(function() {
    if (map.hasLayer(GPSTraceLayer)) {
      map.removeLayer(GPSTraceLayer);
    } else {
      map.addLayer(GPSTraceLayer);
    }
  });
  e.preventDefault();
});

let legend = L.control({ position: "bottomright" });
legend.onAdd = function(icon, legend) {
  let div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<div>";
  div.innerHTML +=
    "<table class='coolTable' id='legend'>" +
    "<tr>" +
    "<th colspan='2' style='font-size:200%'>" +
    "Turn layers on/off" +
    "</th>" +
    "</tr>" +
    "<tr id='hotels' onclick='hotelsButton.click()'>" +
    "<td>&nbsp;<img src='images/marker-icon-green.png' alt='Green marker icon' height='22' width='16' title='Click location icons to turn layers on/off'></td>" +
    "<td>Hotels</td>" +
    "</tr>" +
    "<tr id='crosswalks' onclick='crosswalksButton.click()'>" +
    "<td>&nbsp;<img src='images/marker-icon-red.png' alt='Red marker icon' height='22' width='16' title='Click location icons to turn layers on/off'></td>" +
    "<td>Crosswalks</td>" +
    "</tr>" +
    "<tr id='sidewalks' onclick='sidewalksButton.click()'>" +
    "<td id='tinyText' title='Click to turn sidewalks on/off'>&nbsp;Blue<br/>&nbsp;lines&nbsp;&nbsp;</td>" +
    "<td >Sidewalks</td>" +
    "</tr>" +
    "<tr id='GPSTrace' onclick='GPSTraceButton.click()'>" +
    "<td>&nbsp;<img src='images/marker-icon-black.png' alt='Black marker icon' height='22' width='16' title='Click location icons to turn layers on/off'></td>" +
    "<td>GPS&nbsp;Trace</td>" +
    "</tr>" +
    "</table>";
  div.innerHTML += "</div>";

  return div;
};
legend.addTo(map);

// added Sample GPS Trace 2018-02-28

let blackMarker = new L.Icon({
  iconUrl: "images/dot.png",
  iconSize: [72, 72]
});

// black marker for Sample GPS Trace
// let blackMarker = new L.Icon({
//   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

function sampleGPSTrace(feature, layer) {
  layer.setIcon(blackMarker);
}

let GPSTraceLayer = L.geoJson
  .ajax("data/sampleGPSTrace.geojson", {
    onEachFeature: sampleGPSTrace
  })
  .addTo(map);
