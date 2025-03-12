import MyPage from "./myPage";
import GoogleClone from "./googleClone";
import Layout from "./mail/layout";

const internalDNS = {
  "mypage.com": MyPage,
  "google.com": GoogleClone,
  "google.com/mail": Layout
};

export default internalDNS;