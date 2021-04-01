var earthquake_json="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var plate_json="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Create the satellite layer that will be the background of our map
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
});

    // Define light layer
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "mapbox/light-v10",
        accessToken: API_KEY
});

    // Deine outdoors layer 
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Greyscale": lightMap,
    "Satellite": satellite,
    "Outdoors": outdoors
};

// Initialize all of the LayerGroups we'll be using
var layers = {
    layer01: new L.LayerGroup(),
    layer2: new L.LayerGroup(),
    layer3: new L.LayerGroup(),
    layer4: new L.LayerGroup(),
    layer5: new L.LayerGroup(),
    layer5plus: new L.LayerGroup(),
    plates: new L.LayerGroup()
  };

// Create the map object with options
var mymap = L.map("mapid", {
    center: [39.876019, -117.224121],
  zoom: 5,
  layers: [
    layers.layer01,
    layers.layer2,
    layers.layer3,
    layers.layer4,
    layers.layer5,
    layers.layer5plus,
    layers.plates
  ]
});

satellite.addTo(mymap);

// Create an overlays object to add to the layer control
var overlays = {
    "-10-10": layers.layer01,
    "10-30": layers.layer2,
    "30-50": layers.layer3,
    "50-70": layers.layer4,
    "70-90": layers.layer5,
    "90+":layers.layer5plus,
    "Plates": layers.plates
  };

// Create a control for our layers, add our overlay layers to it
L.control.layers(baseMaps, overlays).addTo(mymap);

//Create Legend
var legend = L.control({ position: 'bottomright' });

// Insert a div with the class of "legend"
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<i style="background: green"></i><span>-10 - 10</span><br>';
    div.innerHTML += '<i style="background: greenyellow"></i><span>10 - 30</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>30 - 50</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>50 - 70</span><br>';
    div.innerHTML += '<i style="background: tomato"></i><span>70 - 90</span><br>';
    div.innerHTML += '<i style="background: red"></i><span>>90+</span><br>';  
    return div;
}
legend.addTo(mymap);

var colorlayer = {
    layer01: "green",
    layer2: "greenyellow",
    layer3: "yellow",
    layer4: "orange",
    layer5:"tomato",
    layer5plus:"red"
  };
  var layerselect="";
d3.json(earthquake_json, function(EarthquakeData) {
    DataArray = EarthquakeData.features;
    for (var i = 0; i < DataArray.length; i++) {
        var latitude =DataArray[i].geometry.coordinates[1];
        var longitude =DataArray[i].geometry.coordinates[0];
        var magnitude = DataArray[i].properties.mag;
        console.log(latitude, longitude, magnitude);
        
        if (magnitude > 5)
        {
            layerselect="layer5plus";
        }
        else if (magnitude > 4)
        {
            layerselect="layer5";
        }
        else if(magnitude > 3)
        {
            layerselect="layer4";
        }
        else if(magnitude > 2)
        {
            layerselect="layer3";
        }
        else if(magnitude >1)
        {
            layerselect="layer2";
        }
        else
        {
            layerselect="layer01";
        } 
        console.log(layerselect);
        
        var markersize = L.circleMarker([latitude, longitude],
            {radius: magnitude*7,
              fillOpacity: 1,
              fillColor: colorlayer[layerselect],
              color: "black",
              weight: 1});
        
        markersize.addTo(layers[layerselect]); 
        markersize.bindPopup("Place: " +DataArray[i].properties.place + "<br> Magnitude: " + magnitude +"<br>");
    
    };

});
// d3.json(plate_json, function (pdata){
//     var parray=pdata.features;
//     console.log(parray);
//     for (var i = 0; i < parray.length; i++) {

//         console.log(parray[i].geometry);
//         //var latitude =DataArray[i].geometry.coordinates[1];
//         //var longitude =DataArray[i].geometry.coordinates[0];
//         //var magnitude = DataArray[i].properties.mag;
//         //console.log(latitude, longitude, magnitude);
//     // L.geoJson(pdata, {
//     //    color:"yellow",
//     //    weight:3
//     // }).addTo(plates);
//     // plates.addTo(mymap);
// }
// });

