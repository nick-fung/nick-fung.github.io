$(document).ready(function(){
    
/*   $.getJSON("https://nick-fung.github.io/data/test.json", function(data){
        $.each(data.locations, function(index,location){
            console.log(location);
        });
   });*/
});

var map, heatmap;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: 49.259725, lng: -123.217855},
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map
    });
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
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
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints() {
    var locationsArray = [];
    
/*     $.getJSON("https://nick-fung.github.io/data/test.json", function(data){ */
         $.each(locations, function(index,location){
            // console.log(location.latitudeE7/10000000);
            // console.log(location.longitudeE7/10000000);
             var location = new google.maps.LatLng(location.latitudeE7/10000000,location.longitudeE7/10000000);
             var type = typeof location.latitudeE7;
             console.log(type);
             if (index == 50)
                 return false;
             locationsArray.push(location);
         });
        // });
    /* }); */
    return locationsArray;
}
