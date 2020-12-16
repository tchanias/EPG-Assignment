import React from "react";
import { Empty, Layout, Divider } from "antd";
import moment, { duration } from "moment";

const { Sider, Content, Footer, Header } = Layout;

export default function HourSlider(props) {
  const { data } = props;
  const channels = data?.channels?.length ? data.channels : [];

  return (
    <Layout style={{ display: "flex" }}>
      <Content style={{ width: 3600, overflowY: "scroll" }}></Content>
    </Layout>
  );
}

const styles = {};
