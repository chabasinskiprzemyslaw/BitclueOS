import MyPage from "./myPage";
import GoogleClone from "./googleClone";
import Layout from "./mail/layout";

// Helper function to get the selected scenario from localStorage
export const getSelectedScenario = () => {
  return localStorage.getItem("selected_scenario") || "";
};

// Base internal DNS mapping
const internalDNS = {
  "mypage.com": MyPage,
  "google.com": GoogleClone,
  "google.com/mail": Layout
};

export default internalDNS;