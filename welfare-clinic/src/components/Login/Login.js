import { useRef, useState } from "react";
import "./Login.css";
import { Input, Button } from "antd";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Footer from "../Footer/Footer";

function Login() {
  const email = useRef(null);
  const password = useRef(null);
  const history = useHistory();
  const [error, setError] = useState(null);
  const [hasError, setHasError] = useState(false);

  const handleLogin = () => {
    let request = {
      data: {
        email: email.current.state.value,
        password: password.current.state.value,
      },
    };

    axios
      .post(
        "https://rahatmaqsoodclinic.com/management/api/users/verifyUser.php",
        request
      )
      .then((response) => {
        if (response.data.success) {
          setHasError(false);
          setError(null);
          localStorage.setItem("userType", response.data.data.type);
          history.push("/inventory");
        } else {
          setHasError(true);
          setError("Invalid username or password.");
        }
      });
  };

  return (
    <div className="login-container">
      <div className="login-block">
        <center>
          <div class="login-title-container">
            <div className="login-title-icon material-icons">
              nightlight_round
            </div>
            <div className="login-title-text">Rahat Maqsood Clinic</div>
          </div>
        </center>

        <Input
          ref={email}
          type="email"
          className="field"
          placeholder="Enter your email here"
        />

        <Input
          ref={password}
          className="field"
          type="password"
          placeholder="Enter your password here"
        />

        {hasError && <div class="error-message">{error}</div>}

        <Button
          onClick={handleLogin}
          className="icon-button field"
          type="primary"
        >
          Login
        </Button>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
