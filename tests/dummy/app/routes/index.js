import Ember from 'ember';

const { bind } = Ember.run;
const pathToAlabama = [[35.0041, -88.1955], [34.9918, -85.6068], [32.8404, -85.1756], [32.2593, -84.8927], [32.1535, -85.0342], [31.7947, -85.1358], [31.52,   -85.0438], [31.3384, -85.0836], [31.2093, -85.107], [31.0023, -84.9944], [30.9953, -87.6009], [30.9423, -87.5926], [30.8539, -87.6256], [30.6745, -87.4072], [30.4404, -87.3688], [30.1463, -87.524], [30.1546, -88.3864], [31.8939, -88.4743], [34.8938, -88.1021], [34.9479, -88.1721], [34.9107, -88.1461]];

export default Ember.Route.extend({
  gMap: Ember.inject.service(),

  setupController: function(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 4,
      draggable: true,
      mapType: 'roadMap',
      markers: Ember.A([
        {
          id: 'jdlkfajs22',
          lat: 34.24813554589754,
          lng: -79.541015625,
          infoWindow: { content: '<p class="-nmb">Info Window</p>', visible: true },
          click: function() {console.log('You clicked the marker'); }
        }
      ]),
      heatmapMarkers: Ember.A([
        [ 45.817315080406246, -103.095703125 ],
        [ 46.54752767224308, -91.40625 ],
        { location: [ 44.51609322284931, -81.826171875 ] }
      ]),
      polygons: Ember.A([
        {
          id: 'lka234klafj23',
          paths: pathToAlabama,
          zIndex: 10,
          strokeColor: '#F6D622',
          fillColor: '#F6D622'
        }
      ]),
      circles: Ember.A([
        {
          id: 'lfkjasd23faj2f31',
          lat: 39.92237576385938,
          lng: -98.26171875,
          radius: 400000,
          fillOpacity: '0.1',
          fillColor: '#D43029',
          strokeColor: '#D43029',
          zIndex: 9,
          editable: true,
          click: bind(this, function(e, circle) {
            console.log('Route context:', this);
            console.log('Event data:', e);
            console.log('Circle data:', circle);
          })
        }
      ]),
      polylines: Ember.A([
        {
          id: 'jlkasdjfww-dfkad-oadfkj-sadf322',
          strokeColor: '#03a9f4',
          strokeOpacity: 1,
          strokeWeight: 6,
          path: [
            [35.47409160773029, -110.302734375],
            [31.667408317080916, -106.69921875],
            [30.614277412827747, -100.810546875],
            [33.07773395720986, -97.119140625],
            [35.75988604933661, -95.80078125]
          ],
          editable: true,
          mouseup: function(e, polyline) {
            console.log('done editing. Here\'s new polyline path:', polyline.getPath());
          }
        }
      ]),
      rectangles: Ember.A([
        {
          bounds: [[42.1104489601222, -112.763671875], [38.49229419236133, -106.787109375]],
          strokeColor: '#1A954A',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: '#1A954A',
          fillOpacity: 0.2,
          draggable: true,
          mouseup: function(e, rect) {
            console.log('Rectangle NE corner:', rect.bounds.getNorthEast());
            console.log('Rectangle SW corner:', rect.bounds.getSouthWest());
          }
        }
      ]),

      overlays: Ember.A([]),

      // Extensions //
      selections: {
        visible: true,
        circleOptions: {
          fillColor: getRandomColor(),
          fillOpacity: 1,
        }
      },
      selectionsMode: '',
      selectionsModes: ['marker', 'circle', 'polygon', 'rectangle', 'polyline'],
      selectionsPosition: 'top',
      selectionsDelay: 400,

      heatmapVisible: true,
      heatmapRadius: 40,
      heatmapDissipating: true,
      heatmapOpacity: 1
    });

    this.get('gMap')
      .geolocate()
      .then(geolocate => {
        let marker = {
          id: 'jdlksadvefajs22',
          lat: geolocate.coords.latitude,
          lng: geolocate.coords.longitude,
          infoWindow: { content: '<p class="-nmb">Are you here</p>', visible: true }
        };
        controller.get('markers').addObject(marker);
      })
      .catch((err) => console.error(err));

    // window.setInterval(() => {
    //   let lat = controller.get('lat')+ 0.5;
    //   controller.set('lat', lat);
    //   console.log(lat, 'upward');
    // }, 1000);
  },

  actions: {
    heatmapBinding: function(e) {
      const heatmapMarkers = this.controller.get('heatmapMarkers');

      // Randomly push or pop heatmap markers
      if(new Date().getTime() % 2) {
        heatmapMarkers.pushObject({ location: [e.latLng.lat(), e.latLng.lng()], weight: 3 });
      } else {
        heatmapMarkers.popObject();
      }

      this.controller.set('heatmapRadius', getRandomNumber(1, 80));
      this.controller.set('heatmapOpacity', getRandomNumber(0, 100) / 100);
      this.controller.set('heatmapGradient', this.controller.heatmapGradient ? null : [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]);
    },

    selctionsBinding: function() {
      this.controller.set('selections.circleOptions.fillColor', getRandomColor());
    },

    selectionsMarker: function(marker) {
      console.log(`${this.controller.get('selectionsMode')} selection`, marker);
    },

    selectionsCircle: function(circle) {
      console.log(`${this.controller.get('selectionsMode')} selection`, circle);
    },

    selectionsRectangle: function(rectangle) {
      console.log(`${this.controller.get('selectionsMode')} selection`, rectangle);
    },

    selectionsPolygon: function(polygon) {
      console.log(`${this.controller.get('selectionsMode')} selection`, polygon);
    },

    selectionsPolyline: function(polyline) {
      console.log(`${this.controller.get('selectionsMode')} selection`, polyline);
    },

    toggleHeatmap: function() {
      this.controller.set('heatmapVisible', !this.controller.heatmapVisible);
    },

    toggleSelections: function() {
      this.controller.set('selections.visible', !this.controller.get('selections.visible'));
    },

    onClickOverlay: function(e) {
      const controller = this.controller;
      controller.get('overlays').pushObject({
        id: 'zafa3239-khafj32-dajfk332-'+Ember.uuid(),
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        content: '<div class="shaa-overlay">Overlay<div class="overlay_arrow above"></div></div>',
        verticalAlign: 'top',
        horizontalAlign: 'center',
        click: function(e, o) {
          e.stopPropagation();
          const o_id = o.id;
          const overlays = controller.overlays;

          // Remove marker
          for(let i = 0, l = overlays.length; i < l; i++) {
            if(overlays[i].id !== o_id) { continue; }

            overlays.removeAt(i, 1);
            break;
          }
        }
      });
    },

    onClickRectangle: function(e) {
      const color = getRandomColor();
      const rectangles = this.controller.get('rectangles');

      rectangles.pushObject({
        id: 'jafs3239-kdafj32-dajfk332',
        bounds: [[e.latLng.lat() - 5, e.latLng.lng() - 5], [e.latLng.lat() + 5, e.latLng.lng() + 5]],
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: color,
        fillOpacity: 0.2,
        click: function(e, rect) {
          const rect_id = rect.id;

          // Remove marker
          for(let i = 0, l = rectangles.length; i < l; i++) {
            if(rectangles[i].id !== rect_id) { continue; }

            rectangles.removeAt(i, 1);
            break;
          }
        }
      });
    },

    onClickPolygons: function() {
      const controller = this.controller;

      controller.set('polygons', Ember.A());

      Ember.run.later(() => {
        controller.get('polygons').pushObject({
          id: 'ldfa3fadkafa32234klafj23',
          paths: [
            [-0.19226038138120835, -120.498046875],
            [1.0381511983133254, -104.0625],
            [-9.725300127953915, -95.185546875],
            [-14.365512629178598, -112.060546875],
            [-7.204450551811732, -126.03515625]
          ]
        });
      }, 1000);
    },

    onCircleClick: function() {
      const controller = this.controller;
      let circles      = controller.get('circles');

      // circles.removeAt(0);

      // const rand = Math.round(Math.random() * (circles.length - 1) + 0);

      controller.get('circles').pushObject({
        id: 'zfkj234d23faj2f31-'+Ember.uuid(),
        lat: (Math.random() * (55 - 22) + 22),
        lng: (Math.random() * (-102 + 115) + -115),
        radius: (Math.random() * (500000 - 10000) + 10000),
        fillOpacity: (Math.random() * (1 - 0) + 0),
        fillColor: getRandomColor(),
        zIndex: 9,
        click: function(e, cir) {
          const cir_id = cir.id;

          // Remove marker
          for(let i = 0, l = circles.length; i < l; i++) {
            if(circles[i].id !== cir_id) { continue; }

            circles.removeAt(i, 1);
            break;
          }
        }
      });

      // controller.circles.arrayContentDidChange(circles.length - 1, null, 1);
    },

    onClickMarkers: function(e) {
      const controller = this.controller;
      let markers      = controller.markers;
      const markerId   = Ember.uuid()+'-ember-g-map-id';
      console.log(e);
      e.mapIdle.then(function() {
        console.log(e.latLng.lat(), e.latLng.lng());
      });


      // Relocate a random marker in markers
      // const rand = Math.round(Math.random() * (markers.length - 1) + 0);
      // if(markers[rand]) {
      //   markers[rand].lat = (Math.random() * (55 - 22) + 22);
      //   markers[rand].lng = (Math.random() * (-102 - -115) + -115);
      // }

      // Add One Marker
      markers.pushObject({
        id: markerId,
        lat:  e.latLng.lat(),
        lng:  e.latLng.lng(),
        title: 'The title is -'+ markerId,
        click: function(e) {
          const m_id = e.id;
          // Remove marker
          for(let i = 0, l = markers.length; i < l; i++) {
            if(markers[i].id !== m_id) { continue; }

            markers.removeAt(i, 1);
            break;
          }
        },
        infoWindow: {
          content: '<p>Here I come, Alabama!</p>',
          visible: true
        }
      });

      // Mix up All Markers
      // controller.set('markers', Ember.A(markers.map((m, i) => {
      //   const rand = Math.round(Math.random() * (markers.length - 1) + 0);
      //   return Ember.merge(m, {
      //     lat: (Math.random() * (55 - 22) + 22),
      //     lng: (Math.random() * (-102 - -115) + -115)
      //   });
      // })));

      // controller.markers.arrayContentDidChange(markers.length - 1, null, 1);
    },

    removeAllMarkers: function() {
      this.controller.set('markers', Ember.A([]));
    },

    mapLoaded: function() {
      // Map's name: e.map
      console.info('Google map has finished loading!');
    }
  }
});

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// function getRandomRgb(opacity=1) {
//   return 'rgba('+ getRandomNumber(0, 255) +','+ getRandomNumber(0, 255) +','+ getRandomNumber(0, 255) +','+ opacity +')';
// }
