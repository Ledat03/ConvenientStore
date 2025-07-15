import { Table, Dropdown, ButtonGroup } from "react-bootstrap";
import UpdateUser from "./UpdateUser";
import ViewUser from "./ViewUser";
import DeleteUser from "./DeleteUser";
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import Paginate from "../../common/Paginate";
import LoadingAnimation from "../../common/LoadingAnimation";
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
  if (Loading) {
    return <LoadingAnimation />;
  }
  return (
    <>
      <Table hover>
        <thead>
          <tr>
            <td>ID</td>
            <td>Tên người dùng</td>
            <td>Email</td>
            <td>Quyền hạn</td>
          </tr>
        </thead>
        <tbody>
          {UserPaginated?.length > 0 ? (
            UserPaginated?.map((item) => {
              return (
                <tr key={item.id}>
                  <td className="user-info-td">
                    <span>{item.id}</span>
                  </td>
                  <td className="user-info-td">
                    <span className="user-name">{item.username} </span>
                  </td>
                  <td className="user-info-td">{item.email}</td>
                  <td className="user-info-td">
                    <span className={item.role == "admin" ? "role-custom_red" : "role-custom_green"}>
                      {item.role == "admin" && "Quản trị viên"}
                      {item.role == "employee" && "Nhân viên"}
                      {item.role == "user" && "Người dùng"}
                    </span>
                  </td>
                  <td className="crud-group-btn">
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
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4}> System doesn't have any user </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="pagination-container">
        <Paginate itemsPerPage={itemsPerPage} totalItem={usersLength} item={ItemsPaginated} setPaginatedItem={setUserPaginated} sortBy={props.Filter} />
      </div>
      <>
        <UpdateUser handleUsers={props.handleUsers} isShowUpdate={CRUDState.UpdateModal} closeUpdate={() => closeModal("UpdateModal")} openUpdate={() => openModal("UpdateModal")} InfoUser={InfoUser} />
        <ViewUser isShowView={CRUDState.ViewModal} closeView={() => closeModal("ViewModal")} openView={() => openModal("ViewModal")} InfoUser={InfoUser} />
        <DeleteUser isShowDelete={CRUDState.DeleteModal} closeDelete={() => closeModal("DeleteModal")} openDelete={() => openModal("DeleteModal")} InfoUser={InfoUser} handleUsers={props.handleUsers} />
      </>
    </>
  );
};
