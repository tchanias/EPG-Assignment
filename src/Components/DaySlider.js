import React from "react";
import { Empty } from "antd";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import moment from "moment";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export default function DaySlider(props) {
  const { selectedDay, setSelectedDay } = props;

  function getDaysArrayByMonth(day) {
    var daysInMonth = day ? moment(day).daysInMonth() : moment().daysInMonth();
    var arrDays = [];

    while (daysInMonth) {
      var current = moment().date(daysInMonth);
      arrDays.push(current);
      daysInMonth--;
    }
    return arrDays;
  }

  const renderDays = function (selectedDay) {
    const month = selectedDay.format("MM");
    const day = selectedDay.format("DD");
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
    <Carousel
      afterChange={(props) => console.log("slider props: ", props)}
      containerClass="carousel-container"
      centerMode
      focusOnSelect
      swipeable={true}
      draggable={true}
      showDots={false}
      responsive={responsive}
      ssr={false}
      infinite={true}
      autoPlay={false}
      arrows={false}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      customTransition="all .5"
      transitionDuration={500}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      deviceType={"desktop"}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
    >
      {renderDays(selectedDay)}
    </Carousel>
  );
}
