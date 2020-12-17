import React, { useState, useEffect } from "react";
import { Empty } from "antd";
import ItemsCarousel from "react-items-carousel";
import moment from "moment";

export default function DaySlider(props) {
  const { selectedDay, setSelectedDay } = props;
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const getDaysArrayByMonth = function (day) {
    var daysInMonth = day ? moment(day).daysInMonth() : moment().daysInMonth();
    var arrDays = [];

    while (daysInMonth) {
      var current = moment().date(daysInMonth);
      arrDays.push(current);
      daysInMonth--;
    }
    return arrDays;
  };

  const initialActiveIndex = function (selectedDay) {
    const monthArray = getDaysArrayByMonth(selectedDay).sort(sortDays);
    if (monthArray) {
      return monthArray.findIndex(
        (day) => moment(selectedDay).format("L") === moment(day).format("L")
      );
    } else {
      return 0;
    }
  };

  useEffect(() => {
    setActiveItemIndex(initialActiveIndex(selectedDay));
  }, []);

  useEffect(() => {
    const monthArray = getDaysArrayByMonth(selectedDay).sort(sortDays);
    if (monthArray) {
      setSelectedDay(moment(monthArray[activeItemIndex]));
    }
  }, [activeItemIndex]);

  const renderDays = function (selectedDay) {
    const monthArray = getDaysArrayByMonth(selectedDay).sort(sortDays);
    if (monthArray) {
      return monthArray.map((day, index) => renderDay(day, index));
    } else {
      return <Empty />;
    }
  };

  const renderDay = function (day, index) {
    if (moment(selectedDay).isSame(day, "day")) {
    }
    return (
      <div
        className={"day-container"}
        style={
          moment(selectedDay).isSame(day, "day")
            ? {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                userSelect: "none",
              }
            : {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.5)",
                userSelect: "none",
              }
        }
        key={index}
        onClick={() => {
          setSelectedDay(day);
        }}
      >
        <div>{moment(day).format("ddd")}</div>
        <div>{moment(day).format("DD.MM.")}</div>
      </div>
    );
  };

  const sortDays = function (a, b) {
    return parseInt(moment(a).format("dd")) > parseInt(moment(b).format("dd"))
      ? 1
      : -1;
  };

  return (
    <div style={{ padding: `10px ${40}px`, width: 398 }}>
      <ItemsCarousel
        requestToChangeActive={setActiveItemIndex}
        activeItemIndex={activeItemIndex}
        numberOfCards={3}
        gutter={10}
        activePosition={"center"}
        leftChevron={
          <span onClick={() => setActiveItemIndex(activeItemIndex - 1)}>
            {"<"}
          </span>
        }
        rightChevron={
          <span onClick={() => setActiveItemIndex(activeItemIndex + 1)}>
            {">"}
          </span>
        }
        outsideChevron
        chevronWidth={40}
        style={{ width: 399 }}
      >
        {renderDays(selectedDay)}
      </ItemsCarousel>
    </div>
  );
}
