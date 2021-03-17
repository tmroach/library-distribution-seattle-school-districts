// 1. Create a map object.
var mymap = L.map('map', {
    center: [47.60472496694009, -122.33472463103593],
    zoom: 4,
    maxZoom: 15,
    minZoom: 12,
    detectRetina: true // detect whether the sceen is high resolution or not.
});

// 2. Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// Add elementary school boundary data
// CRS value needed to be set to default since it was previously an unknown CRS value
var elementarySchoolBoundaries = null;

elementarySchoolBoundaries = L.geoJson.ajax("data/sps_ES_boundaries_2020_2021.geojson");

elementarySchoolBoundaries.addTo(mymap);

// Add library locations data

var washingtonLibraryLocations = null

washingtonLibraryLocations = L.geoJson.ajax("data/Washington_Library_Locations.geojson");

//washingtonLibraryLocations.addTo(mymap);

// append icon

washingtonLibraryLocations = L.geoJson.ajax("data/Washington_Library_Locations.geojson", {
    pointToLayer: function (feature, latlng) {

        // designate airports with air traffic control as a broadcast tower icon
        return L.marker(latlng, {icon: L.divIcon({className: 'fas fa-book' })});
    },
    attribution: 'Airport Data &copy; data.gov | US States &copy; Mike Bostock of D3 | Base Map &copy; CartoDB | Made By Tim Roach'

}).addTo(mymap);


// 9. Create Leaflet Control Object for Legend
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
    div.innerHTML += '<hr><b>Company<b><br />';
    div.innerHTML += '<i class="fas fa-broadcast-tower"></i><p> Has Air Traffic Control </p>';
    div.innerHTML += '<i class="fas fa-plane"></i><p> No Air Traffic Control </p>';

    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to map
legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
