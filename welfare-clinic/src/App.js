import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";

import "antd/dist/antd.css";
import "./App.css";
import { useState } from "react";

function App() {
  const [refresh, setRefresh] = useState(false);

  const loadInventory = () => {
    setRefresh(true);
    setRefresh(false);
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/inventory">
            <Home loadInventory={loadInventory} refresh={refresh} />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
