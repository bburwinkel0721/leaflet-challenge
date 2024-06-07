// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
    console.log(data.features);
    // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.
  
    // 1.
    // Pass the features to a createFeatures() function:
    createFeatures(data.features);
  
  });
  
  // 2.
  function createFeatures(earthquakeData) {
  
    // YOUR CODE GOES HERE
    // Save the earthquake data in a variable.
  
    // Pass the earthquake data to a createMap() function.
    createMap(earthquakeData);
  
  }
  
  
  // 3.
  // createMap() takes the earthquake data and incorporates it into the visualization:
  
  function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlays object.
    const markerArray = earthquakes.map(earthquake => {
      const coordinates = earthquake.geometry.coordinates;
      const lat = coordinates[1]
      const lon = coordinates[0]
      const depth = coordinates[2]
      const mag = earthquake.properties.mag
      let place = L.circle([lat, lon], {
        color: depth,
        fillColor: depth,
        fillOpacity: 0.75,
        radius: mag*20000
      })
      return place
    })
  
    const markerLayer = L.layerGroup(markerArray);
  
    const overlayMaps = {
      'Earthquakes': markerLayer
    }
  
    // Create a new map.
    // Edit the code to add the earthquake data to the layers.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [street, markerLayer]
    });
  
    myMap.fitBounds(markerLayer.getBounds())
  
    // Create a layer control that contains our baseMaps.
    // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  }
  
// // Perform a GET request to the query URL/
// d3.json(queryUrl).then(function (data) {
//   // Once we get a response, send the data.features object to the createFeatures function.
//   createFeatures(data.features);
// });

// function createFeatures(earthquakeData) {

//   // Define a function that we want to run once for each feature in the features array.
//   // Give each feature a popup that describes the place and time of the earthquake.
//   function onEachFeature(feature, layer) {
//     layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
//   }

//   // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//   // Run the onEachFeature function once for each piece of data in the array.
//   let earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   });

//   // Send our earthquakes layer to the createMap function/
//   createMap(earthquakes);
// }

// function createMap(earthquakes) {

//   // Create the base layers.
//   let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//   })

//   let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//   });

//   // Create a baseMaps object.
//   let baseMaps = {
//     "Street Map": street,
//     "Topographic Map": topo
//   };

//   // Create an overlay object to hold our overlay.
//   let overlayMaps = {
//     Earthquakes: earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load.
//   let myMap = L.map("map", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [street, earthquakes]
//   });

//   // Create a layer control.
//   // Pass it our baseMaps and overlayMaps.
//   // Add the layer control to the map.
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);

// }