import React from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Route from "./components/Route";
import Home from "./components/Home";
import Driver from "./components/Driver";
import Booking from "./components/Booking";
import axios from "axios";
import Vehicle from "./components/Vehicle";

class App extends React.Component {
  // setCookie(name, value, mins) {
  //   var expires = "";
  //   if (mins) {
  //     var date = new Date();
  //     date.setTime(date.getTime() + mins  * 60 * 60 * 1000);
  //     expires = "; expires=" + date.toUTCString();
  //   }
  //   document.cookie = name + "=" + (value || "") + expires + "; path=/";
  // }

  // getCookie(name) {
  //   var nameEQ = name + "=";
  //   var ca = document.cookie.split(";");
  //   for (var i = 0; i < ca.length; i++) {
  //     var c = ca[i];
  //     while (c.charAt(0) == " ") c = c.substring(1, c.length);
  //     if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  //   }
  //   return null;
  // }

  // validate = async(token) => {
  //   const res = await axios.get("http://localhost:8100/api/validate" ,{

  //   })
  // }

  // componentDidMount() {
  //   const token = this.getCookie(token)
  //   if(token){

  //   }
  // }

  render() {
    return (
      <div className="App h-100">
        <Route path="/login">
          <Navbar />
          <Login />
        </Route>
        <Route path={"/"}>
          <Navbar />
          <div className="container-fluid mt-5">
            <Home />
          </div>
        </Route>
        <Route path={"/drivers"}>
          <Navbar />
          <div className="mt-5">
            <Driver />
          </div>
        </Route>
        <Route path={"/bookings"}>
          <Navbar />
          <div className="mt-5">
            <Booking />
          </div>
        </Route>
        <Route path={"/vehicles"}>
          <Navbar />
          <div className="mt-5">
            <Vehicle />
          </div>
        </Route>
      </div>
    );
  }
}

export default App;
