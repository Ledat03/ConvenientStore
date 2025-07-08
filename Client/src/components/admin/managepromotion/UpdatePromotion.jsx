import { toast } from "react-toastify";
import { Modal, Button, Form, Col, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { updatePromotion } from "../../../services/GetAPI";
import "../css/promotion.scss";
import Select from "react-select";
import _ from "lodash";
import LoadingAnimation from "../../common/LoadingAnimation";
const UpdatePromotion = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "PERCENTAGE",
    scope: "ALL",
    discountValue: 0,
    maxDiscount: 0,
    minOrderValue: 0,
    usageLimit: 0,
    userUsageLimit: 0,
    startDate: "",
    endDate: "",
    active: true,
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if (!_.isEmpty(props.InfoItem) && props.isShowUpdate) {
      if (!_.isEmpty(props.InfoItem.promotionBrand)) {
        setSelectedBrand(props.InfoItem.promotionBrand.map((brand) => brand.id));
      }
      if (!_.isEmpty(props.InfoItem.promotionCategories)) {
        setSelectedCategories(props.InfoItem.promotionCategories.map((cate) => cate.categoryId));
      }
      if (!_.isEmpty(props.InfoItem.promotionProducts)) {
        setSelectedProducts(
          props.InfoItem.promotionProducts.map((prod) => {
            return prod.productId;
          })
        );
      }
      setFormData({
        id: props.InfoItem.id,
        code: props.InfoItem.code,
        name: props.InfoItem.name,
        description: props.InfoItem.description,
        type: props.InfoItem.type,
        scope: props.InfoItem.scope,
        discountValue: props.InfoItem.discountValue,
        maxDiscount: props.InfoItem.maxDiscount,
        minOrderValue: props.InfoItem.minOrderValue,
        usageLimit: props.InfoItem.usageLimit,
        userUsageLimit: props.InfoItem.userUsageLimit,
        startDate: props.InfoItem.startDate,
        endDate: props.InfoItem.endDate,
        active: props.InfoItem.active,
      });
    }
    setIsLoading(false);
  }, [props.isShowUpdate, props.InfoItem]);
  const selectSubcategories = props.subCategories.map((item) => ({
    value: item.id,
    label: item.subCategoryName,
  }));
  const selectBrand = props.brands.map((item) => ({
    value: item.brandId,
    label: item.brandName,
  }));
  const selectCategories = props.categories.map((item) => ({
    value: item.categoryId,
    label: item.categoryName,
  }));
  const selectProducts = props.products.map((item) => ({
    value: item.productId,
    label: item.productName,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = "Vui lòng nhập mã giảm giá";
    if (!formData.name.trim()) errors.name = "Vui lòng nhập tên mã giảm giá";
    if (formData.discountValue <= 0) errors.discountValue = "Giá trị giảm phải lớn hơn 0";
    if (!formData.startDate) errors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!formData.endDate) errors.endDate = "Vui lòng chọn ngày kết thúc";
    if (formData.scope === "CATEGORY" && selectedCategories.length === 0 && selectedSubCategories.length === 0) {
      errors.scope = "Vui lòng chọn ít nhất một danh mục";
    }

    if (formData.scope === "PRODUCT" && selectedProducts.length === 0) {
      errors.scope = "Vui lòng chọn ít nhất một sản phẩm";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const promotionData = {
        ...formData,
        promotionCategories: formData.scope === "CATEGORY" ? [...selectedCategories.map((id) => ({ categoryId: id })), ...selectedSubCategories.map((id) => ({ subCategoryId: id }))] : [],
        promotionProducts: formData.scope === "PRODUCT" ? selectedProducts.map((id) => ({ productId: id })) : [],
        promotionBrand: formData.scope === "BRAND" ? selectedBrand.map((id) => ({ id: id })) : [],
        promotionSubCategory: formData.scope === "SUBCATEGORY" ? selectedSubCategories.map((id) => ({ subCategoryId: id })) : [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await updatePromotion(promotionData);
      toast.success("Thêm mã giảm giá thành công");
      handleClose();
      props.handlePromotionList();
    } catch (error) {
      toast.error("Thêm mã giảm giá thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "PERCENTAGE",
      scope: "ALL",
      discountValue: 0,
      maxDiscount: 0,
      minOrderValue: 0,
      usageLimit: 0,
      userUsageLimit: 0,
      startDate: "",
      endDate: "",
      active: true,
    });
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedProducts([]);
    setSelectedBrand([]);
    setValidationErrors({});
    props.closeUpdate();
  };
  const renderScopeSelection = () => {
    if (formData.scope === "ALL") return null;
    if (formData.scope === "CATEGORY") {
      return (
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Danh mục</Form.Label>
            <Select className="Select_Input" options={selectCategories} isMulti onChange={(option) => setSelectedCategories(option.map((opt) => opt.value))} value={selectCategories.filter((item) => selectedCategories.includes(item.value))} />
            {validationErrors.scope && <Form.Text className="text-danger">{validationErrors.scope}</Form.Text>}
          </Col>
        </Row>
      );
    }
    if (formData.scope === "SUBCATEGORY") {
      return (
        <Row className="mb-3">
          <Col>
            <Form.Label>Nhánh Sản Phẩm</Form.Label>
            <Select
              options={selectSubcategories}
              isMulti
              onChange={(option) =>
                setSelectedSubCategories(
                  option.map((opt) => {
                    return opt.value;
                  })
                )
              }
              value={selectSubcategories.filter((opt) => selectedSubCategories.includes(opt.value))}
            />

            {validationErrors.scope && <Form.Text className="text-danger">{validationErrors.scope}</Form.Text>}
          </Col>
        </Row>
      );
    }
    if (formData.scope === "BRAND") {
      return (
        <Row className="mb-3">
          <Col>
            <Form.Label>Hãng Sản Phẩm</Form.Label>
            <Select options={selectBrand} isMulti onChange={(option) => setSelectedBrand(option.map((opt) => opt.value))} value={selectBrand.filter((opt) => selectedBrand.includes(opt.value))} />
            {validationErrors.scope && <Form.Text className="text-danger">{validationErrors.scope}</Form.Text>}
          </Col>
        </Row>
      );
    }

    if (formData.scope === "PRODUCT") {
      return (
        <Row className="mb-3">
          <Col>
            <Form.Label>Sản phẩm</Form.Label>
            <Select options={selectProducts} isMulti onChange={(option) => setSelectedProducts(option.map((opt) => opt.value))} value={selectProducts.filter((opt) => selectedProducts.includes(opt.value))} />
            {validationErrors.scope && <Form.Text className="text-danger">{validationErrors.scope}</Form.Text>}
          </Col>
        </Row>
      );
    }

    return null;
  };

  return (
    <>
      <Modal size="xl" show={props.isShowUpdate} onHide={props.closeUpdate}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật mã giảm giá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Mã giảm giá</Form.Label>
                  <Form.Control name="code" value={formData.code} onChange={handleInputChange} placeholder="Nhập mã giảm giá" isInvalid={!!validationErrors.code} />
                  <Form.Control.Feedback type="invalid">{validationErrors.code}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Tên mã giảm giá</Form.Label>
                  <Form.Control name="name" value={formData.name} onChange={handleInputChange} placeholder="Nhập tên mã giảm giá" isInvalid={!!validationErrors.name} />
                  <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Loại giảm giá</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  >
                    <option value="PERCENTAGE">Giảm theo %</option>
                    <option value="FIXED_AMOUNT">Giảm giá cố định</option>
                    <option value="FREE_SHIPPING">Miễn phí vận chuyển</option>
                  </Form.Select>
                </Form.Group>
                {console.log(formData.scope)}
                <Form.Group as={Col}>
                  <Form.Label>Phạm vi áp dụng</Form.Label>
                  <Form.Select
                    name="scope"
                    value={formData.scope}
                    onChange={(e) => {
                      return handleInputChange(e);
                    }}
                  >
                    <option value="ALL">Tất cả sản phẩm</option>
                    <option value="CATEGORY">Theo danh mục</option>
                    <option value="SUBCATEGORY">Theo nhánh sản phẩm</option>
                    <option value="BRAND">Theo nhãn hàng</option>
                    <option value="PRODUCT">Theo sản phẩm</option>
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Nhập mô tả" />
                </Form.Group>
                <Form.Group as={Col}>{renderScopeSelection()}</Form.Group>
              </Row>

              <Row className="mb-3">
                {formData.type !== "FREE_SHIPPING" && (
                  <>
                    <Form.Group as={Col}>
                      <Form.Label>{formData.type === "PERCENTAGE" ? "Giá trị ( % )" : "Giá trị (Số Nguyên)"}</Form.Label>
                      <Form.Control type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} isInvalid={!!validationErrors.discountValue} />
                      <Form.Control.Feedback type="invalid">{validationErrors.discountValue}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Giảm tối đa</Form.Label>
                      <Form.Control type="number" name="maxDiscount" value={formData.maxDiscount} onChange={handleInputChange} />
                    </Form.Group>
                  </>
                )}

                <Form.Group as={Col}>
                  <Form.Label>Giá trị đơn tối thiểu</Form.Label>
                  <Form.Control type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Số lượt sử dụng tối đa</Form.Label>
                  <Form.Control type="number" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Giới hạn sử dụng/người</Form.Label>
                  <Form.Control type="number" name="userUsageLimit" value={formData.userUsageLimit} onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <Form.Control type="datetime-local" name="startDate" value={formData.startDate} onChange={handleInputChange} isInvalid={!!validationErrors.startDate} />
                  <Form.Control.Feedback type="invalid">{validationErrors.startDate}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <Form.Control type="datetime-local" name="endDate" value={formData.endDate} onChange={handleInputChange} isInvalid={!!validationErrors.endDate} />
                  <Form.Control.Feedback type="invalid">{validationErrors.endDate}</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  name="active"
                  label="Kích hoạt"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      active: e.target.checked,
                    }))
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
              props.closeUpdate();
            }}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              "Thêm mã giảm giá"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdatePromotion;
