import React from "react";

const Tooltip = ({ feature }) => {
  console.log(feature);
  Object.entries(feature).map((data, id) => {});

  return (
    <div id={`tooltip`}>
      {Object.entries(feature).map((data, id) => {
        return (
          <div key={id}>
            <strong>{data[0]}:</strong> {data[1]}
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default Tooltip;
