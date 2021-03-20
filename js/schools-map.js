// 1. Create a map object.

var southWest = L.latLng(47.02794637495586, -123.22803182976699)
var northEast = L.latLng(48.04321598998574, -121.36398741251594)
var bounds = L.latLngBounds(southWest, northEast);

var mymap = L.map('map', {
    center: [47.60472496694009, -122.33472463103593],
    zoom: 12,
    maxBounds: bounds,
    maxZoom: 15,
    minZoom: 11,
    detectRetina: true // detect whether the sceen is high resolution or not.
});

// 2. Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// Add elementary school boundary data
// CRS value needed to be set to default since it was previously an unknown CRS value



function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#34ebc0',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    elementarySchoolBoundaries.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}





// Add library locations data
var washingtonLibraryLocations = null;

// append icon
washingtonLibraryLocations = L.geoJson.ajax("data/Washington_Library_Locations_Cleaned.geojson", {
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>Library</b>: ' + feature.properties.Library + "</p>");
        //return feature.properties.name;
    },
    pointToLayer: function (feature, latlng) {

        // designate airports with air traffic control as a broadcast tower icon
        return L.marker(latlng, {icon: L.divIcon({className: 'fas fa-book marker'}, )});
    },
    attribution: 'Base Map &copy; CartoDB | Made By Tim Roach'
}).addTo(mymap);

// Add Seattle Community Center Location Data
var seattleCommunityCenters = null;

seattleCommunityCenters = L.geoJson.ajax("data/Seattle_Parks_and_Recreation__Community Center.geojson");

//seattleCommunityCenters.addTo(mymap);

seattleCommunityCenters = L.geoJson.ajax("data/Seattle_Parks_and_Recreation__Community Center.geojson", {
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<p><b>Name</b>: ' + feature.properties.name + '</p>');
        //return feature.properties.name;
    },
    pointToLayer: function (feature, latlng) {

        // designate airports with air traffic control as a broadcast tower icon
        return L.marker(latlng, {icon: L.divIcon({className: 'fas fa-school marker-color-'}, )});
    },
    attribution: 'Base Map &copy; CartoDB | Made By Tim Roach'
}).addTo(mymap);

var parkStyle = {
  "color": "#2a8241"
};

var parkBoundaries = L.geoJson.ajax("data/Park_Boundaries.geojson");


// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('Dark2').mode('lch').colors(13);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 13; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

function setColor(density) {
    var id = 0;
    if (density > 11) { id = 4; }
    else if (density > 5 && density <= 10) { id = 3; }
    else if (density > 3 && density <= 5) { id = 2; }
    else if (density > 0 &&  density <= 2) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

function style(feature) {
    return {
        fillColor: setColor(feature.properties.num_libraries),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

var elementarySchoolBoundaries = null;

elementarySchoolBoundaries = L.geoJson.ajax("data/sps_ES_boundaries_2020_2021.geojson", {
  style: style,
  onEachFeature: function (feature, layer) {
      layer.bindPopup('<p><b>School zone:</b> ' + feature.properties.ES_ZONE + "</p>");
      layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
      });
      //return feature.properties.name;
  },
}).addTo(mymap);

var legend = L.control({position: 'topright'});

// 10. Function that runs when legend is added to map

legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b># Airports per US State</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 150+ </p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 40-99 </p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 11-39 </p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 1-10 </p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0 </p>';
    div.innerHTML += '<hr><b>Community Resource<b><br />';
    div.innerHTML += '<i class="fas fa-book"></i><p> Library </p>';
    div.innerHTML += '<i class="fas fa-school"></i><p> School </p>';

    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to map
legend.addTo(mymap);


// 12. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);

var libraryLayer = L.layerGroup([washingtonLibraryLocations]);
var commCenterLayer = L.layerGroup([seattleCommunityCenters]);

var overlays = {
  "Libraries": libraryLayer,
  "Community Centers": commCenterLayer
};

//var baselayers = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

var parksLayer = L.tileLayer('tiles/seattle_parks_tiles_transparent/{z}/{x}/{y}.png', {
  attribution: 'Generated by Tim Roach | Park Locations',
  detectRetina: true
});



var grayscale = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png');
var streets = L.tileLayer('http://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}@2x.png');
var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}@2x');

var baseLayers = {
      'Grayscale': grayscale,
      'Streets': streets,
      'Satellite': satellite
};

var overlays = {
  "Seattle Parks": parksLayer
}

/*
L.control.layers(baseLayers, {
  collapsed: false,
  position: 'bottomright'
}).addTo(mymap);
*/

L.control.layers(baseLayers, overlays, {
  collapsed: false
  //position: 'topright'
}).addTo(mymap);
//var legend = L.control({position: 'bottomright'});



//legend.addTo(mymap);

//L.control.layers(baselayers, overlays).addTo(map);
