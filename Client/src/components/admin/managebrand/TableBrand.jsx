import { Dropdown, ButtonGroup } from "react-bootstrap";
import React from "react";
import UpdateBrand from "./UpdateBrand";
import DeleteBrand from "./DeleteBrand";
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import AdminDataTable from "../common/AdminDataTable";
import { deleteBrand } from "../../../services/GetAPI";
import { toast } from "react-toastify";
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

  const brandColumns = [
    { key: "brandId", title: "ID" },
    { key: "brandName", title: "Tên Nhãn Hàng" },
  ];

  const renderBrandActions = (item) => (
    <Dropdown>
      <Dropdown.Toggle as={ButtonGroup}>
        <FaEllipsisV size={18} />
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
  );

  const handleBulkDelete = async (brandIds) => {
    try {
      await Promise.all(brandIds.map((id) => deleteBrand(id)));
      await props.handleBrands();
      toast.success("Đã xóa các nhãn hàng đã chọn");
    } catch (error) {
      toast.error("Xóa nhãn hàng thất bại");
      throw error;
    }
  };

  return (
    <>
      <AdminDataTable columns={brandColumns} data={props.Brands || []} rowKey={(item) => item.brandId} renderActions={renderBrandActions} onBulkDelete={handleBulkDelete} emptyText="Không có nhãn hàng nào" />
      <>
        <UpdateBrand handleBrands={props.handleBrands} isShowUpdate={CRUDState.UpdateModal} closeUpdate={() => closeModal("UpdateModal")} openUpdate={() => openModal("UpdateModal")} InfoBrand={InfoBrand} />
        <DeleteBrand isShowDelete={CRUDState.DeleteModal} closeDelete={() => closeModal("DeleteModal")} openDelete={() => openModal("DeleteModal")} InfoBrand={InfoBrand} handleBrands={props.handleBrands} />
      </>
    </>
  );
};
