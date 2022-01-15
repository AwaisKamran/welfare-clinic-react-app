import { useState, useEffect } from "react";
import "./Header.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import HeaderTitle from "../HeaderTitle/HeaderTitle";
import {
  PageHeader,
  Modal,
  Input,
  notification,
  Menu,
  Dropdown,
  Select,
} from "antd";

function Header({ loadInventory = (f) => f }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [medicineName, setMedicineName] = useState(null);
  const [brandName, setBrandName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [medicineType, setMedicineType] = useState(null);
  const [minimumThreshold, setMinimumThreshold] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [fieldError, setFieldError] = useState(false);
  const [fieldErrorMessage, setFieldErrorMessage] = useState(null);

  const history = useHistory();

  const { Option } = Select;

  useEffect(() => {
    if (quantity > 0 && medicineName) {
      setFieldError(false);
      setFieldErrorMessage(null);
    }
  }, [medicineName, quantity]);

  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: type.toUpperCase(),
      description: message,
      className: type,
    });

    setIsModalVisible(false);
    setMedicineName(null);
    setQuantity(0);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const medicinesTypes = [
    "Tablet",
    "Solution",
    "Syrup",
    "Capsule",
    "Drip",
    "Pack",
    "Ear Drop",
    "Injection",
    "Suspension",
    "Cream",
  ];

  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={() => logout()}>Log Out</span>
      </Menu.Item>
    </Menu>
  );

  const logout = () => {
    localStorage.removeItem("userType");
    history.push("/");
  };

  const handleOk = () => {
    if (medicineName && quantity > 0) {
      setFieldError(false);
      setFieldErrorMessage(null);

      let request = {
        data: {
          name: medicineName,
          quantity: quantity,
          minimumThreshold: minimumThreshold,
          quantityUpdatedBy: localStorage.getItem("userType"),
          brand: brandName,
          company: companyName,
          type: medicineType,
        },
      };

      axios
        .post(
          "https://rahatmaqsoodclinic.com/management/api/inventory/createInventory.php",
          request
        )
        .then(function (response) {
          openNotificationWithIcon(
            "success",
            "Medical Inventory has been added."
          );
          loadInventory();
        })
        .catch(function (ex) {
          openNotificationWithIcon(
            "error",
            "There was an error adding the inventory."
          );
        });
    } else {
      setFieldError(true);
      setFieldErrorMessage(
        "Please make sure you mentioned the name and quantity properly."
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleMedicineName = (event) => {
    setMedicineName(event.target.value);
  };

  const handleQuantity = (event) => {
    setQuantity(event.target.value);
  };

  const handleBrandName = (event) => {
    setBrandName(event.target.value);
  };

  const handleCompanyName = (event) => {
    setCompanyName(event.target.value);
  };

  const handleMedicineType = (name) => {
    setMedicineType(name);
  };

  const handleMinimumThreshold = (event) => {
    setMinimumThreshold(event.target.value);
  };

  return (
    <div className="header-container">
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title={<HeaderTitle />}
        subTitle="Inventory Details"
        backIcon={false}
        extra={[
          localStorage.getItem("userType") === "owner" ? (
            <span className="add-icon material-icons" onClick={showModal}>
              add
            </span>
          ) : null,
          <Dropdown overlay={menu} placement="bottomCenter">
            <span className="account-icon material-icons">account_circle</span>
          </Dropdown>,
        ]}
      />

      <Modal
        title="Create Medicine Inventory"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose={true}
        okButtonProps={{ disabled: fieldError }}
      >
        <Input
          onChange={(event) => handleMedicineName(event)}
          className="field"
          placeholder="Enter Medicine Name"
        />

        <Input
          onChange={(event) => handleQuantity(event)}
          className="field"
          type="number"
          placeholder="Enter Quantity"
        />

        <Input
          onChange={(event) => handleMinimumThreshold(event)}
          className="field"
          type="number"
          placeholder="Enter Minimum Threshold"
        />

        <Input
          onChange={(event) => handleBrandName(event)}
          className="field"
          type="text"
          placeholder="Enter Brand Name"
        />

        <Input
          onChange={(event) => handleCompanyName(event)}
          className="field"
          type="text"
          placeholder="Enter Company Name"
        />

        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select Medicine Type"
          optionFilterProp="children"
          className="field"
          onChange={(event) => handleMedicineType(event)}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          allowClear
        >
          {medicinesTypes.map((name, index) => (
            <Option key={index} value={name}>
              {name}
            </Option>
          ))}
        </Select>

        {fieldError && <div className="error-message">{fieldErrorMessage}</div>}
      </Modal>
    </div>
  );
}

export default Header;
