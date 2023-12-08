import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import Legend from "./components/Legend";
import Tooltip from "./components/Tooltip";
import Filters from "./components/Filters";
import Optionsfield from "./components/Optionsfield";
import "./Map.css";
import data from "./data.json";
import dataa from "./Emissions_annuelles_par_EPCI.json";
mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVkaXMiLCJhIjoiY2w5ZWtiZmJ6MGhjYjN6bXlrZHVsOXl5dSJ9.1CE9860n2Unc9IByH8aJ1A";

const Map = () => {
  const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const lyonOptions = [
    {
      name: "SO2",
      description: "Dioxyde de soufre (Kg)",
      property: "so2_kg",
      stops: [
        [0, "green"],
        [10000, "yellow"],
        [100000, "orange"],
        [9278314, "red"],
      ],
      minMax: [0, 9278314],
      value: [0, 9278314],
    },
    {
      name: "NOx",
      description: " Oxydes d’azote NOx équivalent",
      property: "nox_kg",
      stops: [
        [0, "green"],
        [10000, "yellow"],
        [500000, "orange"],
        [9278314, "red"],
      ],
      minMax: [0, 9278314],
      value: [0, 9278314],
    },
    {
      name: "CO",
      description: "Monoxyde de Carbone (Kg)",
      property: "co_kg",
      stops: [
        [0, "green"],
        [10000, "yellow"],
        [500000, "orange"],
        [16398828, "red"],
      ],
      minMax: [0, 16398828],
      value: [0, 16398828],
    },
  ];
  const mapContainerRef = useRef(null);
  const [lyonActive, setLyonActive] = useState(lyonOptions[0]);
  const [filterExpr, setFilterExpr] = React.useState([]);

  const [map, setMap] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [4.8357, 45.764],
      zoom: 8,
    });

    map.on("load", () => {
      map.addSource("lyon", {
        type: "geojson",
        data: dataa,
      });

      map.addLayer({
        id: "lyon",
        type: "fill",
        source: "lyon",
      });

      map.setPaintProperty("lyon", "fill-color", {
        property: lyonActive.property,
        stops: lyonActive.stops,
      });
      map.setPaintProperty("lyon", "fill-opacity", 0.8);

      map.on("click", "lyon", (e) => {
        console.log(e.features);
        if (e.features.length) {
          const tooltipNode = document.createElement("div");
          ReactDOM.render(
            <Tooltip feature={e.features[0].properties} />,
            tooltipNode
          );

          // Set tooltip on map
          tooltipRef.current
            .setLngLat(e.lngLat)
            .setDOMContent(tooltipNode)
            .addTo(map);
        }
      });

      setMap(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  useEffect(() => {
    paint();
  }, [lyonActive]);

  const paint = () => {
    if (map) {
      map.setPaintProperty("lyon", "fill-color", {
        property: lyonActive.property,
        stops: lyonActive.stops,
      });
    }
  };

  const changeState = (i) => {
    setLyonActive(lyonOptions[i]);
    map.setPaintProperty("lyon", "fill-color", {
      property: lyonActive.property,
      stops: lyonActive.stops,
    });
  };
  const changeFilterState = (i) => {
    console.log(i);
    var newLyonActive = lyonActive;
    newLyonActive.value = i;
    setLyonActive(newLyonActive);
    var filterExpression = ["all"];
    filterExpression.push([">=", lyonActive.property, newLyonActive.value[0]]);
    filterExpression.push(["<=", lyonActive.property, newLyonActive.value[1]]);
    console.log(filterExpression);
    map.setFilter("lyon", filterExpression);
  };

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
      <Legend active={lyonActive} stops={lyonActive.stops} />
      <Optionsfield
        options={lyonOptions}
        property={lyonActive.property}
        changeState={changeState}
      />
      <Filters
        changeFilterState={changeFilterState}
        options={lyonActive}
      ></Filters>
    </div>
  );
};

export default Map;
