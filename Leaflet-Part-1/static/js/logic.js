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
        return depth > 90 ? '#d73027' :
                depth > 70 ? '#fc8d59' :
                depth > 50 ? '#fee08b' :
                depth > 30 ? '#d9ef8b' :
                depth > 10 ? '#91cf60' :
                            '#1a9850';
        };

  // Create an overlays object.
  const markerArray = earthquakes.map((earthquake) => {
    const coordinates = earthquake.geometry.coordinates;
    const lat = coordinates[1];
    const lon = coordinates[0];
    const depth = coordinates[2];
    const mag = earthquake.properties.mag;
    let place = L.circle([lat, lon], {
      color: null,
      fillColor: getColor(depth),
      scale: ['#ffffb2', "#b10026"],
      fillOpacity: 0.5,
      radius: mag * 20000,
    });
    place.bindPopup(`<h3>${earthquake.properties.place}</h3><hr><p>${new Date(earthquake.properties.time)}</p>`);

    return place;
  });

  const markerLayer = L.layerGroup(markerArray);

  const overlayMaps = {
    Earthquakes: markerLayer,
  };

  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [street, markerLayer],
  });

  myMap.fitBounds(markerLayer.getBounds());

  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);
}
