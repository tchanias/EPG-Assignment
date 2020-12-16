import React from "react";
import { Empty } from "antd";
import moment from "moment";

export default function ChannelMenu(props) {
  const { data } = props;
  const channels = data?.channels?.length ? data.channels : [];

  const isCurrent = function (schedule) {
    return moment().isBetween(moment(schedule.start), moment(schedule.end));
  };

  const renderProgramList = function (schedules) {
    return schedules.map((schedule) => (
      <div
        style={
          isCurrent(schedule)
            ? styles.scheduleActiveStyles
            : styles.scheduleInactiveStyles
        }
      >
        <div>{schedule.title}</div>
        <div style={styles.scheduleTimeStyles}>
          <span>{moment(schedule.from).format("HH:mm")}</span>
          <span> - </span>
          <span>{moment(schedule.to).format("HH:mm")}</span>
        </div>
      </div>
    ));
  };

  const renderChannelList = function (channels) {
    return channels.map((channel, index) => (
      <div key={index} style={styles.channelListStyles}>
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
        <div style={styles.programListStyles}>
          {renderProgramList(channel.schedules)}
        </div>
      </div>
    ));
  };

  return <div>{renderChannelList(channels)}</div>;
}

const styles = {
  channelListStyles: {
    display: "flex",
  },
  channelLogoStyles: {
    minWidth: 90,
    height: 70,
    boxShadow: "10px 0px 6px -3px #000000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  channelLogoImgStyles: {
    height: 30,
    width: 30,
  },
  scheduleActiveStyles: {
    height: 70,
    // padding: 10,
    backgroundColor: "#393939",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  scheduleInactiveStyles: {
    height: 70,
    // padding: 10,
    backgroundColor: "#111111",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  scheduleTimeStyles: {
    color: "rgba(255,255,255,0.5)",
  },
  programListStyles: {
    display: "flex",
  },
};
