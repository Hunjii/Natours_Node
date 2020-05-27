/* eslint-disable */
export const displayMap = (location) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaHVuamkiLCJhIjoiY2s5YXQ2NnAyMGN5aTNnbnkyZjhzZW1zaiJ9.M0tlkiQIlgrd9EwDoqDyAQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hunji/ck9mdtfwm00p81ilcyegwyeb9',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  // Add popup
  // new mapboxgl.Popup({
  //   offset: 30,
  // })
  //   .setLngLat(location.coordinates)
  //   .setHTML(`<p>Address : ${location.address}</p>`)
  //   .addTo(map);

  bounds.extend(location.coordinates);

  map.fitBounds(bounds, {
    maxZoom: 16,
  });
};
