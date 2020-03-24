var styles = {
    'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: [255, 255, 255, 0.3]
            }),
            stroke: new ol.style.Stroke({color: '#cb1d1d', width: 2})
        })
    })],
    'LineString': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 1
        })
    })],
    'Polygon': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
        })
    })],
    'Circle': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    })]
};

var styleFunction = function(feature, resolution) {
  return styles[feature.getGeometry().getType()];
};

var olview = new ol.View({
    center: ol.proj.fromLonLat([78.00,22.00]),
    zoom: 2.75,
});

var geojson_layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'file.json',
        format: new ol.format.GeoJSON()
    }),
    style: styleFunction
});

var map = new ol.Map({
    target: document.getElementById('map'),
    view: olview,
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
      }), geojson_layer
    ]
});

/*
 Popup
 */
   var container = document.getElementById('popup');
   var content_element = document.getElementById('popup-content');
   var closer = document.getElementById('popup-closer');

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    offset: [0, -10]
});
map.addOverlay(overlay);

var fullscreen = new ol.control.FullScreen();
map.addControl(fullscreen);

map.on('click', function(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });
    if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        
        var content = '<h3>' + feature.get('name') + '</h3>';
        content += '<h5>' + feature.get('description') + '</h5>';
        
        content_element.innerHTML = content;
        overlay.setPosition(coord);
        
        console.info(feature.getProperties());
    }
});
/*map.on('pointermove', function(e) {
    if (e.dragging) return;
       
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});*/

