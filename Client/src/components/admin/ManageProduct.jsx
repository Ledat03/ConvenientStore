import { useEffect, useState } from "react";
import TableProduct from "./manageproduct/TableProduct";
import AddProduct from "./manageproduct/AddProduct";
export const ManageProduct = () => {
  return (
    <>
      <div className="manage-product-container">
        <div className="manage-product-subcontainer head">
          <h2>Manage Product</h2>
          <AddProduct />
        </div>
        <div className="manage-product-subcontainer body">
          <TableProduct />
        </div>
      </div>
    </>
  );
};
