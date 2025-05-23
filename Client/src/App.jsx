import { useEffect, useRef, useState } from "react";
import "./App.scss";
import axios from "axios";
import { CommonNav } from "./components/common/NavBar";
import { FilterBar } from "./components/HomePage/FilterBar";
import { Outlet } from "react-router-dom";
function App() {
  const [data, setData] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const TestAPI = async () => {
      setError(null);
      setLoadingState(true);
      try {
        const res = await axios.get("http://localhost:8080/");
        setData(res.data);
        setLoadingState(false);
      } catch (error) {
        setError(error);
        setLoadingState(false);
      }
    };
    TestAPI();
  }, []);
  return (
    <div className="main-container">
      <div className="header">
        <CommonNav />
      </div>
      <div className="body-container">
        <div className="filter-nav">
          <FilterBar />
        </div>
        <div className="content-container">
          <Outlet />
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
}

export default App;
