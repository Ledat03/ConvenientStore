import { toast } from "react-toastify";
import { Modal, Button, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import UpdateVariant from "./UpdateVariant";
import AddVariant from "./AddVariant";
import ViewVariant from "./ViewVariant";
import DeleteVariant from "./DeleteVariant";
import { FaPencilAlt, FaEraser } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import _ from "lodash";
const CustomVariant = (props) => {
  const [HandleProductState, setState] = useState({
    ProdVariantAdd: false,
    ProdVariantUpdate: false,
    ProdVariantView: false,
    ProdVariantDelete: false,
  });
  const [Variant, setVariant] = useState({});
  const fetchVariantInfo = (item) => {
    setVariant(item);
  };
  const openModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: true }));
  };
  const closeModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: false }));
  };
  return (
    <>
      <Modal show={props.isShowVariant} onHide={props.closeModal}>
        <Modal.Header closeButton>Edit</Modal.Header>
        <Modal.Body>
          <FaPlusCircle
            onClick={() => {
              openModal("ProdVariantAdd");
              fetchVariantInfo(item);
            }}
          />
          <Table hover>
            <thead>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>Hình ảnh</td>
                <td>Đơn vị tính</td>
              </tr>
            </thead>
            <tbody>
              {props.ListVariants.map((item, index) => {
                return (
                  <tr key={index} onClick={() => openModal("ProdVariantView")}>
                    <td>
                      <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                    </td>
                    <>
                      <td className="Info-Variant">
                        <img src={item.productImage[0]} width={50} height={50} />
                      </td>
                      <td>
                        <label>{item.calUnit}</label>
                      </td>
                    </>
                    <td>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchVariantInfo(item);
                          openModal("ProdVariantUpdate");
                        }}
                      >
                        <FaPencilAlt />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchVariantInfo(item);
                          openModal("ProdVariantDelete");
                        }}
                      >
                        <FaEraser />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      <UpdateVariant isShowVariant={HandleProductState.ProdVariantUpdate} openVariant={() => openModal("ProdVariantUpdate")} closeVariant={() => closeModal("ProdVariantUpdate")} InfoItem={props.InfoItem} handleProductsList={props.handleProductsList} Variant={Variant} getVariants={props.getVariants} />
      <AddVariant isShowVariant={HandleProductState.ProdVariantAdd} openVariant={() => openModal("ProdVariantAdd")} closeVariant={() => closeModal("ProdVariantAdd")} InfoItem={props.InfoItem} handleProductsList={props.handleProductsList} getVariants={props.getVariants} />
      <ViewVariant isShowVariant={HandleProductState.ProdVariantView} openVariant={() => openModal("ProdVariantView")} closeVariant={() => closeModal("ProdVariantView")} InfoItem={props.InfoItem} handleProductsList={props.handleProductsList} Variant={Variant} />
      <DeleteVariant isShowVariant={HandleProductState.ProdVariantDelete} openVariant={() => openModal("ProdVariantDelete")} closeVariant={() => closeModal("ProdVariantDelete")} InfoItem={props.InfoItem} Variant={Variant} handleProductsList={props.handleProductsList} getVariants={props.getVariants} />
    </>
  );
};
export default CustomVariant;
