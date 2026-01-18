import home from "@/assets/images/icon/home.svg";
import warn from "@/assets/images/icon/warn.svg";
import chat from "@/assets/images/icon/chat.svg";
import me from "@/assets/images/icon/me.svg";
import book from "@/assets/images/icon/book.svg";
import podcast from "@/assets/images/icon/podcast.svg";
import play from "@/assets/images/icon/play.svg";
import search from "@/assets/images/icon/search.svg";
import send from "@/assets/images/icon/up.svg";

function HomeIcon(props?: { style?: React.CSSProperties }) {
  const { style } = props || {};
  return (
    <>
      <div style={{ width: "25px", height: "25px", ...style }}>
        <img src={home} alt="" />
      </div>
    </>
  );
}

function WarnIcon(props?: { style?: React.CSSProperties }) {
  const { style } = props || {};
  return (
    <>
      <div style={{ width: "25px", height: "25px", ...style }}>
        <img src={warn} alt="" />
      </div>
    </>
  );
}

function ChatIcon(props?: { style?: React.CSSProperties }) {
  const { style } = props || {};
  return (
    <>
      <div style={{ width: "25px", height: "25px", ...style }}>
        <img src={chat} alt="" />
      </div>
    </>
  );
}

function MeIcon(props?: { style?: React.CSSProperties }) {
  const { style } = props || {};
  return (
    <>
      <div style={{ width: "25px", height: "25px", ...style }}>
        <img src={me} alt="" />
      </div>
    </>
  );
}

function CartoonIcon(props?: { style?: React.CSSProperties }) {
  const { style } = props || {};
  return (
    <>
      <div style={{ width: "25px", height: "25px", ...style }}>
        <img src={book} alt="" />
      </div>
    </>
  );
}

function PodcastIcon(props?: { style?: React.CSSProperties }) {
  const { style } = props || {};
  return (
    <>
      <div style={{ width: "25px", height: "25px", ...style }}>
        <img src={podcast} alt="" />
      </div>
    </>
  );
}

function ShortVideoIcon(props?: { style?: React.CSSProperties }) {
  const { style } = props || {};
  return (
    <>
      <div style={{ width: "25px", height: "25px", ...style }}>
        <img src={play} alt="" />
      </div>
    </>
  );
}

function SearchIcon() {
  return (
    <>
      <div style={{ width: "20px", height: "20px" }}>
        <img src={search} alt="" />
      </div>
    </>
  );
}

function SendIcon() {
  return (
    <>
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: "#3B40FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={send} alt="" style={{ width: "20px", height: "20px" }} />
      </div>
    </>
  );
}

export {
  HomeIcon,
  WarnIcon,
  ChatIcon,
  MeIcon,
  CartoonIcon,
  PodcastIcon,
  ShortVideoIcon,
  SearchIcon,
  SendIcon,
};
