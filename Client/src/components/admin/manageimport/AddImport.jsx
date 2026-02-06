import { Modal, Button, Form, Col, Row, Spinner, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { fetchListProduct, addImport } from "../../../services/GetAPI";
const AddImport = ({ isActive, close, handleReload, getListImport }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [User, setUser] = useState({});
  const [formImport, setFormImport] = useState({
    importCode: "",
    importNote: "",
  });
  const handleUser = () => {
    const temp = localStorage.getItem("user");
    setUser(JSON.parse(temp));
  };
  const clearImport = () => {
    setFormImport({ importCode: "", importNote: "" });
    setSelectedItems([]);
  };
  const [newItem, setNewItem] = useState({
    product: null,
    variant: null,
    quantity: 1,
    cost_price: 0,
  });
  const fetchProducts = async () => {
    const res = await fetchListProduct();
    console.log(res);
    setProducts(res.data.data);
  };

  useEffect(() => {
    if (isActive.addImport) {
      fetchProducts();
      handleUser();
    }
  }, [isActive.addImport]);

  const handleAddItem = () => {
    if (!newItem.product || !newItem.variant || newItem.quantity <= 0 || newItem.cost_price <= 0) {
      toast.warn("Vui lòng nhập đầy đủ thông tin mặt hàng");
      return;
    }
    setSelectedItems([...selectedItems, newItem]);
    setNewItem({
      product: null,
      variant: null,
      quantity: 1,
      cost_price: 0,
    });
  };
  const handleRemoveItem = (index) => {
    const list = [...selectedItems];
    list.splice(index, 1);
    setSelectedItems(list);
  };
  const handleSubmit = async () => {
    if (!formImport.importCode) {
      toast.error("Vui lòng nhập Mã phiếu nhập hàng");
      return;
    }

    if (selectedItems.length === 0) {
      toast.warn("Vui lòng thêm ít nhất một mặt hàng");
      return;
    }

    const payload = {
      importId: 0,
      importCode: formImport.importCode,
      importNote: formImport.importNote,
      userId: User.id,
      inventoryImportDetails: selectedItems.map((item) => ({
        productId: item.product.productId,
        variantId: item.variant.id,
        quantity: item.quantity,
        cost_price: item.cost_price,
        total_cost: item.quantity * item.cost_price,
      })),
    };

    try {
      await addImport(payload);
      setIsLoading(true);
      getListImport();
      toast.success("Thêm đơn nhập hàng thành công!");
      clearImport();
      close();
      handleReload && handleReload();
    } catch (e) {
      toast.error("Có lỗi xảy ra khi thêm đơn nhập hàng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isActive.addImport} size="xl" onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm Phiếu Nhập Hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <Form>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Mã phiếu nhập</Form.Label>
                    <Form.Control value={formImport.importCode} onChange={(e) => setFormImport({ ...formImport, importCode: e.target.value })} placeholder="Ví dụ: NK20240630-01" />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Ghi chú</Form.Label>
                    <Form.Control value={formImport.importNote} onChange={(e) => setFormImport({ ...formImport, importNote: e.target.value })} placeholder="Ghi chú thêm cho phiếu nhập (nếu có)" />
                  </Form.Group>
                </Col>
              </Row>

              <hr />
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label>Sản phẩm</Form.Label>
                  <Select
                    options={products.map((product) => ({ value: product, label: product.productName }))}
                    onChange={(opt) => {
                      setNewItem({ ...newItem, product: opt.value, variant: null });
                    }}
                    value={newItem.product ? { value: newItem.product, label: newItem.product.productName } : null}
                  />
                </Col>
                <Col md={3}>
                  <Form.Label>Biến thể</Form.Label>
                  <Select
                    options={(newItem.product ? newItem.product.productVariant : []).map((v) => ({
                      value: v,
                      label: `${v.calUnit} - ${v.skuCode}`,
                    }))}
                    onChange={(opt) => {
                      setNewItem({ ...newItem, variant: opt.value });
                    }}
                    value={newItem.variant ? { value: newItem.variant, label: `${newItem.variant.calUnit} - ${newItem.variant.skuCode}` } : null}
                  />
                </Col>
                <Col md={2}>
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control type="number" min={1} value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value || 1) })} />
                </Col>
                <Col md={2}>
                  <Form.Label>Giá nhập</Form.Label>
                  <Form.Control type="number" value={newItem.cost_price} onChange={(e) => setNewItem({ ...newItem, cost_price: parseFloat(e.target.value || 0) })} />
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  <Button variant="success" onClick={handleAddItem}>
                    Thêm
                  </Button>
                </Col>
              </Row>

              <Table bordered className="mt-3">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th>Biến thể</th>
                    <th>Số lượng</th>
                    <th>Giá nhập</th>
                    <th>Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.product.productName}</td>
                      <td>{`${item.variant.calUnit} - ${item.variant.skuCode}`}</td>
                      <td>{item.quantity}</td>
                      <td>{item.cost_price?.toLocaleString()}</td>
                      <td>{(item.quantity * item.cost_price)?.toLocaleString()}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleRemoveItem(idx)}>
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Đang thêm..." : "Lưu Phiếu Nhập"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddImport;
