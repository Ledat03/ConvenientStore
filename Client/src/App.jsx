import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { Bounce, ToastContainer } from "react-toastify";
import HomeHeader from "./components/common/HomeHeader";
import { Outlet } from "react-router-dom";
import "./assets/scss/header.scss";
import LoadingAnimation from "./components/common/LoadingAnimation";
import Footer from "./components/common/Footer";
import { getMainPage } from "./services/UserSevice";
function App() {
  const [data, setData] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    TestAPI();
  }, []);
  const TestAPI = async () => {
    setError(null);
    setLoadingState(true);
    try {
      const res = await getMainPage("http://localhost:8080/");
      setData(res.data);
      setLoadingState(false);
    } catch (error) {
      setError(error);
      setLoadingState(false);
    }
  };
  console.log(data);
  if (loadingState) {
    <LoadingAnimation />;
  }
  return (
    <div className="main-container">
      <HomeHeader />
      <div className="body-container">
        <div className="filter-nav"></div>
        <div className="content-container">
          <Outlet />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
    </div>
  );
}

export default App;
