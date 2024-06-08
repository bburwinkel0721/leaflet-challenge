// Store our API endpoint as queryUrl.
let queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  // Pass the features to a createFeatures() function:
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Pass the earthquake data to a createMap() function.
  createMap(earthquakeData);
}

// createMap() takes the earthquake data and incorporates it into the visualization:
function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
  };

  // Create a color scale based on depth
  let getColor = (depth) => {
        if (depth > 90 ){
            return '#d73027' 
        } else if (depth > 70){
            return '#fc8d59'
        } else if (depth > 50){
            return '#fee08b'
        } else if (depth > 30){
            return '#d9ef8b'
        } else if (depth > 10){
            return '#91cf60'
        } else {
            return '#1a9850'
        }
        };

  // Create an overlays object.
  let markerArray = earthquakes.map((earthquake) => {
    let coordinates = earthquake.geometry.coordinates;
    let lat = coordinates[1];
    let lon = coordinates[0];
    let depth = coordinates[2];
    let mag = earthquake.properties.mag;
    let place = L.circle([lat, lon], {
      color: getColor(depth),
      fillColor: getColor(depth),
      stroke: false,
      fillOpacity: 0.5,
      radius: mag * 20000,
    });
    
    // Bind opup with earthquake infomation
    place.bindPopup(`
      <h3>${earthquake.properties.place}</h3>
      <hr>
      <p><strong>Magnitude:</strong> ${mag}</p>
      <p><strong>Depth:</strong> ${depth} km</p>
      <p><strong>Time:</strong> ${new Date(earthquake.properties.time)}</p>
    `);
    // Add a tooltip with a brief summary
    place.bindTooltip(`Magnitude: ${mag}, location: ${earthquake.properties.place}, Depth: ${depth} km`, {permanent: false});

    return place;
  });

  const markerLayer = L.layerGroup(markerArray);

  const overlayMaps = {
    'Earthquakes': markerLayer,
  };

  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [street, markerLayer],
  });

  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  let layerControl = L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    })
  layerControl.addTo(myMap);

  // Create a legend control
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // Loop through our density intervals and generate a label with a colored square for each interval.
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<div><i style="background-color:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '</div>' : '+</div>');
    }

    return div;
  };

  legend.addTo(myMap);
}

// CSS for the legend
let style = document.createElement('style');
style.innerHTML = `
  .info.legend {
    background: white;
    padding: 6px 8px;
    font: 14px/16px Arial, Helvetica, sans-serif;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
  .info.legend i {
    width: 18px;
    height: 18px;
    float: left;
    margin-right: 8px;
    opacity: 0.7;
  }
  .info.legend div {
    line-height: 18px;
    margin-bottom: 2px;
    clear: both;
  }
`;
document.head.appendChild(style);