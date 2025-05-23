import React from "react";
import { Button } from "../common/Button";

export const SignUp = () => {
  return (
    <div className="SignUp-Container">
      <form className="form-SignUp" action="" method="post">
        <h1>Sign Up</h1>
        <div className="Name-Info">
          <input className="info-SignUp" type="text" placeholder="FirstName" />
          <input className="info-SignUp" type="text" placeholder="Last Name" />
        </div>
        <input className="info-SignUp" type="text" placeholder="Email" />
        <input className="info-SignUp" type="text" placeholder="Username" />
        <input className="info-SignUp" type="password" placeholder="Password" />
        <input className="info-SignUp" type="text" placeholder="Phone Number" />
        <div id="rule">
          <input type="checkbox" />
          <span>
            You agreed with our <a href="">Policy and Service</a>
          </span>
        </div>
        <Button label={"Sign Up"} />
      </form>
    </div>
  );
};
