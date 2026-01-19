import Footer from "./components/footer";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/home";
import Warn from "./pages/warn";
import Chat from "./pages/chat";
import Me from "./pages/me";
import ShortVideo from "./pages/shortvedio";
import Cartoon from "./pages/cartoon";
import Podcast from "./pages/podcast";
import News from "./pages/news";
import Vedios from "./pages/shortvedio/details";
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const shouldShowFooter = !['/chat', '/shortvideo/details'].some(path => location.pathname.includes(path));
  const isWarnPage = location.pathname === '/warn';

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
          <Routes>
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
      </div>
    </>
  );
}

export default App;
