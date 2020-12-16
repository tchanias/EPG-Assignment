import React from "react";
import DaySlider from "./DaySlider";
import HourSlider from "./HourSlider";
import ChannelMenu from "./ChannelMenu";
import SchedulesSlider from "./SchedulesSlider";
import AlternateSlider from "./AlternateSlider";
import { Spin, Layout, Button } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  HomeOutlined,
  YoutubeOutlined,
  UnorderedListOutlined,
  HistoryOutlined,
  InboxOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Sider, Content, Footer, Header } = Layout;

let siderWidth = 80;
let contentwidth = 510;

export default function Scheduler(props) {
  const { data, loading } = props;

  return (
    <div>
      {loading ? (
        <Spin spinning={loading} />
      ) : (
        <Layout
          style={{
            width: 600,
            height: 900,
            backgroundColor: "#333",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <Header
            style={{ position: "sticky", zIndex: 1, width: "100%", top: 0 }}
          >
            <Layout
              style={{
                display: "flex",
                width: "100%",
                height: 60,
                backgroundColor: "black",
              }}
            >
              <Sider
                width={40}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserOutlined style={{ color: "#fff" }} />
              </Sider>
              <Content
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div>Logo</div>
              </Content>
              <Sider
                width={40}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SearchOutlined style={{ color: "#fff" }} />
              </Sider>
            </Layout>
          </Header>
          <Layout
            style={{
              height: 70,
              width: "100%",
              display: "flex",
              alignItems: "center",
              borderTop: "2px gray solid",
              borderBottom: "2px gray solid",
            }}
          >
            <Sider width={siderWidth} style={{ height: 70 }}>
              <div
                style={{
                  width: "100%",
                  height: 70,
                  boxShadow: "10px 0px 6px -3px #000000",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <StarOutlined />
              </div>
            </Sider>
            <Content
              width={contentwidth}
              style={{ width: contentwidth, height: "100%", display: "flex" }}
            >
              <DaySlider {...props} />
            </Content>
          </Layout>
          <Layout>
            <Content>
              <HourSlider {...props} />
            </Content>
          </Layout>
          {/* <Layout>
            <Sider>
              <ChannelMenu {...props} />
            </Sider>
            <Content>
              <SchedulesSlider {...props} />
            </Content>
          </Layout> */}
          <Layout>
            <AlternateSlider {...props} />
          </Layout>
          <Footer
            style={{
              position: "sticky",
              zIndex: 1,
              width: "100%",
              height: 50,
              bottom: 0,
              top: "100vh",
            }}
          >
            <Layout style={{ height: "100%" }}>
              <Content
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <HomeOutlined />
                <YoutubeOutlined /> <UnorderedListOutlined />{" "}
                <HistoryOutlined /> <InboxOutlined />
              </Content>
            </Layout>
          </Footer>
        </Layout>
      )}
    </div>
  );
}
