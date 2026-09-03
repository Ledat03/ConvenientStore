import { useEffect, useState } from "react";
import "./App.scss";
import { Bounce, ToastContainer } from "react-toastify";
import HomeHeader from "./components/common/HomeHeader";
import { Outlet } from "react-router-dom";
import "./assets/scss/header.scss";
import ChatbotWidget from "./components/HomePage/ChatbotWidget";
import LoadingAnimation from "./components/common/LoadingAnimation";
import Footer from "./components/common/Footer";
function App() {
  const [loadingState, setLoadingState] = useState(false);
  useEffect(() => {
    setLoadingState(true)
    setTimeout(() => {
      setLoadingState(false);
    }, 1000)
  }, [])
  if (loadingState) {
    return <LoadingAnimation />;
  }

  return (
    <div className="main-container">
      <HomeHeader />
      <div className="body-container">
        <div className="content-container">
          <Outlet />
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
      <ChatbotWidget />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
    </div>
  );
}

export default App;
