var map;
var config = {
    apiKey: "AIzaSyB_KeEg1eCfFtR8nAP_JPi05AqLPOaCCgE",
    authDomain: "happy-hiker-5b3be.firebaseapp.com",
    databaseURL: "https://happy-hiker-5b3be.firebaseio.com",
    storageBucket: "happy-hiker-5b3be.appspot.com"
};
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();
var lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 4
};

function init(){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        // Centered on Pacific Spirit Park
        center: {lat: 49.262427, lng: -123.247748},
        styles: [ {
            featureType: 'transit.station',
            stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
        }],
        //disableDoubleClickZoom: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
    });
    loadRecentLocations();
    var panControl = document.createElement( 'div' );

    panControl.className = 'panControls';
    var directions = ['North', 'West', 'East', 'South'];
    var pan = [];
    directions.forEach( function( item ) {
        pan[item] = document.createElement( 'div' );
        pan[item].className = 'panControl ' + item;
        pan[item].innerHTML = '<img src="/static/js/pan_arrow.png" />';
        panControl.appendChild( pan[item] );
    } );

    var panAmount = 120;
    pan['North'].addEventListener( 'click', function( ) {
        map.panBy( 0, -panAmount );
    } );
    pan['West'].addEventListener( 'click', function( ) {
        map.panBy( -panAmount, 0 );
    } );
    pan['East'].addEventListener( 'click', function( ) {
        map.panBy( panAmount, 0 );
    } );
    pan['South'].addEventListener( 'click', function( ) {
        map.panBy( 0, panAmount );
    } );

    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push( panControl );

}


function loadRecentLocations(){
    var query = firebase.database().ref('/locations');
    //query.once("value").then(function(snapshot) {
    query.on("value", function(snapshot) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
            circles[i].setMap(null);
        }
        markers=[];
        circles=[];
        // Iterate through users
        users = snapshot.val();
        for (var user in users){
            mostRecentData = users[user]['mostRecent'];
            console.log("TIME: ", Date.now()/1000-mostRecentData['timestamp']);
            console.log("RADIUS IN METERS: ", 1.4*(Date.now()/1000-mostRecentData['timestamp']));
            var circle = new google.maps.Circle({
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillOpacity: 0,
                map: map,
                center: {lat: mostRecentData['lat'], lng: mostRecentData['lng']},
                radius: 1.4*(Date.now()/1000-40-mostRecentData['timestamp'])
            });
            var marker = new google.maps.Marker({
                position: {lat: mostRecentData['lat'], lng: mostRecentData['lng']},
                map: map,
                label: {
                    x: '-50',
                    y: '-50',
                    text: user
                },
            });
            markers.push(marker);
            circles.push(circle);

        }
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            circles[i].setMap(map);
        }
    });
}
var markers = [];
var circles = [];
init();
