

	mapboxgl.accessToken = 'pk.eyJ1IjoibXV6YW1pbDIwNiIsImEiOiJjbGN5eXh2cW0wc2lnM290ZzJsZnNlbmxsIn0.o2Obvl7E_nQefSN34XsFmw';
    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [4.14537,9.73902],
        zoom: 7
    });
    let hoveredPolygonId = null;

    map.on('load', () => {
        map.addSource('market', {
            'type': 'geojson',
            'data': 'markets.geojson'
        });

        // The feature-state dependent fill-opacity expression will render the hover effect
        // when a feature's hover state is set to true.
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
    const htmlContent = `
        <div class="popup-content">
            <h3 class="popup-header">${properties.name}</h3>
            <div class="popup-body">
                <p><strong>State Code:</strong> ${properties.state_code}</p>
                <p><strong>Source:</strong> ${properties.source}</p>
                <p><strong>Ward Code:</strong> ${properties.ward_code}</p>
                <p><strong>Settlement Name:</strong> ${properties.settlement_name}</p>
                <p><strong>Type of Goods:</strong> ${properties.type_goods}</p>
                <p><strong>Frequency:</strong> ${properties.frequency}</p>
                <p><strong>Days:</strong> ${getDays(properties)}</p>
            </div>
        </div>
    `;

    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(htmlContent)
        .addTo(map);
});

function getDays(properties) {
    const days = [];
    if (properties.days_monday) days.push('Monday');
    if (properties.days_tuesday) days.push('Tuesday');
    if (properties.days_wednesday) days.push('Wednesday');
    if (properties.days_thursday) days.push('Thursday');
    if (properties.days_friday) days.push('Friday');
    if (properties.days_saturday) days.push('Saturday');
    if (properties.days_sunday) days.push('Sunday');
    return days.length > 0 ? days.join(', ') : 'No days specified';
}

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