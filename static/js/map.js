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
var mapObjList = []
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
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
    });

    var manual = function() {
        clearInterval(refreshHandler);
        loadMostRecent();
    }

    var auto = function() {
        refreshHandler = setInterval(loadMostRecent, 5000)
    }
    var zoomIn = function(){
        map.setZoom(map.getZoom() + 1);
    }
    var zoomOut = function(){
        map.setZoom(map.getZoom() - 1);
    }
    
    var zoomInButtonDiv= document.createElement('div');
    var zoomInControl = new ZoomControl(zoomInButtonDiv, map, "+", zoomIn);
    zoomInButtonDiv.index = 3;
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(zoomInButtonDiv);

    var zoomOutButtonDiv= document.createElement('div');
    var zoomOutControl = new ZoomControl(zoomOutButtonDiv, map, "-", zoomOut);
    zoomOutButtonDiv.index = 4;
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(zoomOutButtonDiv);

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
    //console.log("Refreshing");
    var query = firebase.database().ref('/users');
    query.once("value").then(function(snapshot) {
        // Iterate through users
        users = snapshot.val();
        for (var user in users){
            mostRecentData = users[user]['mostRecent'];
            // Handles the case where a new user is added
            if (!(user in mapObjList)){
                circle = createCircle(mostRecentData['lat'], mostRecentData['lng'], 1.4*(Date.now()/1000-40-mostRecentData['timestamp']));
                marker = createMarker(mostRecentData['lat'], mostRecentData['lng']);
                contentString = '<div id="content">'+
                    '<div id="siteNotice">'+
                    '</div>'+
                    '<h1 id="firstHeading" class="firstHeading">'+users[user]['name']+'</h1>'+
                    '<div id="bodyContent">'+
                    '<ul><li>Age: '+ users[user]['age'] +'</li></ul>'+
                    '<ul><li>Weight: '+ users[user]['age'] +'</li></ul>'+
                    '<ul><li>Height: '+ users[user]['height'] +'</li></ul>'+
                    '<ul><li>Medical Conditions: '+ users[user]['medicalConditions'] +'</li></ul>'+
                    '</div>';
                infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
                circle.setMap(map);
                marker.setMap(map);
                mapObjList[user]={"circle": circle, "marker": marker};
            }
            else{
                mapObjList[user]["marker"].setPosition(new google.maps.LatLng(mostRecentData['lat'], mostRecentData['lng']));
                mapObjList[user]["circle"].setCenter(new google.maps.LatLng(mostRecentData['lat'], mostRecentData['lng']));
                mapObjList[user]["circle"].setRadius(1.4*(Date.now()/1000-40-mostRecentData['timestamp']));

                if(mostRecentData["distress"]){
                    if(!("distress" in mapObjList[user])){
                        
                        mapObjList[user].distress = distressSignal(mapObjList[user].circle);
                    }
                    else{
                        mapObjList[user].distress.setVisible(true);
                    }
                }
                else{
                    if("distress" in mapObjList[user]){
                        mapObjList[user].distress.setVisible(false);
                    }
                }
            }

            for (obj in mapObjList){
                mapObjList[obj]["circle"].setMap(map);
                mapObjList[obj]["marker"].setMap(map);
            }
        }
    });
}

function ManualRefresh(controlDiv, map, name, fun) 
{
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '22px';
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

    controlUI.addEventListener('click', fun);

}

function ZoomControl(controlDiv, map, name, fun) 
{
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '10px';
    controlUI.style.marginBottom = '10px';
    controlUI.style.marginLeft = '30px';
    controlUI.style.width = '50px';
    controlUI.style.height = '50px';
    controlUI.style.textAlign = 'center';
    controlUI.style.padding = '5px 5px';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '50px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = name;
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', fun);

}

function createCircle(latitude, longitude, rad){
    circle = new google.maps.Circle({
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity: 0,
        map: map,
        center: {lat: latitude, lng: longitude} ,
        radius: rad,
    });
    return circle;

}

function createMarker(latitude, longitude){
    return new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        map: map,
    });
}

function distressSignal(baseCircle){
    var direction = 1;
    var distressCirc = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: {lat: baseCircle.getCenter().lat(), lng: baseCircle.getCenter().lng()} ,
        radius: 1
    });
    setInterval(function() {
        var rMax = baseCircle.getRadius();
        var radius = distressCirc.getRadius();
        if (radius >= rMax){
            console.log("resetting circle");
            radius = 1;
        }
        distressCirc.setRadius(radius+1);
        distressCirc.setCenter(baseCircle.getCenter());
        console.log(radius);
    }, 500);
    return distressCirc;
}


init();
