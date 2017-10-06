
/*
Currently this is all copied from Sampsa Kuronen's Snowplow map. See message at the bottom of the file.
We'll modify this to fetch data at <1s intervals. -Jukka
*/

// const snowAPI = '/data/94694.json' // not real input data, this is just dummy.
const snowAPI = 'api'

var activePolylines = []
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
      { visibility: 'on' },
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
    case 'ps': return '#970899'
    case 'pe': return '#132bbe'
    default: return '#6c00ff'
  }
}

function addMapLine(plowData, plowJobId) {
  const plowTrailColor = getPlowJobColor(plowJobId)
  console.log(plowData, plowJobId);
  const polylinePath = _.reduce(
    plowData,
    function(accu, x) {
      accu.push(new google.maps.LatLng(x.coords[1], x.coords[0]))
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
  console.log(polyline);
  activePolylines.push(polyline)
  polyline.setMap(map)
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

function getActivePlows(callback) {
  $('#load-spinner').fadeIn(400)
  $.getJSON(snowAPI)
    .done(function(json) {
      if (json.length !== 0) {
        console.log(json);
        callback(json.location_history)
      } else {
        displayNotification('Ei näytettävää valitulla ajalla')
      }
      $('#load-spinner').fadeOut(800)
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
    $('#load-spinner').stop(true, false).fadeOut(200);
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
