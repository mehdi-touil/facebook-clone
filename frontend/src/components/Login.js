import React, { useState } from "react";
import "./Login.css";
// import FacebookLogin from "react-facebook-login";
import FacebookLogin from "@greatsumini/react-facebook-login";
import config from "../config.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiURL } from "../api";
const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [isSignUpOpen, setIssSignUpOpen] = useState(false);
  const facebookResponse = async (response) => {
    const result = await axios({
      method: "POST",
      url: apiURL + "/auth/facebook",
      data: { accessToken: response.accessToken, userID: response.userID },
    });
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("user", JSON.stringify(result.data.user));
    setUser(result.data.user);
    navigate("/profile");
  };
  const testlogin = () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmVmYWU2NTYxOTc5MGU3ZTQ1YzcwNzIiLCJpYXQiOjE2NTk5ODAzNjF9.bAwvRUEWgMiblSNeS-30Bz4lsatlpqNapRm_8whqGF8";
    localStorage.setItem("token", token);
    const user = {
      _id: "62f21dbc86b471eddcd942c4",
      userID: "111534874987151",
      email: "ckftcrgfep_1659654099@tfbnw.net",
      fullname: "Donna Alhciaiagefjh Romanberg",
      imageProfileURL:
        "https://scontent-iad3-2.xx.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c15.0.50.50a_cp0_dst-jpg_p50x50&_nc_cat=1&ccb=1-7&_nc_sid=12b3be&_nc_ohc=7lFcafALaaUAX_ebZa0&_nc_ht=scontent-iad3-2.xx&edm=AP4hL3IEAAAA&oh=00_AT-TDI5JQuTb7L21H6cfdCUpUUvZjjoEi-YtjJHlOBcC9Q&oe=63178099",
      friends: [],
      invitations: [],
      coverProfileURL: "",
      id: "62f21dbc86b471eddcd942c4",
    };
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    navigate("/profile");
  };

  return (
    <div className="logincontainer">
      <div className="loginSlogan">
        <div className="logo">
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg"
            alt=""
            width="300px"
          />
        </div>
        <div className="logotext">
          Facebook helps you connect and share with the people in your life.
        </div>
      </div>
      <div className="loginForm">
        <form action="">
          <input
            type="text"
            id="email"
            placeholder="Email Adress or username"
          />
          <input type="text" id="password" placeholder="password" />
          <button>Log In</button>
          <span>
            <a href="http://" target="_blank" rel="noopener noreferrer">
              Forgotten password?
            </a>
          </span>
          <div className="endline"></div>
        </form>
        <button
          onClick={() => {
            setIssSignUpOpen((prevstate) => !prevstate);
          }}
        >
          Create Account
        </button>
        {/*<FacebookLogin
          appId={config.FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={facebookResponse}
          version="3.1"
        />*/}
        <FacebookLogin
          appId={config.FACEBOOK_APP_ID}
          initParams={{
            version: "v10.0",
            xfbml: true,
          }}
          onSuccess={(response) => {
            facebookResponse(response);
          }}
          onFail={(error) => {
            console.log("Login Failed!", error);
          }}
          onProfileSuccess={(response) => {
            console.log("Get Profile Success!", response);
          }}
          render={({ onClick, logout }) => (
            <div id="facebooklogin" onClick={onClick}>
              <img
                src="https://cdn.icon-icons.com/icons2/1826/PNG/512/4202110facebooklogosocialsocialmedia-115707_115594.png"
                width="40px"
              />
              <div>Login With Facebook</div>
            </div>
          )}
        />
        <button
          onClick={() => {
            testlogin();
          }}
        >
          Login with Test Account
        </button>
      </div>
      <div
        className="signuppage"
        style={{ display: isSignUpOpen ? "flex" : "none" }}
      >
        <div className="signupform">
          <h1>Sign Up</h1>
          <h6>It's quick and easy.</h6>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            id="closeSignup"
            onClick={() => {
              setIssSignUpOpen((prevstate) => !prevstate);
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <form action="">
            <div className="form-row">
              <input type="text" name="fname" placeholder="First name" />
              <input type="text" name="sname" placeholder="Surname" />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="username"
                placeholder="Email Adress or username"
              />
            </div>
            <div className="form-row">
              <input
                type="password"
                name="password"
                placeholder="New Password"
              />
            </div>
            <button>Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
