import React from "react";
import "../../assets/scss/QuickCategory.scss";
import { Link } from "react-router-dom";

const QuickCategory = () => {
  const categories = [
    {
      id: 1,
      name: "Bánh Kẹo",
      count: "5 Sản Phẩm",
      icon: "https://res.cloudinary.com/donwvgcah/image/upload/v1749110382/Cookies_Pics_twfnbh.png",
    },
    {
      id: 2,
      name: "Thực Phẩm Chế Biến",
      count: "8 Sản Phẩm",
      icon: "https://res.cloudinary.com/donwvgcah/image/upload/v1749116896/Bread_exoirs.jpg",
    },
    {
      id: 3,
      name: "Các Loại Sữa",
      count: "12 Sản Phẩm",
      icon: "https://res.cloudinary.com/donwvgcah/image/upload/v1749117031/milk-300x300_lqz109.jpg",
    },
    {
      id: 4,
      name: "Thực Phẩm Đông Lạnh",
      count: "10 Sản Phẩm",
      icon: "https://res.cloudinary.com/donwvgcah/image/upload/v1749117031/FrzFood-300x300_b0fae9.jpg",
    },
    {
      id: 5,
      name: "Rau Củ & Trái Cây",
      count: "15 Sản Phẩm",
      icon: "https://res.cloudinary.com/donwvgcah/image/upload/v1749117032/fruit_nz90is.png",
    },
  ];

  return (
    <section className="product-categories">
      <div className="container">
        <div className="product-categories__grid">
          {categories.map((category) => (
            <Link to={`/products?category=${category.name}`} key={category.id} className="product-categories__item">
              <div className="product-categories__icon">
                <img src={category.icon} alt={category.name} />
              </div>
              <div className="product-categories__info">
                <h3 className="product-categories__name">{category.name}</h3>
                <span className="product-categories__count">{category.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickCategory;
