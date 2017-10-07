
/*
Currently this is all copied from Sampsa Kuronen's Snowplow map. See message at the bottom of the file.
We'll modify this to fetch data at <1s intervals. -Jukka
*/

const snowAPI = 'api'
const nextActionAPI = 'api/current'

var activePolylines = []
var activeMarkers = []
var map = null

function initializeGoogleMaps(callback, hours) {
  const helsinkiCenter = new google.maps.LatLng(60.224009, 25.143760)

  const mapOptions = {
    center: helsinkiCenter,
    zoom: 13,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
  }

  const styles = [{
    stylers: [
      { invert_lightness: true },
      { hue: '#ffcc00' },
      { lightness: 10 },
      { gamma: 1.0 },
      { saturation: 60 }
    ]
  }, {
    elementType: 'labels.text.stroke',
    stylers: [
        { color: '#242f3e' }
    ]
  }, {
    elementType: 'labels.text.fill',
    stylers: [
        { color: '#a98a2b' }
    ]
  }, {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#f1aa47'}]
  }, {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{color: '#f1aa47'}]
  }, {
    featureType: 'road.arterial',
    stylers: [
      { color: '#f1aa47' },
      { weight: 0.1 }
    ]
  }, {
    elementType: 'labels',
    stylers: [ {visibility: 'off'} ]
  }, {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      { visibility: 'off' },
      { color: '#f98a2b' }
    ]
  }, {
    featureType: 'administrative.locality',
    stylers: [ {visibility: 'on'} ]
  }, {
    featureType: 'administrative.neighborhood',
    stylers: [ {visibility: 'on'} ]
  }, {
    featureType: 'administrative.land_parcel',
    stylers: [ {visibility: 'on'} ]
  }]

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)
  map.setOptions({styles})

  callback(hours)
}

function getPlowJobColor(job) {
  switch (job) {
    case 'kv': return '#84ff00'
    case 'au': return '#f2412e'
    case 'su': return '#d93425'
    case 'hi': return '#ffffff'
    case 'hn': return '#00a59b'
    case 'hs': return '#910202'
    case 'ps': return '#97aaff'
    case 'pe': return '#132bbe'
    default: return '#6c00ff'
  }
}

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
   };
}


function addMapLine(plowData, plowJobId) {
  const plowTrailColor = getPlowJobColor(plowJobId)
  let latLng = null;
  const polylinePath = _.reduce(
    plowData,
    function(accu, x) {
      latLng = new google.maps.LatLng(x.coords[1], x.coords[0]);
      accu.push(latLng)
      return accu
    },
    [])
  const polyline = new google.maps.Polyline({
    path: polylinePath,
    geodesic: true,
    strokeColor: plowTrailColor,
    strokeWeight: 3,
    strokeOpacity: 0.8
  })
  activePolylines.push(polyline)
  polyline.setMap(map)
  const marker = new google.maps.Marker({
          position: latLng,
          title: '#' + plowJobId,
          icon: pinSymbol(plowTrailColor),
          map: map
        });
  activeMarkers.push(marker);
}


function createNewPolyline(latLng, color, weight) {
    const myPolyline = new google.maps.Polyline({
      path: [latLng],
      geodesic: true,
      strokeColor: color,
      strokeWeight: 3,
      strokeOpacity: 0.8
    });
    activePolylines.push(myPolyline);
    myPolyline.setMap(map);
}


function addToExistingMapLine(plowData) {
  const latLng = new google.maps.LatLng(plowData.coords[1], plowData.coords[0]);
  const eventType = (plowData.plow_down == True) ? plowData.events[0] : 'ps';
  const plowTrailWeight = (eventType === 'ps') ? 1 : 4;
  const plowTrailColor = getPlowJobColor(eventType);
  myPolyline = activePolylines[activePolylines.length - 1]
  if (activePolylines.length == 1) {
    createNewPolyline(latLng, plowTrailColor, plowTrailWeight);
  } else if (myPolyline.strokeColor !== plowTrailColor) {
    // continue previous polyline until this point
    const path = myPolyline.getPath();
    path.push(latLng);
    // then start a new one
    createNewPolyline(latLng, plowTrailColor, plowTrailWeight);
    const myMarker = activeMarkers[0];
    myMarker.setPosition(latLng);
    myMarker.setIcon(pinSymbol(plowTrailColor));
  } else {
    const myMarker = activeMarkers[0];
    const path = myPolyline.getPath();
    myMarker.setPosition(latLng);
    path.push(latLng);
  }
}


function clearMap() {
  _.each(activePolylines, polyline=> polyline.setMap(null))
}

function displayNotification(notificationText) {
  const $notification = $('#notification')
  $notification.empty()
    .text(notificationText)
    .slideDown(800)
    .delay(5000)
    .slideUp(800)
}

function getNextAction() {
  $.getJSON(nextActionAPI)
    .done(function(json) {
      if (json.length !== 0) {
          addToExistingMapLine(json);
      }
    })
    .fail(error=> console.error(`Failed to fetch active snowplows: ${JSON.stringify(error)}`))
}

function startTimedCalls() {
  setInterval(getNextAction, 100);
}

function getActivePlows(callback) {
  $.getJSON(snowAPI)
    .done(function(json) {
      if (json.length !== 0) {
        callback(json.location_history);
        startTimedCalls();
      } else {
        displayNotification('Ei näytettävää valitulla ajalla')
      }
    })
    .fail(error=> console.error(`Failed to fetch active snowplows: ${JSON.stringify(error)}`))
}


function populateMap(hours) {
  clearMap();
  getActivePlows(historyData => addMapLine(historyData, historyData[0].events[0]));
}


$(document).ready(function() {
  function clearUI() {
    $('#notification').stop(true, false).slideUp(200);
  }

  if (localStorage['auratkartalla.userHasClosedInfo']) { $('#info').addClass('off') }

  initializeGoogleMaps(populateMap);

  $('#info-close, #info-button').on('click', function(e) {
    e.preventDefault()
    $('#info').toggleClass('off')
    localStorage['auratkartalla.userHasClosedInfo'] = true
  })
  $('#visualization-close, #visualization-button').on('click', function(e) {
    e.preventDefault()
    $('#visualization').toggleClass('on')
  })
})
