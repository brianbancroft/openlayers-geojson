import "ol/ol.css";
import { Map, View } from "ol";
import GeoJSON from "ol/format/GeoJSON.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { OSM, Vector as VectorSource } from "ol/source.js";
import { Fill, Stroke, Style } from "ol/style.js";

import { get } from "axios";

const jsonStyles = {
  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)"
    })
  })
};

const jsonStyleFunction = feature =>
  jsonStyles[feature.getGeometry().getType()];

var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  target: "map",
  view: new View({
    center: [-13739617.939346, 6179221.917031],
    zoom: 11
  })
});

map.once("postrender", () => {
  get(
    "https://gist.githubusercontent.com/brianbancroft/7ef87d0bdbf9efd23238432befd5e3e9/raw/b7f2181287c2d6c7c5bfbc96c0c32f5588a1edec/map.geojson"
  ).then(({ data } = {}) => {
    console.log("Data -> ", data);
    const jsonSource = new VectorSource({
      features: new GeoJSON().readFeatures(data, {
        featureProjection: "EPSG:4326"
      })
    });
    console.log("JSON Source ->", jsonSource);

    const jsonLayer = new VectorLayer({
      source: jsonSource,
      style: jsonStyleFunction
    });
    console.log("JSON Layer -> ", jsonLayer);

    map.addLayer(jsonLayer);
    console.log("Map Layers -> ");
  });
});
