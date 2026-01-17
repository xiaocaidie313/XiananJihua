import home from "@/assets/images/icon/home.svg";
import warn from "@/assets/images/icon/warn.svg";
import chat from "@/assets/images/icon/chat.svg";
import me from "@/assets/images/icon/me.svg";
import book from "@/assets/images/icon/book.svg";
import podcast from "@/assets/images/icon/podcast.svg";
import play from "@/assets/images/icon/play.svg";

function HomeIcon() {
  return (
    <>
      <div style={{ width: "25px", height: "25px" }}>
        <img src={home} alt="" />
      </div>
    </>
  );
}
function WarnIcon() {
  return (
    <>
      <div style={{ width: "25px", height: "25px" }}>
        <img src={warn} alt="" />
      </div>
    </>
  );
}

function ChatIcon() {
  return (
    <>
      <div style={{ width: "25px", height: "25px" }}>
        <img src={chat} alt="" />
      </div>
    </>
  );
}
function CartoonIcon() {
  return (
    <>
      <div style={{ width: "25px", height: "25px" }}>
        <img src={book} alt="" />
      </div>
    </>
  );
}
function PodcastIcon() {
  return (
    <>
      <div style={{ width: "25px", height: "25px" }}>
        <img src={podcast} alt="" />
      </div>
    </>
  );
}
function ShortVideoIcon() {
  return (
    <>
      <div style={{ width: "25px", height: "25px" }}>
        <img src={play} alt="" />
      </div>
    </>
  );
}
function MeIcon() {
  return (
    <>
      <div style={{ width: "25px", height: "25px" }}>
        <img src={me} alt="" />
      </div>
    </>
  );
}


export { HomeIcon, WarnIcon, ChatIcon, MeIcon, CartoonIcon, PodcastIcon, ShortVideoIcon };
