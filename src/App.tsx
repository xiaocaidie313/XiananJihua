import Footer from "./components/footer";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import Home from "./pages/home";
import Warn from "./pages/warn";
import Chat from "./pages/chat";
import Me from "./pages/me";
import ShortVideo from "./pages/shortvedio";
import Cartoon from "./pages/cartoon";
import Podcast from "./pages/podcast";
import News from "./pages/news";
import Vedios from "./pages/shortvedio/details";
function App() {
  const location = useLocation();
  const state = location?.state as { backgroundLocation?:Location }
  const backgroundLocation = state?.backgroundLocation || null
  const shouldShowFooter = !['/chat', '/shortvideo/details'].some(path => location.pathname.includes(path));
  const isWarnPage = location.pathname === '/warn';
  const overlayPaths = ['/podcast', '/cartoon', '/shortvideo', '/shortvideo/details'];
  const shouldShowOverlay = Boolean(backgroundLocation) && overlayPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        {/* <Header /> */}
        {/* 内容区域 */}
        <main 
          className="flex-1 w-full" 
          style={{ 
            paddingBottom: (shouldShowFooter && !isWarnPage) ? '120px' : '0' 
          }}
        >
          <Routes location={backgroundLocation || location}>  
            <Route path="/" element={<Navigate to="/home" />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/warn" element={<Warn />}></Route>
            <Route path="/chat" element={<Chat />}></Route>
            <Route path="/news/:id" element={<News />}></Route>
            <Route path="/me" element={<Me />}></Route>
            <Route path="/shortvideo" element={<ShortVideo />}></Route>
            <Route path="/shortvideo/details/:id" element={<Vedios />}></Route>
            <Route path="/cartoon" element={<Cartoon />}></Route>
            <Route path="/podcast" element={<Podcast />}></Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Routes>

        </main>
        {shouldShowFooter && <Footer />}
        {shouldShowOverlay && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5000 }}>
            <Routes>
              <Route path="/podcast" element={<Podcast />} />
              <Route path="/cartoon" element={<Cartoon />} />
              <Route path="/shortvideo" element={<ShortVideo />} />
              {/* <Route path="/home" element={<Home />} /> */}
              <Route path="/shortvideo/details/:id" element={<Vedios />} />
            </Routes>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
