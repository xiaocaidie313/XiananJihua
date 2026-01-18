import Footer from "./components/footer";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/home";
import Warn from "./pages/warn";
import Chat from "./pages/chat";
import Me from "./pages/me";
import ShortVideo from "./pages/shortvedio";
import Cartoon from "./pages/cartoon";
import Podcast from "./pages/podcast";
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const shouldShowFooter = location.pathname !== '/chat';
  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        {/* <Header /> */}
        {/* 内容区域：添加 padding-bottom 避免被 fixed footer 遮挡 */}
        {/* Footer 高度 80px + padding 16px*2 = 112px，所以需要更多空间 */}
        <main className="flex-1 w-full" style={{ paddingBottom: '120px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/warn" element={<Warn />}></Route>
            <Route path="/chat" element={<Chat />}></Route>
            <Route path="/me" element={<Me />}></Route>
            <Route path="/shortvideo" element={<ShortVideo />}></Route>
            <Route path="/cartoon" element={<Cartoon />}></Route>
            <Route path="/podcast" element={<Podcast />}></Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Routes>
        </main>
        {shouldShowFooter && <Footer />}
      </div>
    </>
  );
}

export default App;
