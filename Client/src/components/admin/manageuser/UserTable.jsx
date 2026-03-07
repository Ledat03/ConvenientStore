import { Dropdown, ButtonGroup } from "react-bootstrap";
import UpdateUser from "./UpdateUser";
import ViewUser from "./ViewUser";
import DeleteUser from "./DeleteUser";
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import Paginate from "../../common/Paginate";
import LoadingAnimation from "../../common/LoadingAnimation";
import AdminDataTable from "../common/AdminDataTable";
import { handleDeleteUser } from "../../../services/GetAPI";
import { toast } from "react-toastify";
export const UserTable = (props) => {
  const itemsPerPage = 4;
  const [Loading, setLoading] = useState(false);
  const [UserPaginated, setUserPaginated] = useState();
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
  const [InfoUser, setInfoUser] = useState({});
  const handleUser = (user) => {
    setInfoUser(user);
  };
  const usersLength = props.Users.length;
  const FilledUsers = () => {
    switch (props.Filter.role) {
      case "Default":
        return props.Filter.search == "" ? props.Users : props.Users.filter((item) => item.email.toLowerCase().includes(props.Filter.search.toLowerCase()));
      case "admin":
        return props.Users.filter((item) => item.role === "admin").filter((item) => item.email.toLowerCase().includes(props.Filter.search.toLowerCase()));
      case "employee":
        return props.Users.filter((item) => item.role === "employee").filter((item) => item.email.toLowerCase().includes(props.Filter.search.toLowerCase()));
      case "user":
        return props.Users.filter((item) => item.role === "user").filter((item) => item.email.toLowerCase().includes(props.Filter.search.toLowerCase()));
    }
  };
  const ItemsPaginated = FilledUsers();

  const userColumns = [
    { key: "id", title: "ID" },
    { key: "username", title: "Tên người dùng" },
    { key: "email", title: "Email" },
    {
      key: "role",
      title: "Quyền hạn",
      render: (item) => (
        <span className={item.role == "admin" ? "role-custom_red" : "role-custom_green"}>
          {item.role == "admin" && "Quản trị viên"}
          {item.role == "employee" && "Nhân viên"}
          {item.role == "user" && "Người dùng"}
        </span>
      ),
    },
  ];

  const renderUserActions = (item) => (
    <Dropdown>
      <Dropdown.Toggle as={ButtonGroup}>
        <FaEllipsisV />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            openModal("ViewModal");
            handleUser(item);
          }}
        >
          Thông tin
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            openModal("UpdateModal");
            handleUser(item);
          }}
        >
          Cập nhật
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            openModal("DeleteModal");
            handleUser(item);
          }}
        >
          Xóa người dùng
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const handleBulkDelete = async (userIds) => {
    try {
      await Promise.all(userIds.map((id) => handleDeleteUser(id)));
      await props.handleUsers();
      toast.success("Đã xóa người dùng đã chọn");
    } catch (error) {
      toast.error("Xóa người dùng thất bại");
      throw error;
    }
  };

  if (Loading) {
    return <LoadingAnimation />;
  }
  return (
    <>
      <AdminDataTable columns={userColumns} data={UserPaginated || []} rowKey="id" renderActions={renderUserActions} onBulkDelete={handleBulkDelete} emptyText="System doesn't have any user" />

      <div className="pagination-container">
        <Paginate itemsPerPage={itemsPerPage} totalItem={usersLength} item={ItemsPaginated} setPaginatedItem={setUserPaginated} sortBy={props.Filter} reload={props.Users} />
      </div>
      <>
        <UpdateUser handleUsers={props.handleUsers} isShowUpdate={CRUDState.UpdateModal} closeUpdate={() => closeModal("UpdateModal")} openUpdate={() => openModal("UpdateModal")} InfoUser={InfoUser} />
        <ViewUser isShowView={CRUDState.ViewModal} closeView={() => closeModal("ViewModal")} openView={() => openModal("ViewModal")} InfoUser={InfoUser} />
        <DeleteUser isShowDelete={CRUDState.DeleteModal} closeDelete={() => closeModal("DeleteModal")} openDelete={() => openModal("DeleteModal")} InfoUser={InfoUser} handleUsers={props.handleUsers} />
      </>
    </>
  );
};
