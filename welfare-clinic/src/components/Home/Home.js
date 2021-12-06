import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import {
  Table,
  Select,
  Button,
  Typography,
  Modal,
  Input,
  notification,
} from "antd";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
const { Option } = Select;

function Home({ refresh, loadInventory = (f) => f }) {
  const [medicines, setMedicines] = useState([]);
  const [medicinesData, setMedicinesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medicineFilter, setMedicineFilter] = useState(null);
  const [medicineTypeFilter, setMedicineTypeFilter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDispenseModalVisible, setIsDispenseModalVisible] = useState(false);

  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [newQuantity, setNewQuantity] = useState(0);
  const [medicineToBeUpdated, setMedicineToBeUpdated] = useState(null);
  const [isDispensable, setIsDispensable] = useState(false);

  const [fieldError, setFieldError] = useState(false);
  const [fieldErrorMessage, setFieldErrorMessage] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMedicines();
  }, [refresh]);

  function fetchMedicines() {
    axios
      .get(
        "https://rahatmaqsoodclinic.com/management/api/inventory/getInventory.php"
      )
      .then((response) => {
        setLoading(false);
        let data = response.data.data;
        data = data.map((item) => ({
          ...item,
          brand: item.brand || "None",
          company: item.company || "None",
          updatedBy: item.updatedBy || "None",
          updatedAt: item.updatedAt || "None",
        }));
        setMedicines(data);
        setMedicinesData(data);
      });
  }

  const medicinesTypes = [
    "Tablet",
    "Solution",
    "Syrup",
    "Capsule",
    "Drip",
    "Pack",
    "Injection",
    "Suspension",
    "Cream",
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.quantity - b.quantity,
      render(text, record) {
        return {
          props: {
            style: {
              background:
                parseInt(text) <= record.minimumThreshold ? "#eec7d6" : "",
            },
          },
          children: <div>{text}</div>,
        };
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      defaultSortOrder: "descend",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      defaultSortOrder: "descend",
    },
    {
      title: "Company",
      dataIndex: "company",
      defaultSortOrder: "descend",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: "Updated Date",
      dataIndex: "updatedAt",
      sorter: (a, b) => a.updatedAt - b.updatedAt,
    },
    {
      title: "Updated By",
      dataIndex: "updatedBy",
      sorter: (a, b) => a.type.length - b.type.length,
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_, record) => {
        const type = localStorage.getItem("userType");
        return type === "owner" ? (
          <center>
            <Typography.Link
              className="edit"
              onClick={() => handleMedicineEditoperation(record)}
            >
              <span class="material-icons">edit</span>
            </Typography.Link>
          </center>
        ) : (
          <center>
            <Typography.Link
              className="edit"
              onClick={() => handleMedicineDispenseOperation(record)}
            >
              <span class="material-icons">healing</span>
            </Typography.Link>
          </center>
        );
      },
    },
  ];

  function handleMedicineDispenseOperation({ id, quantity }) {
    setMedicineToBeUpdated(id);
    setCurrentQuantity(quantity);
    setIsDispenseModalVisible(true);
  }

  function handleMedicineEditoperation({ id, quantity }) {
    setMedicineToBeUpdated(id);
    setCurrentQuantity(quantity);
    setIsModalVisible(true);
  }

  function handleMedicineChange(name) {
    setMedicineFilter(name);
  }

  function handleMedicineTypeChange(name) {
    setMedicineTypeFilter(name);
  }

  function handleFilter() {
    if (medicineFilter || medicineTypeFilter) {
      let data = [...medicines];

      if (medicineFilter) {
        data = data.filter((item) => item.name === medicineFilter);
      }

      if (medicineTypeFilter) {
        data = data.filter((item) => item.type === medicineTypeFilter);
      }

      setMedicinesData(data);
    } else {
      setLoading(true);
      fetchMedicines();
    }
  }

  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: type.toUpperCase(),
      description: message,
      className: type,
    });
    loadInventory();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDispenseModalVisible(false);
    setStockQuantity(0);
    setCurrentQuantity(0);
    setNewQuantity(0);
    setMedicineToBeUpdated(null);
    setIsDispensable(false);
  };

  const handleOk = () => {
    let request = {
      data: {
        id: medicineToBeUpdated,
        quantity: isDispensable ? stockQuantity * -1 : stockQuantity,
      },
    };

    axios
      .post(
        "https://rahatmaqsoodclinic.com/management/api/inventory/updateQuantityById.php",
        request
      )
      .then(function (response) {
        openNotificationWithIcon(
          "success",
          "Medical Inventory has been updated."
        );
      })
      .catch(function (ex) {
        openNotificationWithIcon(
          "error",
          "There was an error updating the inventory."
        );
      });

    setIsModalVisible(false);
    setIsDispenseModalVisible(false);
    setStockQuantity(0);
    setCurrentQuantity(0);
    setNewQuantity(0);
    setMedicineToBeUpdated(null);
    setIsDispensable(false);
  };

  const handleStockQuantity = (event) => {
    setIsDispensable(false);
    const value = event.target.value;
    if (value > 0) {
      setFieldError(false);
      setFieldErrorMessage(null);
      setStockQuantity(value);
      const newValue = parseInt(currentQuantity) + parseInt(value);
      setNewQuantity(newValue);
    } else {
      setFieldError(true);
      setFieldErrorMessage(
        "Please enter the stock quantity greater than zero."
      );
    }
  };

  const handleDispenseQuantity = (event) => {
    setIsDispensable(true);
    const value = event.target.value;
    const newValue = parseInt(currentQuantity) - parseInt(value);

    if (value > 0 && value <= parseInt(currentQuantity) && newValue >= 0) {
      setFieldError(false);
      setFieldErrorMessage(null);
      setStockQuantity(value);
      setNewQuantity(newValue);
    } else {
      setFieldError(true);
      setFieldErrorMessage(
        "Please enter the dispensed quantity greater than zero and lesser than current quantity."
      );
    }
  };

  return (
    <div className="home-container">
      <Header loadInventory={loadInventory} />

      <div className="filter-container">
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Search Medicine"
          className="search-dropdown"
          onChange={handleMedicineChange}
          allowClear
        >
          {medicines.map((medicine) => (
            <Option key={medicine.id} value={medicine.name}>
              {medicine.name}
            </Option>
          ))}
        </Select>

        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select Medicine Type"
          optionFilterProp="children"
          className="search-dropdown"
          onChange={handleMedicineTypeChange}
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

        <Button onClick={handleFilter} className="icon-button" type="primary">
          <span className="material-icons">search</span>
        </Button>
      </div>

      <Table columns={columns} dataSource={medicinesData} loading={loading} />

      <Modal
        title="Edit Medicine Quantity"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose={true}
        okButtonProps={{ disabled: fieldError }}
      >
        <Input
          type="number"
          className="field"
          placeholder="Current Quantity"
          addonBefore="Current Quantity"
          value={currentQuantity}
          disabled
        />

        <Input
          className="field"
          type="number"
          min="0"
          placeholder="Stocked Quantity"
          addonBefore="Stocked Quantity"
          onChange={(event) => handleStockQuantity(event)}
        />

        <Input
          className="field"
          type="number"
          placeholder="Updated Quantity"
          addonBefore="Updated Quantity"
          value={newQuantity}
          disabled
        />

        {fieldError && <div className="error-message">{fieldErrorMessage}</div>}
      </Modal>

      <Modal
        title="Dispense Medicine Quantity"
        visible={isDispenseModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose={true}
        okButtonProps={{ disabled: fieldError }}
      >
        <Input
          type="number"
          className="field"
          placeholder="Current Quantity"
          addonBefore="Current Quantity"
          value={currentQuantity}
          disabled
        />

        <Input
          className="field"
          type="number"
          min="0"
          placeholder="Dispensed Quantity"
          addonBefore="Dispensed Quantity"
          onChange={(event) => handleDispenseQuantity(event)}
        />

        <Input
          className="field"
          type="number"
          placeholder="Updated Quantity"
          addonBefore="Updated Quantity"
          value={newQuantity}
          disabled
        />

        {fieldError && <div className="error-message">{fieldErrorMessage}</div>}
      </Modal>

      <Footer />
    </div>
  );
}

export default Home;
