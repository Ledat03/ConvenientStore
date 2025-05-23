import { Table, Button } from "react-bootstrap";
import UpdateUser from "./UpdateUser";
import ViewUser from "./ViewUser";
import DeleteUser from "./DeleteUser";
import { useState } from "react";
export const UserTable = (props) => {
  const [isShowUpdate, setShowUpdate] = useState(false);
  const [isShowView, setShowView] = useState(false);
  const [isShowDelete, setShowDelete] = useState(false);
  const closeUpdate = () => setShowUpdate(false);
  const openUpdate = () => setShowUpdate(true);
  const closeView = () => setShowView(false);
  const openView = () => setShowView(true);
  const closeDelete = () => setShowDelete(false);
  const openDelete = () => setShowDelete(true);
  const [InfoUser, setInfoUser] = useState({});
  const handleUser = (user) => {
    setInfoUser(user);
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <td>ID</td>
            <td>Username</td>
            <td>Email</td>
            <td>Role</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {props.Users.length > 0 ? (
            props.Users.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td className="crud-group-btn">
                    <Button
                      onClick={() => {
                        openView();
                        handleUser(item);
                      }}
                    >
                      Infomation
                    </Button>
                    <Button
                      onClick={() => {
                        openUpdate();
                        handleUser(item);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => {
                        openDelete();
                        handleUser(item);
                      }}
                    >
                      Delete
                    </Button>
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
        <UpdateUser handleUsers={props.handleUsers} isShowUpdate={isShowUpdate} closeUpdate={closeUpdate} openUpdate={openUpdate} InfoUser={InfoUser} />
        <ViewUser isShowView={isShowView} closeView={closeView} openView={openView} InfoUser={InfoUser} />
        <DeleteUser isShowDelete={isShowDelete} closeDelete={closeDelete} openDelete={openDelete} InfoUser={InfoUser} handleUsers={props.handleUsers} />
      </>
    </>
  );
};
