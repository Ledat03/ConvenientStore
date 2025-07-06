import { Table, Dropdown } from "react-bootstrap";
import React from "react";
import UpdateBrand from "./UpdateBrand";
import DeleteBrand from "./DeleteBrand";
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
export const TableBrand = (props) => {
  const [CRUDState, setCRUDState] = useState({
    UpdateModal: false,
    ViewModal: false,
    DeleteModal: false,
  });
  const openModal = (modalName) => {
    setCRUDState((prev) => ({ ...prev, [modalName]: true }));
  };
  const closeModal = (modalName) => {
    setCRUDState((prev) => ({ ...prev, [modalName]: false }));
  };
  const [InfoBrand, setInfoBrand] = useState({});
  const handleBrand = (brand) => {
    setInfoBrand(brand);
  };
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => {
    return (
      <span
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        style={{
          cursor: "pointer",
          color: "#000",
          display: "inline-block",
          padding: "5px",
        }}
      >
        {children}
      </span>
    );
  });
  return (
    <>
      <Table hover>
        <thead>
          <tr>
            <td>ID</td>
            <td>Tên Nhãn Hàng</td>
          </tr>
        </thead>
        <tbody>
          {props.Brands?.length > 0 ? (
            props.Brands.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td>{item.brandId}</td>
                  <td>{item.brandName}</td>
                  <td className="crud-group-btn">
                    <Dropdown>
                      <Dropdown.Toggle as={CustomToggle}>
                        <FaEllipsisV size={20} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => {
                            openModal("UpdateModal");
                            handleBrand(item);
                          }}
                        >
                          Cập nhật
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            openModal("DeleteModal");
                            handleBrand(item);
                          }}
                        >
                          Xóa
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4}> Không có nhãn hàng nào </td>
            </tr>
          )}
        </tbody>
      </Table>
      <>
        <UpdateBrand handleBrands={props.handleBrands} isShowUpdate={CRUDState.UpdateModal} closeUpdate={() => closeModal("UpdateModal")} openUpdate={() => openModal("UpdateModal")} InfoBrand={InfoBrand} />
        <DeleteBrand isShowDelete={CRUDState.DeleteModal} closeDelete={() => closeModal("DeleteModal")} openDelete={() => openModal("DeleteModal")} InfoBrand={InfoBrand} handleBrands={props.handleBrands} />
      </>
    </>
  );
};
