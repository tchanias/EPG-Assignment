import React, { useState, useEffect, useRef } from "react";
import { Empty, Layout, Divider, Table } from "antd";
import moment, { duration } from "moment";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

const { Sider, Content, Footer, Header } = Layout;
const hourArray = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export default function AlternateSlider(props) {
  const { data } = props;
  const scroller = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);
  const [time, setTime] = useState(Date.now());
  const [dividerPosition, setDividerPosition] = useState(
    calculateDividerPosition()
  );
  const channels = data?.channels?.length ? data.channels : [];

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setDividerPosition(calculateDividerPosition());
  }, [time]);

  useEffect(() => {
    if (isScrolling) {
      toggleScrolling(isScrolling);
    } else {
      toggleScrolling(false);
    }
  }, [isScrolling]);

  const isCurrent = function (schedule) {
    return moment().isBetween(moment(schedule.start), moment(schedule.end));
  };

  const renderProgramList = function (schedules) {
    return schedules.map((schedule) => {
      const duration = getDiffInMinutes(schedule.start, schedule.end);
      return (
        <div
          className={"unselectable"}
          style={
            isCurrent(schedule)
              ? styles.scheduleActiveStyles(duration)
              : styles.scheduleInactiveStyles(duration)
          }
        >
          <div style={styles.programTitle}>{schedule.title}</div>
          <div style={styles.scheduleTimeStyles}>
            <span>{moment(schedule.start).format("HH:mm")}</span>
            <span> - </span>
            <span>{moment(schedule.end).format("HH:mm")}</span>
          </div>
        </div>
      );
    });
  };

  const renderChannelList = function (channels) {
    return channels.map((channel, index) => (
      <div key={index} style={styles.channelListStyles}>
        <div style={styles.programListStyles}>
          {renderProgramList(channel.schedules)}
        </div>
      </div>
    ));
  };

  const renderLogosList = function (channels) {
    return channels.map((channel, index) => (
      <div style={styles.channelLogoStyles}>
        {channel?.images?.logo ? (
          <img
            src={channel?.images?.logo}
            alt={channel?.title}
            style={styles.channelLogoImgStyles}
          />
        ) : (
          <Empty description={"Image not Found"} />
        )}
      </div>
    ));
  };

  const getDiffInMinutes = function (start, end) {
    const diff = moment(end).diff(moment(start), "minutes");
    return diff;
  };

  const renderHoursBar = function () {
    return <div style={styles.HourBarStyles}>{renderHourTags()}</div>;
  };

  const renderHourTags = function () {
    return hourArray.map((hour, index) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "absolute",
          left: 66 + 298 * index,
        }}
      >
        <span>{hour}</span>
        <span>
          <Divider
            type={"vertical"}
            style={{
              color: "white",
              backgroundColor: "white",
              height: 5,
              width: 2,
            }}
          />
        </span>
      </div>
    ));
  };

  const toggleScrolling = (isEnable) => {
    if (isEnable) {
      console.log("toggleScrolling enabled");
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      console.log("toggleScrolling unabled");
      window.removeEventListener("mousemove", onMouseMove);
    }
  };

  const onScroll = (event) => {};

  const onMouseMove = (event) => {
    event.persist();
    console.log("mouse move event", event);
    scroller.scrollLeft = scrollLeft - clientX + event.clientX;
    scroller.scrollTop = scrollTop - clientY + event.clientY;
  };

  const onMouseUp = () => {
    setIsScrolling(false);
    setScrollLeft(0);
    setScrollTop(0);
    setClientX(0);
    setClientY(0);
  };

  const onMouseDown = (event) => {
    event.persist();
    const { scrollLeft, scrollTop } = scroller;
    setIsScrolling(true);
    setScrollLeft(scrollLeft);
    setScrollTop(scrollTop);
    setClientX(event.clientX);
    setClientY(event.clientY);
  };

  return (
    <div>
      <ScrollSync>
        <Layout>
          <ScrollSyncPane>
            <Header className={"hour-bar"} style={{ overflowX: "scroll" }}>
              {renderHoursBar()}
            </Header>
          </ScrollSyncPane>
          <Layout style={{ display: "flex" }}>
            <Sider width={80} style={styles.channelsLogosBar}>
              {renderLogosList(channels)}
            </Sider>
            <ScrollSyncPane>
              <Content
                className={"channel-list-container"}
                style={{
                  overflowX: "scroll",
                  overflowY: "hidden",
                  marginLeft: 5,
                }}
              >
                <div
                  ref={scroller}
                  onMouseDown={(e) => onScroll(e)}
                  onScroll={(e) => onMouseMove(e)}
                  style={{
                    width: 7200,
                    position: "relative",
                  }}
                >
                  <div
                    className={"with-timeline"}
                    style={{
                      left: dividerPosition,
                    }}
                  ></div>
                  {/* <Divider type={"vertical"} style={styles.dividerStyle()} /> */}
                  {renderChannelList(channels)}
                </div>
              </Content>
            </ScrollSyncPane>
          </Layout>
        </Layout>
      </ScrollSync>
    </div>
  );
}

const calculateScheduleWidth = function (duration) {
  return `${duration * 5 - 2}px`;
};

const calculateDividerPosition = function () {
  const minutesPassed = moment().diff(moment().startOf("day"), "minutes");
  return minutesPassed * 5 - 2;
};

const styles = {
  HourBarStyles: {
    display: "flex",
    // alignItems: "flex-end",
    position: "relative",
    height: 30,
    width: 7200,
  },
  dividerStyle: () => {
    return {
      position: "absolute",
      height: "100%",
      left: calculateDividerPosition(),
      color: "#E1A21E",
      borderRight: "2px solid",
    };
  },
  channelListStyles: {
    display: "flex",
  },
  channelLogoStyles: {
    minWidth: 78,
    height: 70,
    border: "1px gray solid",
    // boxShadow: "10px 0px 0px 0px #000000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -1,
  },
  channelLogoImgStyles: {
    height: 30,
    width: 30,
  },
  channelsLogosBar: {
    zIndex: 1,
    boxShadow: "rgb(0, 0, 0) 10px 0px 6px -3px",
  },
  scheduleActiveStyles: (duration) => {
    return {
      width: calculateScheduleWidth(duration),
      maxHeight: 70,
      minHeight: 70,
      // padding: 10,
      backgroundColor: "#393939",
      border: "1px gray solid",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginBottom: -1,
    };
  },
  scheduleInactiveStyles: (duration) => {
    return {
      width: calculateScheduleWidth(duration),
      maxHeight: 70,
      minHeight: 70,
      // padding: 10,
      backgroundColor: "#111111",
      border: "1px gray solid",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginBottom: -1,
    };
  },
  scheduleTimeStyles: {
    marginLeft: 5,
    display: "flex",
    alignItems: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  programListStyles: {
    display: "flex",
  },
  programTitle: {
    marginTop: 5,
    marginLeft: 5,
    fontSize: 14,
  },
};
