import React, { useState, useEffect } from "react";
import Scheduler from "../Components/Scheduler";
import moment from "moment";

export default function Epg() {
  const [epgData, setEpgData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(moment());
  //fetches data on mount and stores it in state
  useEffect(() => {
    setDataLoading(true);
    // setTimeout is used in order to simulate the data loading delay
    setTimeout(() => {
      fetch("http://localhost:1337/epg")
        .then((res) => res.json())
        .then((data) => {
          console.log("data: ", data);
          setEpgData(data);
        });
    }, 3000);
  }, []);

  useEffect(() => setDataLoading(false), [dataLoading]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Scheduler
        data={epgData}
        loading={dataLoading}
        selectedDay={selectedDay}
        setSelectedDay={(day) => setSelectedDay(day)}
      />
    </div>
  );
}
