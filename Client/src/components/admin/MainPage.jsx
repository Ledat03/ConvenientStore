import "../../assets/scss/dashboard.scss";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { FaUserCircle } from "react-icons/fa";
import { NumberOfUsers, NumberOfProducts } from "../../services/ManageAPI";
import { fetchListOrder } from "../../services/GetAPI";
import { useEffect, useState, useMemo } from "react";
import { viewImport } from "../../services/GetAPI";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MainPage = () => {
  const [statsData, setStatsData] = useState({
    users: "",
    products: "",
    orders: [],
  });
  const [selectedYear, setSelectedYear] = useState(2025);
  const [ImportData, setImportData] = useState([]);

  const getYear = () => {
    const Years = new Set();
    statsData.orders.forEach((item) => {
      if (item.payment.paymentStatus === "SUCCESS") {
        const year = new Date(item.payment.paymentDate).getFullYear();
        if (year > 2000) {
          Years.add(year);
        }
      }
    });
    return Array.from(Years).sort((a, b) => b - a);
  };
  const YearLists = getYear();
  const analysisRevenue = useMemo(() => {
    const revenuePerMonth = Array(12)
      .fill(0)
      .map((_, index) => {
        return {
          month: `Tháng ${index + 1}`,
          profit: 0,
        };
      });
    statsData.orders.forEach((item) => {
      if (item.payment.paymentStatus === "SUCCESS" && item.delivery.deliveryStatus !== "CANCELLED") {
        const orderDate = new Date(item.payment.paymentDate);
        const month = orderDate.getMonth();
        const year = orderDate.getFullYear();
        if (year === selectedYear) {
          return (revenuePerMonth[month].profit += item.payment.paymentAmount);
        }
      }
    });
    return revenuePerMonth;
  }, [YearLists, statsData.orders]);
  const calculatePuschaseCost = ImportData.reduce((sum, item) => {
    const total = item.inventoryImportDetails?.reduce((sum, item) => {
      return sum + item.total_cost;
    }, 0);
    return sum + total;
  }, 0);
  const totalRevenue = statsData.orders
    .filter((item) => item.payment.paymentStatus === "SUCCESS")
    .filter((item) => item.delivery.deliveryStatus === "DELIVERED")
    .reduce((sum, item) => {
      return sum + item.payment.paymentAmount;
    }, 0);
  const [orderData, setOrderData] = useState([]);
  const handleData = async () => {
    const users = await NumberOfUsers();
    const products = await NumberOfProducts();
    const orders = await fetchListOrder();
    const imports = await viewImport();
    setStatsData((prevData) => ({
      ...prevData,
      orders: orders.data,
      users: users.data,
      products: products.data,
    }));
    setOrderData(orders.data);
    setImportData(imports.data);
  };

  useEffect(() => {
    handleData();
    getYear();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const profitMargin = (((totalRevenue - calculatePuschaseCost) / totalRevenue) * 100).toFixed(1);
  console.log(calculatePuschaseCost);
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bảng Điều Khiển Quản Lý</h1>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users-icon">
            <FaUserCircle />
          </div>
          <div className="stat-content">
            <h3>Người Dùng</h3>
            <p className="stat-number">{formatNumber(statsData.users)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>Mặt Hàng</h3>
            <p className="stat-number">{formatNumber(statsData.products)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>Đơn Hàng</h3>
            <p className="stat-number">{formatNumber(statsData.orders.length)}</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container monthly-revenue">
          <div className="chart-header">
            <h3>Quản Lý Doanh Thu Tháng</h3>
            <select className="time-selector">
              {YearLists.map((item) => {
                return <option>Năm {item}</option>;
              })}
            </select>
          </div>
          <div className="chart-wrapper">
            <Bar
              data={{
                labels: analysisRevenue.map((item) => item.month),
                datasets: [
                  {
                    label: "Doanh Thu",
                    data: analysisRevenue.map((item) => item.profit),
                    backgroundColor: ["rgba(34, 197, 94, 0.8)"],
                    borderColor: ["rgb(22, 196, 45)"],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    titleColor: "white",
                    bodyColor: "white",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                      label: (context) => `Doanh thu: ${formatCurrency(context.parsed.y)}`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.1)",
                      drawBorder: false,
                    },
                    ticks: {
                      color: "#64748b",
                      font: {
                        size: 12,
                      },
                      callback: (value) => formatCurrency(value),
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: "#64748b",
                      font: {
                        size: 12,
                        weight: 500,
                      },
                    },
                  },
                },
                animation: {
                  duration: 2000,
                  easing: "easeInOutQuart",
                },
                interaction: {
                  intersect: false,
                  mode: "index",
                },
              }}
            />
          </div>
        </div>

        <div className="chart-container revenue-comparison">
          <div className="chart-header">
            <h3>Tổng Doanh Thu & So Sánh</h3>
          </div>
          <div className="revenue-stats">
            <div className="revenue-item total-revenue">
              <div className="revenue-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="revenue-content">
                <h4>Tổng Doanh Thu</h4>
                <p className="revenue-amount">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>

            <div className="revenue-item purchase-cost">
              <div className="revenue-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                </svg>
              </div>
              <div className="revenue-content">
                <h4>Tiền Nhập Hàng</h4>
                <p className="revenue-amount">{formatCurrency(calculatePuschaseCost)}</p>
              </div>
            </div>

            <div className="revenue-item profit">
              <div className="revenue-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="revenue-content">
                <h4>Lợi Nhuận</h4>
                <p className="revenue-amount">{formatCurrency(totalRevenue - calculatePuschaseCost)}</p>
                <span className="profit-margin">Tỷ suất: {profitMargin}%</span>
              </div>
            </div>
          </div>

          <div className="comparison-chart">
            <div className="doughnut-chart-container">
              <Doughnut
                data={{
                  labels: ["Lợi Nhuận", "Chi Phí Nhập Hàng"],
                  datasets: [
                    {
                      data: [totalRevenue, calculatePuschaseCost],
                      backgroundColor: ["rgba(16, 185, 129, 0.8)", "rgba(245, 158, 11, 0.8)"],
                      borderColor: ["rgba(16, 185, 129, 1)", "rgba(245, 158, 11, 1)"],
                      borderWidth: 3,
                      hoverOffset: 10,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 20,
                        font: {
                          size: 14,
                          weight: 500,
                        },
                        color: "#374151",
                        usePointStyle: true,
                        pointStyle: "circle",
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      titleColor: "white",
                      bodyColor: "white",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      borderWidth: 1,
                      cornerRadius: 8,
                      callbacks: {
                        label: (context) => {
                          const percentage = ((context.parsed / totalRevenue) * 100).toFixed(1);
                          return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
                        },
                      },
                    },
                  },
                  animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 2000,
                  },
                  cutout: "60%",
                }}
              />
            </div>

            <div className="comparison-bars">
              <div className="comparison-bar">
                <div className="comparison-label">Doanh Thu</div>
                <div className="comparison-bar-container">
                  <div className="comparison-bar-fill revenue-bar" style={{ width: `${(totalRevenue / calculatePuschaseCost) * 100}%` }}></div>
                </div>
                {console.log(totalRevenue)}
                <div className="comparison-value">{formatCurrency(totalRevenue)}</div>
              </div>
              <div className="comparison-bar">
                <div className="comparison-label">Nhập Hàng</div>
                <div className="comparison-bar-container">
                  <div className="comparison-bar-fill cost-bar" style={{ width: "100%" }}></div>
                </div>
                <div className="comparison-value">{formatCurrency(calculatePuschaseCost)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
