import React from "react";
import "../../assets/scss/QuickCategory.scss";
import { Link } from "react-router-dom";

const QuickCategory = () => {
  const categories = [
    {
      id: 1,
      name: "Bánh Kẹo",
      count: "",
      icon: "https://res.cloudinary.com/donwvgcah/image/upload/v1749110382/Cookies_Pics_twfnbh.png",
    },
    {
      id: 2,
      name: "Thực Phẩm Chế Biến",
      count: "",
      icon: "https://res.cloudinary.com/donwvgcah/image/upload/v1749116896/Bread_exoirs.jpg",
    },
    {
      id: 3,
      name: "Các Loại Sữa",
      count: "",
      icon: "https://res.cloudinary.com/donwvgcah/image/upload/v1749117031/milk-300x300_lqz109.jpg",
    },
    {
      id: 4,
      name: "Thực Phẩm Đông Lạnh",
      count: "",
      icon: "https://res.cloudinary.com/donwvgcah/image/upload/v1749117031/FrzFood-300x300_b0fae9.jpg",
    },
    {
      id: 5,
      name: "Chăm sóc cá nhân",
      count: "",
      icon: "https://res.cloudinary.com/donwvgcah/image/upload/v1787735116/10016850-intense_shampoo-keratin_650ml-20250217205920_ebdyat.png",
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
