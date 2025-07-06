import "../../assets/scss/dashboard.scss";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { FaUserCircle } from "react-icons/fa";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MainPage = () => {
  const statsData = {
    users: 20,
    products: 125,
    orders: 38,
    totalRevenue: 2450000,
    purchaseCost: 1680000,
  };

  const monthlyRevenueData = [
    { month: "T1", value: 180000 },
    { month: "T2", value: 220000 },
    { month: "T3", value: 195000 },
    { month: "T4", value: 280000 },
    { month: "T5", value: 310000 },
    { month: "T6", value: 290000 },
    { month: "T7", value: 350000 },
    { month: "T8", value: 320000 },
    { month: "T9", value: 380000 },
    { month: "T10", value: 420000 },
    { month: "T11", value: 390000 },
    { month: "T12", value: 450000 },
  ];

  const maxRevenue = Math.max(...monthlyRevenueData.map((item) => item.value));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const profitMargin = (((statsData.totalRevenue - statsData.purchaseCost) / statsData.totalRevenue) * 100).toFixed(1);

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
            <p className="stat-number">{formatNumber(statsData.orders)}</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container monthly-revenue">
          <div className="chart-header">
            <h3>Quản Lý Doanh Thu Tháng</h3>
            <select className="time-selector">
              <option>Năm 2024</option>
              <option>Năm 2023</option>
            </select>
          </div>
          <div className="chart-wrapper">
            <Bar
              data={{
                labels: monthlyRevenueData.map((item) => item.month),
                datasets: [
                  {
                    label: "Doanh Thu",
                    data: monthlyRevenueData.map((item) => item.value),
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
                <p className="revenue-amount">{formatCurrency(statsData.totalRevenue)}</p>
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
                <p className="revenue-amount">{formatCurrency(statsData.purchaseCost)}</p>
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
                <p className="revenue-amount">{formatCurrency(statsData.totalRevenue - statsData.purchaseCost)}</p>
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
                      data: [statsData.totalRevenue - statsData.purchaseCost, statsData.purchaseCost],
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
                          const percentage = ((context.parsed / statsData.totalRevenue) * 100).toFixed(1);
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
                  <div className="comparison-bar-fill revenue-bar" style={{ width: "100%" }}></div>
                </div>
                <div className="comparison-value">{formatCurrency(statsData.totalRevenue)}</div>
              </div>
              <div className="comparison-bar">
                <div className="comparison-label">Nhập Hàng</div>
                <div className="comparison-bar-container">
                  <div className="comparison-bar-fill cost-bar" style={{ width: `${(statsData.purchaseCost / statsData.totalRevenue) * 100}%` }}></div>
                </div>
                <div className="comparison-value">{formatCurrency(statsData.purchaseCost)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
