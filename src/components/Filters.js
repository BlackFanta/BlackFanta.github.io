import React from "react";
import { Slider } from "antd";

const Filters = (props) => {
  console.log(props);
  const onChange = (value) => {
    props.changeFilterState(value);
  };

  return (
    <div
      className="bg-white absolute top right mr12 mb24 py12 px12 shadow-darken10 round z1 wmax180"
      style={{
        width: "100%",
      }}
    >
      <div className="mb6">
        <h2 className="txt-bold txt-s block">
          Filtrer par {props.options.description}
        </h2>
        <Slider
          range
          onChange={onChange}
          min={props.options.minMax[0]}
          max={props.options.minMax[1]}
          defaultValue={props.options.value}
          marks={{
            [props.options.minMax[0]]: {
              style: { left: "0%" },
              label: props.options.minMax[0],
            },
            [props.options.minMax[1]]: {
              style: { left: `${100}%` },
              label: props.options.minMax[1],
            },
          }}
        />
      </div>
    </div>
  );
};
export default Filters;
