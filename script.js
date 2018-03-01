// video tutorial https://youtu.be/fDfkjx-VhLI
// js and Leaflet stuff

/*global onMapClick*/
/*global L*/
/*global $*/

var map = L.map('map', {
    center: [41.488509, -71.315153],
    zoom: 15
});

// this is the map
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18
}).addTo(map);

// add markers
// green marker for hotels
var greenMarker = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// red marker for Newport Crosswalk Safety Survey (2014) dataset
// source https://github.com/NewportDataPortal/newport-crosswalk-survey-2014
var redMarker = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});




// add some data
// nice leaflet-ajax plugin
// https://github.com/calvinmetcalf/leaflet-ajax
var items = [];

function newportHotels(feature, layer){
    layer.bindPopup("<strong>" + feature.properties.name + "</strong><br/>" +
                    feature.properties.street + "<br/>" +
                    feature.properties.city + ", " +
                    feature.properties.state
                    );
    layer.setIcon(greenMarker);
    layer.on('mouseover', function (e) {
        this.openPopup();
    });
    layer.on('mouseout', function (e) {
        this.closePopup();
    });
}

var hotelsLayer = L.geoJson.ajax('data/newport_hotels.geojson', {
  onEachFeature: newportHotels
}).addTo(map);


// Newport Crosswalk Safety Survey (2014) 
// https://github.com/NewportDataPortal/newport-crosswalk-survey-2014
function bpacSurvey2014(feature, layer){
    layer.bindPopup("<table id='crosswalkSurvey'>" +
                        "<tr>" +
                            "<th colspan='2'>" +
                                "<a href=https://github.com/NewportDataPortal/newport-crosswalk-survey-2014 target='_blank'>" +
                                    "Newport Crosswalk Safety Survey (2014)" + 
                                "</a>" + 
                            "</th>" +
                        "</tr>" +
                        "<tr>" +
                            "<td>ID</td>" +
                            "<td>" + feature.properties.id + "</td>" + 
                        "</tr>" +
                        "<tr>" +
                            "<td>Safe</td>" +
                            "<td>" + feature.properties.Safe + "</td>" + 
                        "</tr>" +
                        "<tr>" +
                            "<td>Unsafe</td>" +
                            "<td>" + feature.properties.Unsafe + "</td>" + 
                        "</tr>" +
                        "<tr>" +
                            "<td>I don't know</td>" +
                            "<td>" + feature.properties.Idontknow + "</td>" + 
                        "</tr>" +
                        "<tr>" +
                            "<td>Score</td>" +
                            "<td>" + feature.properties.score + "</td>" + 
                        "</tr>" +
                        "<tr>" +
                            "<td>n</td>" +
                            "<td>" + feature.properties.n + "</td>" + 
                        "</tr>" +
                        "<tr>" +
                            "<td>Size</td>" +
                            "<td>" + feature.properties.size + "</td>" + 
                        "</tr>" +
                    "</table>"
                    );
    layer.setIcon(redMarker);
    layer.on('mouseover', function (e) {
        this.openPopup();
    });
    layer.on('mouseout', function (e) {
        this.closePopup();
    });
}

var crosswalksLayer = L.geoJson.ajax('data/bpac_survey_2014.geojson', {
  onEachFeature: bpacSurvey2014
}).addTo(map);


// add sidewalks layer
// npt-sidewalks.geojson is a map of sidewalks in Newport
var sidewalks = [];

var sidewalksLayer = L.geoJson.ajax('data/npt-sidewalks.geojson', {
  onEachFeature: function(data, layer) {
    sidewalks.push(layer);
  }
}).addTo(map);

$(document).ready(function (e) {
    $("#sidewalksButton").click(function(){
        if(map.hasLayer(sidewalksLayer)){
            map.removeLayer(sidewalksLayer);
        } else {
            map.addLayer(sidewalksLayer);
        }
    });
    
    $("#crosswalksButton").click(function(){
        if(map.hasLayer(crosswalksLayer)){
            map.removeLayer(crosswalksLayer);
        } else {
            map.addLayer(crosswalksLayer);
        }
    });
    
    $("#hotelsButton").click(function(){
        if(map.hasLayer(hotelsLayer)){
            map.removeLayer(hotelsLayer);
        } else {
            map.addLayer(hotelsLayer);
        }
    });
        
    $("#GPSTraceButton").click(function(){
        if(map.hasLayer(GPSTraceLayer)){
            map.removeLayer(GPSTraceLayer);
        } else {
            map.addLayer(GPSTraceLayer);
        }
    });
    e.preventDefault();
})

// commented out because this function is annoying, but useful
// map.on('click', onMapClick);

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent(e.latlng.toString())
//         .openOn(map);
// }

var legend = L.control({position: 'bottomright'});
legend.onAdd = function(icon, legend){
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += "<div>";
    div.innerHTML += "<table class='coolTable' id='legend'>" +
                        "<tr>" +
                            "<th colspan='2' style='font-size:200%'>" +
                                "Turn layers on/off" + 
                            "</th>" +
                        "</tr>" +
                        "<tr onclick='hotelsButton.click()'>" +
                            "<td>&nbsp;<img src='images/marker-icon-green.png' alt='Green marker icon' height='22' width='16'/></td>" + 
                            "<td id='hotelsButton'>Hotels</td>" +
                        "</tr>" +
                        "<tr onclick='crosswalksButton.click()'>" +
                            "<td>&nbsp;<img src='images/marker-icon-red.png'/ alt='Red marker icon' height='22' width='16'></td>" +
                            "<td id='crosswalksButton'>Crosswalks&nbsp;</td>" +
                        "</tr>" +
                        "<tr id='sidewalksButton' onclick='sidewalksButton.click()'>" +
                            "<td id='tinyText'>&nbsp;Blue<br/>&nbsp;lines&nbsp;&nbsp;</td>" +
                            "<td>Sidewalks</td>" + 
                        "</tr>" +
                        "<tr onclick='GPSTraceButton.click()'>" +
                            "<td>&nbsp;<img src='images/marker-icon-black.png'/ alt='Black marker icon' height='22' width='16'></td>" +
                            "<td id='GPSTraceButton'>GPS Trace&nbsp;</td>" +
                        "</tr>" +
                    "</table>"
    div.innerHTML += "</div>";
    
    return div;
    };
legend.addTo(map);


// added Sample GPS Trace 2018-02-28

var blackMarker = new L.Icon({
  iconUrl: 'images/dot.png',
  iconSize: [72,72]
});

// black marker for Sample GPS Trace
// var blackMarker = new L.Icon({
//   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

function sampleGPSTrace(feature, layer){
    layer.setIcon(blackMarker);
}

var GPSTraceLayer = L.geoJson.ajax('data/sampleGPSTrace.geojson', {
  onEachFeature: sampleGPSTrace
}).addTo(map);


