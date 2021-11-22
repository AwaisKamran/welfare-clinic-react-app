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
  Button,
} from "antd";

function Header({ loadInventory = (f) => f }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [medicineName, setMedicineName] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [fieldError, setFieldError] = useState(false);
  const [fieldErrorMessage, setFieldErrorMessage] = useState(null);

  const history = useHistory();

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
    loadInventory();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={() => logout()}>Log Out</span>
      </Menu.Item>
    </Menu>
  );

  const logout = () => {
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
          type: "Local Inventory",
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

  return (
    <div className="header-container">
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title={<HeaderTitle />}
        subTitle="Inventory Details"
        extra={[
          <span className="add-icon material-icons" onClick={showModal}>
            add
          </span>,
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
          onChange={(event) => handleQuantity(event)}
          className="field"
          type="number"
          placeholder="Enter Minimum Threshold"
        />

        {fieldError && <div className="error-message">{fieldErrorMessage}</div>}
      </Modal>
    </div>
  );
}

export default Header;
