import { useState } from "react";
import { Table, Button, DropdownButton, Dropdown } from "react-bootstrap";
import DeleteProduct from "./DeleteProduct";
import UpdateProduct from "./UpdateProduct";
import ViewProduct from "./ViewProduct";
import CustomVariant from "./VariantsProduct/CustomVariant";
import { GetListVariant } from "../../../services/GetAPI";
const TableProduct = (props) => {
  const [HandleProductState, setState] = useState({
    ProdView: false,
    ProdUpdate: false,
    ProdDelete: false,
    ProdVariant: false,
  });
  const openModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: true }));
  };
  const closeModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: false }));
  };
  const [InfoItem, setInfoItem] = useState({});
  const [ListVariants, setListVariants] = useState([]);
  const handleProduct = (product) => {
    setInfoItem(product);
  };

  const getVariants = async (id) => {
    try {
      const handleVariants = await GetListVariant(id);
      setListVariants(handleVariants.data.data);
    } catch (error) {
      throw error;
    }
  };
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <td>ID</td>
            <td>Product name</td>
            <td>Category</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {props.InfoProduct.length > 0 ? (
            props.InfoProduct.map((item, index) => {
              return (
                <tr key={item.productId}>
                  <td>{item.productId}</td>
                  <td>{item.productName}</td>
                  <td>{item.category}</td>
                  <td className="crud-group-btn">
                    <Button
                      onClick={() => {
                        openModal("ProdVariant");
                        handleProduct(item);
                        getVariants(item.productId);
                        console.log(ListVariants);
                      }}
                    >
                      Chỉnh sửa thông tin
                    </Button>
                    <Button
                      onClick={() => {
                        openModal("ProdView");
                        handleProduct(item);
                      }}
                    >
                      Infomation
                    </Button>

                    <Button
                      onClick={() => {
                        openModal("ProdUpdate");
                        handleProduct(item);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => {
                        openModal("ProdDelete");
                        handleProduct(item);
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
        <UpdateProduct isShowUpdate={HandleProductState.ProdUpdate} closeUpdate={() => closeModal("ProdUpdate")} openUpdate={() => openModal("ProdUpdate")} InfoItem={InfoItem} handleProductsList={props.handleProductsList} />
        <ViewProduct isShowView={HandleProductState.ProdView} closeView={() => closeModal("ProdView")} openView={() => openModal("ProdView")} InfoItem={InfoItem} />
        <DeleteProduct isShowDelete={HandleProductState.ProdDelete} closeDelete={() => closeModal("ProdDelete")} openDelete={() => openModal("ProdDelete")} InfoItem={InfoItem} handleProductsList={props.handleProductsList} />
        <CustomVariant isShowVariant={HandleProductState.ProdVariant} closeModal={() => closeModal("ProdVariant")} InfoItem={InfoItem} ListVariants={ListVariants} getVariants={getVariants} />
      </>
    </>
  );
};
export default TableProduct;
