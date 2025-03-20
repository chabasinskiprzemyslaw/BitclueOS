import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../../utils/general.scss";
import "./social-media/social-media.scss";
import Layout from "./social-media/components/Layout";
import Home from "./social-media/pages/Home";
import Explore from "./social-media/pages/Explore";
import Messages from "./social-media/pages/Messages";
import Login from "./social-media/pages/Login";
import { ToolBar } from "../../../utils/general";

export const SocialMedia = () => {
  const wnapp = useSelector((state) => state.apps.socialmedia);
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const renderPage = () => {
    if (!isLoggedIn) {
      return <Login onLogin={handleLogin} />;
    }

    switch (page) {
      case "home":
        return <Home />;
      case "explore":
        return <Explore />;
      case "messages":
        return <Messages />;
      default:
        return <Home />;
    }
  };

  return (
    <div
      className="socialmedia floatTab dpShad dark"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar 
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Social Media"
      />
      <div className="socialmediaApp">
        <div className="home-container">
          {isLoggedIn ? (
            <Layout activePage={page} onChangePage={handleChangePage}>
              {renderPage()}
            </Layout>
          ) : (
            renderPage()
          )}
        </div>
      </div>
    </div>
  );
}; 