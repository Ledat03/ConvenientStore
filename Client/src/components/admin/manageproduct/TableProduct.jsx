import { useState } from "react";
import { Table, Button } from "react-bootstrap";
import DeleteProduct from "./DeleteProduct";
import UpdateProduct from "./UpdateProduct";
import ViewProduct from "./ViewProduct";
const TableProduct = (props) => {
  const [isShowUpdate, setShowUpdate] = useState(false);
  const [isShowView, setShowView] = useState(false);
  const [isShowDelete, setShowDelete] = useState(false);
  const closeUpdate = () => setShowUpdate(false);
  const openUpdate = () => setShowUpdate(true);
  const closeView = () => setShowView(false);
  const openView = () => setShowView(true);
  const closeDelete = () => setShowDelete(false);
  const openDelete = () => setShowDelete(true);
  const [InfoProduct, setInfoProduct] = useState({});
  const handleProduct = (product) => {
    setInfoProduct(product);
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
          {/* {props.Users.length > 0 ? (
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
          )} */}
          <tr>
            <td colSpan={4}> System doesn't have any user </td>
          </tr>
        </tbody>
      </Table>
      <>
        <UpdateProduct handleUsers={props.handleUsers} isShowUpdate={isShowUpdate} closeUpdate={closeUpdate} openUpdate={openUpdate} InfoUser={InfoProduct} />
        <ViewProduct isShowView={isShowView} closeView={closeView} openView={openView} InfoUser={InfoProduct} />
        <DeleteProduct isShowDelete={isShowDelete} closeDelete={closeDelete} openDelete={openDelete} InfoUser={InfoProduct} handleUsers={props.handleUsers} />
      </>
    </>
  );
};
export default TableProduct;
