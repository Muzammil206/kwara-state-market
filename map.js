let map
function startMap() {
    document.getElementById('welcome-page').classList.add('hidden');
	mapboxgl.accessToken = 'pk.eyJ1IjoibXV6YW1pbDIwNiIsImEiOiJjbGN5eXh2cW0wc2lnM290ZzJsZnNlbmxsIn0.o2Obvl7E_nQefSN34XsFmw';
     map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [4.4182797,8.6854323],
        zoom: 7
    });
   
    map.on('load', () => {
        map.addSource('market', {
            'type': 'geojson',
            'data': 'combine.geojson'
        });

        // The feature-state dependent fill-opacity expression will render the hover effect
        // when a feature's hover state is set to true.
        map.addLayer({
            'id': 'ward-layer',
            'type': 'fill',
            'source': 'market',
            'paint': {
                'fill-color': 'rgba(200, 100, 240, 0.4)',
                'fill-outline-color': 'rgba(200, 100, 240, 1)'
            }
        });


   
        map.on('click', 'ward-layer', (e) => {
            const properties = e.features[0].properties;

            const htmlContent = `
            <div class="popup-content">
                <h3 class="popup-header">${properties.ward_name}</h3>
                <div class="popup-body">
                    <p><strong>State Code:</strong> ${properties.ward_code}</p>
                    <p><strong>Ward Name:</strong> ${properties.ward_name}</p>
                    <p><strong>Local Gov Code :</strong> ${properties.lga_code}</p>
    
                </p>
                </p>
                </div>
            </div>
        `;


            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(htmlContent)
                .addTo(map);
        });


        map.addLayer({
            'id': 'market-point',
            'type': 'circle',
            'source': 'market',
            'paint': {
                'circle-color': '#4264fb',
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'

            },
            'filter': ['==', '$type', 'Point']
        });

        map.on('click', 'market-point', (e) => {
    const properties = e.features[0].properties;

    const getTrueDays = (properties) => {
        const days = [];
        if (properties.field_9 === " true") days.push("Monday");
        if (properties.field_11 === " true") days.push("Tuesday");
        if (properties.field_13 === " true") days.push("Wednesday");
        if (properties.field_15 === " true") days.push("Thursday");
        if (properties.field_17 === " true") days.push("Friday");
        if (properties.field_19 === " true") days.push("Saturday");
        if (properties.field_21 === " true") days.push("Sunday");
        console.log(days)
        return days;
       
    
    };
    
    const trueDays = getTrueDays(properties);
    const htmlContent = `
        <div class="popup-content">
            <h3 class="popup-header">${properties.MARKET}</h3>
            <div class="popup-body">
                <p><strong>State Code:</strong> ${properties.ST}</p>
                <p><strong>Source:</strong> ${properties.SOURCES}</p>
                <p><strong>Ward Code:</strong> ${properties.WARD}</p>
                <p><strong>Settlement Name:</strong> ${properties.SETTLEMENT_NAME}</p>
                <p><strong>Type of Goods:</strong> ${properties.type_goods}</p>
                <p><strong>Frequency:</strong> ${properties.FREQUENCY}</p>
                <p><strong>Market Days:</strong> 
                <ul>
                    ${trueDays.map(day => `<li>${day}</li>`).join('')}
                </ul>
            </p>
            </p>
            </div>
        </div>
    `;

    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(htmlContent)
        .addTo(map);
});



        map.on('mouseenter', 'states-layer', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change the cursor back to a pointer
        // when it leaves the states layer.
        map.on('mouseleave', 'states-layer', () => {
            map.getCanvas().style.cursor = '';
        });
    });

       

    map.addControl(new mapboxgl.NavigationControl());

    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        })
    );


    map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        countries: 'ng', // Restrict to Nigeria
        bbox: [3.0, 8.0, 6.0, 10.0], // Approximate bounding box for Kwara State
        filter: function (item) {
            return item.context.some((i) => {
                return (
                    i.id.split('.').shift() === 'region' &&
                    i.text === 'Kwara'
                );
            });
        },
        mapboxgl: mapboxgl,
        placeholder: '     Search ', // Custom placeholder text
        marker: {
            color: 'blue' // Customize the marker color
        },
        autocomplete: true, // Enable autocomplete
        limit: 5, // Limit the number of results shown
    }), 'top-left'
);

// Add custom styling for the Geocoder control
const styleGeocoder = () => {
    const geocoderInput = document.querySelector('.mapboxgl-ctrl-geocoder--input');
    if (geocoderInput) {
        geocoderInput.style.backgroundColor = '#f0f0f0'; // Light gray background
        geocoderInput.style.border = '2px solid #4CAF50'; // Green border
        geocoderInput.style.padding = '10px'; // Add padding
        geocoderInput.style.borderRadius = '5px'; // Rounded corners
        geocoderInput.style.fontSize = '16px'; // Increase font size
    }
};

// Apply custom styles once the Geocoder control is added to the DOM
setTimeout(styleGeocoder, 1000);

}