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

function Home() {
  const [medicines, setMedicines] = useState([]);
  const [medicinesData, setMedicinesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medicineFilter, setMedicineFilter] = useState(null);
  const [medicineTypeFilter, setMedicineTypeFilter] = useState(null);
  const [brandNameFilter, setBrandNameFilter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDispenseModalVisible, setIsDispenseModalVisible] = useState(false);
  const [isMedicineEditModalVisible, setIsMedicineEditModalVisible] = useState(
    false
  );

  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [currentType, setCurrentType] = useState(null);
  const [currentStrength, setCurrentStrength] = useState(null);
  const [currentMinimumThreshold, setCurrentMinimumThreshold] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [newQuantity, setNewQuantity] = useState(0);
  const [medicineToBeUpdated, setMedicineToBeUpdated] = useState(null);
  const [isDispensable, setIsDispensable] = useState(false);

  const [fieldError, setFieldError] = useState(false);
  const [fieldErrorMessage, setFieldErrorMessage] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMedicines();
  }, []);

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
          updatedBy: item.quantityUpdatedBy || "None",
          updatedAt: item.quantityUpdatedAt || "None",
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
    "Ear Drop",
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
      title: "Strength",
      dataIndex: "strength",
      defaultSortOrder: "descend",
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
      title: "Minimum Threshold",
      dataIndex: "minimumThreshold",
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
              className="edit margin-right"
              onClick={() => handleMedicineFieldEditOperation(record)}
            >
              <span class="material-icons">edit</span>
            </Typography.Link>

            <Typography.Link
              className="edit margin-right"
              onClick={() => handleMedicineEditoperation(record)}
            >
              <span class="material-icons">shopping_cart</span>
            </Typography.Link>

            <Typography.Link
              className="edit"
              onClick={() => handleMedicineDispenseOperation(record)}
            >
              <span class="material-icons">healing</span>
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

  function handleMedicineFieldEditOperation({
    id,
    minimumThreshold,
    company,
    brand,
    type,
    strength,
  }) {
    setMedicineToBeUpdated(id);
    setCurrentMinimumThreshold(minimumThreshold);
    setCurrentCompany(company);
    setCurrentBrand(brand);
    setCurrentType(type);
    setCurrentStrength(strength);
    setIsMedicineEditModalVisible(true);
  }

  function handleMedicineChange(name) {
    setMedicineFilter(name);
  }

  function handleMedicineTypeChange(name) {
    setMedicineTypeFilter(name);
  }

  function handleBrandNameChange(name) {
    setBrandNameFilter(name);
  }

  function handleFilter() {
    if (medicineFilter || medicineTypeFilter || brandNameFilter) {
      let data = [...medicines];

      if (medicineFilter) {
        data = data.filter((item) => item.name === medicineFilter);
      }

      if (medicineTypeFilter) {
        data = data.filter((item) => item.type === medicineTypeFilter);
      }

      if (brandNameFilter) {
        data = data.filter((item) => item.brand === brandNameFilter);
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
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDispenseModalVisible(false);
    setStockQuantity(0);
    setCurrentQuantity(0);
    setCurrentType(null);
    setCurrentBrand(null);
    setCurrentCompany(null);
    setCurrentMinimumThreshold(0);
    setNewQuantity(0);
    setMedicineToBeUpdated(null);
    setIsDispensable(false);
    setIsMedicineEditModalVisible(false);
  };

  const handleEditMedicineOk = () => {
    let request = {
      data: {
        id: medicineToBeUpdated,
        minimumThreshold: currentMinimumThreshold,
        company: currentCompany,
        brand: currentBrand,
        strength: currentStrength,
        type: currentType,
      },
    };

    setLoading(true);

    axios
      .post(
        "https://rahatmaqsoodclinic.com/management/api/inventory/updateInventoryById.php",
        request
      )
      .then(function (response) {
        openNotificationWithIcon(
          "success",
          "Medical Inventory has been updated."
        );
        fetchMedicines();
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
    setCurrentType(null);
    setCurrentBrand(null);
    setCurrentCompany(null);
    setCurrentMinimumThreshold(0);
    setNewQuantity(0);
    setMedicineToBeUpdated(null);
    setIsDispensable(false);
    setIsMedicineEditModalVisible(false);
  };

  const handleOk = () => {
    let request = {
      data: {
        id: medicineToBeUpdated,
        quantity: isDispensable ? stockQuantity * -1 : stockQuantity,
        quantityUpdatedBy: localStorage.getItem("userType"),
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
        fetchMedicines();
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
      <Header loadInventory={fetchMedicines} />

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

        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select Brand Name"
          optionFilterProp="children"
          className="search-dropdown"
          onChange={handleBrandNameChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          allowClear
        >
          {medicines.map((medicine) => (
            <Option key={medicine.id} value={medicine.brand}>
              {medicine.brand}
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

      <Modal
        title="Edit Medicine Fields"
        visible={isMedicineEditModalVisible}
        onOk={handleEditMedicineOk}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose={true}
      >
        <Input
          type="number"
          className="field"
          placeholder="Minimum Threshold"
          addonBefore="Minimum Threshold"
          value={currentMinimumThreshold}
          onChange={(event) => setCurrentMinimumThreshold(event.target.value)}
        />

        <Input
          className="field"
          type="text"
          placeholder="Company"
          addonBefore="Company"
          value={currentCompany}
          onChange={(event) => setCurrentCompany(event.target.value)}
        />

        <Input
          className="field"
          type="text"
          placeholder="Strength"
          addonBefore="Strength"
          value={currentStrength}
          onChange={(event) => setCurrentStrength(event.target.value)}
        />

        <Input
          className="field"
          type="text"
          placeholder="Brand"
          addonBefore="Brand"
          value={currentBrand}
          onChange={(event) => setCurrentBrand(event.target.value)}
        />

        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select Medicine Type"
          optionFilterProp="children"
          className="field"
          value={currentType}
          onChange={(event) => setCurrentType(event)}
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
      </Modal>

      <Footer />
    </div>
  );
}

export default Home;
