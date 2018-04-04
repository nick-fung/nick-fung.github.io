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
var markers = [];
var circles = [];
var ubc = {lat: 49.262427, lng: -123.247748};
var refreshHandler;

// Initializes the map
function init(){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        // Centered on Pacific Spirit Park
        center: ubc,
        styles: [ {
            featureType: 'transit.station',
            stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
        }],
        //disableDoubleClickZoom: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        mapTypeControl: false,
        //scaleControl: boolean,
        streetViewControl: false,
    });
    var panControl = document.createElement( 'div' );

    panControl.className = 'panControls';
    var directions = ['North', 'West', 'East', 'South'];
    var pan = [];
    directions.forEach( function( item ) {
        pan[item] = document.createElement( 'div' );
        pan[item].className = 'panControl ' + item;
        pan[item].innerHTML = '<img src="static/js/pan_arrow.png" />';
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

    var manual = function() {
        window.clearInterval(refreshHandler);
        loadMostRecent();
    }

    var auto = function() {
        refreshHandler = setInterval(loadMostRecent, 5000)
    }

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var manualRefreshDiv = document.createElement('div');
    var manualRefresh = new ManualRefresh(manualRefreshDiv, map, "Manual Refresh Positions", manual);
    manualRefreshDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(manualRefreshDiv);
    
    var manualRefreshDiv2 = document.createElement('div');
    var manualRefresh2 = new ManualRefresh(manualRefreshDiv2, map, "Auto Refresh", auto);
    manualRefreshDiv2.index = 2;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(manualRefreshDiv2);

    // Auto refreshes
    loadMostRecent();
    refreshHandler = setInterval(loadMostRecent, 5000)
}

// Assuming the user is the park ranger, loads the most recent locations of each user
function loadMostRecent(){
    console.log("Refreshing");
    var query = firebase.database().ref('/users');
    query.once("value").then(function(snapshot) {
        // Clears all markers
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
            delete markers[i];
            circles[i].setMap(null);
            delete circles[i];
        }
        markers=[];
        circles=[];
        // Iterate through users
        users = snapshot.val();
        for (var user in users){
            mostRecentData = users[user]['mostRecent'];
            circles.push(new google.maps.Circle({
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillOpacity: 0,
                map: map,
                center: {lat: mostRecentData['lat'], lng: mostRecentData['lng']},
                radius: 1.4*(Date.now()/1000-40-mostRecentData['timestamp'])
            }))
            marker = new google.maps.Marker({
                position: {lat: mostRecentData['lat'], lng: mostRecentData['lng']},
                map: map,
            });

            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">'+user+'</h1>'
                // '<div id="bodyContent">'+
                // '<p></p>'+
                // '</div></div>'
                ;

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

            markers.push(marker);

        }
        
        
        // Sets new markers on map
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            circles[i].setMap(map);
        }
    });
}

function ManualRefresh(controlDiv, map, name, fun) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginLeft = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to refresh hiker positions';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = name;
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', fun);

}
init();
