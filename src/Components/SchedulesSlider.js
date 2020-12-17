import React, { useState, useEffect, useRef } from "react";
import { Empty, Layout, Divider, Popover } from "antd";
import moment from "moment";
import { InfoCircleOutlined } from "@ant-design/icons";
import { scrollerWidth, hourArray } from "../helpers";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import ScrollContainer from "react-indiana-drag-scroll";
// import InfoModal from "./InfoModal";

const { Sider, Content, Header } = Layout;

export default function SchedulesSlider(props) {
  const { data, selectedProgram, setSelectedProgram } = props;
  const [time, setTime] = useState(Date.now());
  const [dividerPosition, setDividerPosition] = useState(
    calculateDividerPosition()
  );
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const scroller = useRef(null);
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
    focusOnCurrentTime();
  }, [data]);

  const focusOnCurrentTime = function () {
    if (scroller?.current) {
      scroller.current.scrollTo(dividerPosition - 250, 0);
    }
  };

  const isCurrent = function (schedule) {
    return moment().isBetween(moment(schedule.start), moment(schedule.end));
  };

  const isSelectedProgram = function (channelId, index) {
    if (selectedProgram) {
      return (
        channelId === selectedProgram.id && index === selectedProgram.index
      );
    } else {
      return false;
    }
  };

  const renderProgramList = function (schedules, channelId, channelTitle) {
    return schedules.map((schedule, index) => {
      const duration = getDiffInMinutes(schedule.start, schedule.end);
      return (
        <div
          className={
            isSelectedProgram(channelId, index)
              ? "unselectable selected-program"
              : "unselectable"
          }
          style={
            isCurrent(schedule)
              ? styles.scheduleActiveStyles(duration)
              : styles.scheduleInactiveStyles(duration)
          }
          onClick={() =>
            setSelectedProgram({
              id: channelId,
              Title: schedule.title,
              index: index,
              channelTitle: channelTitle,
            })
          }
        >
          <div style={styles.programTitle}>
            {schedule.title}
            <span style={{ marginLeft: 5 }}>
              <InfoCircleOutlined
                style={{ color: "#e1a21e" }}
                onClick={() => {
                  setSelectedProgram({
                    id: channelId,
                    Title: schedule.title,
                    index: index,
                    channelTitle: channelTitle,
                  });
                  setInfoModalVisible(true);
                }}
              />

              {/*
              // to be continued
              <Popover
                title={selectedProgram?.Title}
                trigger={'hover'}
                placement={'right'}
                content={
                  <InfoModal
                    selectedProgram={selectedProgram}
                    infoModalVisible={infoModalVisible}
                    setInfoModalVisible={setInfoModalVisible}
                  />
                }
              >
                <InfoCircleOutlined
                  style={{ color: "#e1a21e" }}
                  onClick={() => {
                    setSelectedProgram({
                      id: channelId,
                      Title: schedule.title,
                      index: index,
                      channelTitle: channelTitle,
                    });
                    setInfoModalVisible(true);
                  }}
                />
              </Popover> */}
            </span>
          </div>
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
          {renderProgramList(channel.schedules, channel.id, channel.title)}
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

  return (
    <>
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
              <Content
                className={"channel-list-container"}
                style={{
                  overflowX: "scroll",
                  overflowY: "hidden",
                  marginLeft: 5,
                  position: "relative",
                }}
              >
                <ScrollSyncPane>
                  <ScrollContainer
                    className="scroll-container"
                    innerRef={scroller}
                    horizontal={true}
                    vertical={false}
                    hideScrollbars={true}
                  >
                    <div
                      style={{
                        width: scrollerWidth,
                        position: "relative",
                      }}
                    >
                      <div
                        className={"with-timeline"}
                        style={{
                          left: dividerPosition,
                        }}
                      ></div>
                      {renderChannelList(channels)}
                    </div>
                  </ScrollContainer>
                </ScrollSyncPane>
                <div style={styles.focusButtonStyles}>
                  <div onClick={() => focusOnCurrentTime()}>Now</div>
                </div>
              </Content>
            </Layout>
          </Layout>
        </ScrollSync>
      </div>
    </>
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
    width: scrollerWidth,
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
  focusButtonStyles: {
    position: "absolute",
    backgroundColor: "#e1a21e",
    width: 40,
    bottom: 20,
    right: 20,
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    cursor: "pointer",
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
