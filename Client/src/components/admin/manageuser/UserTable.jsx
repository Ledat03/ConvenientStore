import { Table, Dropdown } from "react-bootstrap";
import React from "react";
import UpdateUser from "./UpdateUser";
import ViewUser from "./ViewUser";
import DeleteUser from "./DeleteUser";
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
export const UserTable = (props) => {
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
            <td>Tên người dùng</td>
            <td>Email</td>
            <td>Quyền hạn</td>
          </tr>
        </thead>
        <tbody>
          {props.Users?.length > 0 ? (
            props.Users.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {" "}
                    <span className="user-name">{item.username} </span>{" "}
                  </td>
                  <td>{item.email}</td>
                  <td>
                    <span className={item.role == "admin" ? "role-custom_red" : "role-custom_green"}>
                      {item.role == "admin" && "Quản trị viên"}
                      {item.role == "employee" && "Nhân viên"}
                      {item.role == "user" && "Người dùng"}
                    </span>
                  </td>
                  <td className="crud-group-btn">
                    <Dropdown>
                      <Dropdown.Toggle as={CustomToggle}>
                        <FaEllipsisV size={20} />
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

      <>
        <UpdateUser handleUsers={props.handleUsers} isShowUpdate={CRUDState.UpdateModal} closeUpdate={() => closeModal("UpdateModal")} openUpdate={() => openModal("UpdateModal")} InfoUser={InfoUser} />
        <ViewUser isShowView={CRUDState.ViewModal} closeView={() => closeModal("ViewModal")} openView={() => openModal("ViewModal")} InfoUser={InfoUser} />
        <DeleteUser isShowDelete={CRUDState.DeleteModal} closeDelete={() => closeModal("DeleteModal")} openDelete={() => openModal("DeleteModal")} InfoUser={InfoUser} handleUsers={props.handleUsers} />
      </>
    </>
  );
};
