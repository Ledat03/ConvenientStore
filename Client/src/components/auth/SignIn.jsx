import React from "react";
import { Button } from "../common/Button";
import { Link } from "react-router-dom";
const SignIn = () => {
  return (
    <div className="rootSignIn">
      <form action="" className="FormSignIn">
        <h2>Sign In</h2>
        <input className="txt-SignIn" type="text" placeholder="Username" />
        <input className="txt-SignIn" type="password" placeholder="Password" />
        <div className="SignIn-Option">
          <div className="rememberMe">
            <input type="checkbox" />
            <span>Remember Me</span>
          </div>
          <a href="">Forgot Password ?</a>
        </div>
        <Button label={"Sign In"} />
        <span>
          You don't have an account ?
          <strong>
            <Link to="/register">Register</Link>
          </strong>
        </span>
      </form>
    </div>
  );
};

export default SignIn;
