
document.getElementById('radius').oninput = function(){
    heatmap.set('radius', this.value);
};

document.getElementById('intensity').oninput = function(){
    heatmap.set('maxIntensity', this.value);
};


var map, heatmap;
var drawingManager;
var placeIdArray = [];
var polylines = [];
var snappedCoordinates = [];
var apiKey = "AIzaSyBnOBuIJmdMg8fXt3kD2VLhamWsdV1wmeAi"
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: 49.259725, lng: -123.217855},
    });
    
    loadHeatmap();

}
 
function showHeatmap() {
    heatmap.setMap(map);
}

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
    if(heatmap.get('radius') >= 10)
        heatmap.set('radius', 4);
    else
        heatmap.set('radius', heatmap.get('radius')+1);
}


function loadHeatmap() {
    
    var locationsArray = [];
    
    $.ajax({
        type: "GET",
        url: "https://nick-fung.github.io/data/test.json", 
        dataType: "json",
        success: function(data){
            // Only process 100 points at a time
            $.each(data.locations, function(index,location){
                var coordinate = new google.maps.LatLng(location.latitudeE7/10000000,location.longitudeE7/10000000);
                locationsArray.push(coordinate);
            });
            console.log("Done, " + locationsArray.length + " data points processed");
        },
        async: false
    }
    );
    
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: locationsArray,
        map: map,
        radius: 6,
        maxIntensity: 15
    });

    heatmap.setMap(map);
}

