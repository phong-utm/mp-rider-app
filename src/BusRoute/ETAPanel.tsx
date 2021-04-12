import React from "react";

export default function ETAPanel(props: {
  estimatedArrival?: Array<{ stop: string; seconds: number }>;
}) {
  return (
    <div
      className="container"
      style={{ maxHeight: 200, width: "100%", maxWidth: "100%", margin: 0 }}
    >
      <div className="panel">
        <p className="panel-heading">Estimated Arrival Times</p>
        {props.estimatedArrival?.map(({ stop, seconds }) => (
          <p
            className="panel-block is-justify-content-space-between"
            key={stop}
          >
            {stop}
            <span className="is-right">{formatETA(seconds)}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function formatETA(seconds: number) {
  if (seconds < 15) {
    return "Now";
  } else if (seconds < 60) {
    return "< 1 min";
  }
  const mins = Math.round(seconds / 60);
  return mins === 1 ? "1 min" : `${mins} mins`;
}
