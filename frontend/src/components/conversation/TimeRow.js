import React from "react";
import moment from "moment";
const TimeRow = ({ date }) => {
  return (
    <div className="timerow">
      {moment(date).format("MMMM Do YYYY, h:mm:ss a")}
    </div>
  );
};

export default TimeRow;
