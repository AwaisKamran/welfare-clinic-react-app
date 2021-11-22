import React, { useState, useEffect } from "react";
import "./SetPort.css";
import { Select } from "antd";
import "antd/dist/antd.css";
import { config } from "../../constants";

const { Option } = Select;

function SetInventory({ ports, setActivePort, setActiveUser }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(`${config.url}/api/user`)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setIsLoaded(true);
          setUsers(result);
        },
        (error) => {
          console.log(error.message);
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  function handleNameChange(userName) {
    setActiveUser(userName);
  }

  function handlePortChange(portId) {
    setActivePort(portId);
  }

  return (
    <div class="set-port-container">
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select Your Name"
        optionFilterProp="children"
        className="port-dropdown"
        onChange={handleNameChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        allowClear
      >
        {users.map((user) => (
          <Option key={user._id} value={user.name}>
            {user.name}
          </Option>
        ))}
      </Select>

      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select the port"
        optionFilterProp="children"
        className="port-dropdown"
        onChange={handlePortChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        allowClear
      >
        {ports.map((port) => (
          <Option key={port._id} value={port._id}>
            {port.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default SetInventory;
