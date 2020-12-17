import React, { useState } from "react";
import DaySlider from "./DaySlider";
import SchedulesSlider from "./SchedulesSlider";

import { Spin, Layout } from "antd";
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
  const [favorites, setFavorites] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const selectedProgramInFavorites = function () {
    if (selectedProgram) {
      return favorites.find(
        (favorite) =>
          favorite.id === selectedProgram.id &&
          favorite.index === selectedProgram.index
      );
    } else {
      return false;
    }
  };

  const setFavoriteProgram = function () {
    if (selectedProgram) {
      const programExists = favorites.filter(
        (favorite) =>
          favorite.id === selectedProgram.id &&
          favorite.index === selectedProgram.index
      );
      if (programExists?.length) {
        const newFavorites = favorites.filter(
          (favorite) =>
            favorite.id !== selectedProgram.id ||
            favorite.index !== selectedProgram.index
        );
        setFavorites(newFavorites);
      } else {
        const newFavorites = [...favorites, selectedProgram];
        setFavorites(newFavorites);
      }
    }
  };

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
                  cursor: "pointer",
                }}
                onClick={() => setFavoriteProgram()}
              >
                <StarOutlined
                  style={
                    selectedProgram && selectedProgramInFavorites()
                      ? { color: "#e1a21e" }
                      : {}
                  }
                />
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
            <SchedulesSlider
              {...props}
              selectedProgram={selectedProgram}
              setSelectedProgram={setSelectedProgram}
            />
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
