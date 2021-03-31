var earthquake_json="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// var API_KEY="pk.eyJ1IjoibnQxOTgzIiwiYSI6ImNrbWh6ZjRlMzBjOHUyb3RuZWNoaWk3YmgifQ.ZgFls354gv7BM5FiIZje_Q"
function markersize(magnitude) {
    if (magnitude ==0) {return 1; }
    else {return magnitude*4;}
}

// Create the satellite layer that will be the background of our map
var initLayer= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

// Create the map object with options
var mymap = L.map("mapid", {
    center: [51.505, -0.09],
    zoom: 5
});

initLayer.addTo(mymap);
    
function chagecolor (magnitude) {
    switch (magnitude) {
      case magnitude > 5:
        return "red";
      case magnitude > 4:
        return "redorange";
      case magnitude > 3:
        return "orange";
      case magnitude > 2:
        return "yellow";
      case magnitude > 1:
         return "green";
    }
} 
//create style of circle marker
function style(feature) 
{
  return {
    opacity: 1,
    fillOpacity: 0.75,
    fillColor: chagecolor(feature.properties.mag),
    color: "#000000",
    radius: markersize(feature.properties.mag),
    stroke: true,
    weight: 0.5
  }
};

//Creating layer groups for control chekcboxes
var quakeLayer = new L.LayerGroup() ;
var plateLayer = new L.LayerGroup() ;

d3.json(earthquake_json).then(function (data) {
    console.log(data);
    L.geoJson(data, {
        pointToLayer: function(feature,latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {

        }
    })

    }).addTo(quakeLayer);