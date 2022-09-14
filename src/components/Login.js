import axios from "axios";
import React from "react";

class Login extends React.Component {

  setCookie(name, value, mins) {
    var expires = "";
    if (mins) {
      var date = new Date();
      date.setTime(date.getTime() + mins  * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }

  validate = async () =>{
    const token = this.getCookie("token")
    console.log(token);
    try {
      const data = await axios.get(`http://localhost:8100/api/validate`, { headers: {"Authorization" : `Bearer ${token}`} })
      this.setCookie("loggedIn", true,30)
    } catch (error) {
      alert("User Not Authourized please try logging in again")
      this.setCookie("token",null)
      this.setCookie("loggedIn", null)
      this.setCookie("user",null)
      
    }
  }

  login = async () => {
    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;
    if(email !== "" && pass !== ""){
      try {
        const token  =  await (await axios.post('http://localhost:8100/api/authenticate',{userName: email, password: pass})).data
        console.log(token);
        this.setCookie("token",token,30)
        this.setCookie("user",email,30)
        await this.validate()
        const loggedIn = this.getCookie("loggedIn")
        if (loggedIn) {
          window.location.pathname="/"
        }else{
          alert("Invalid Details")
        }

      } catch (error) {
        alert("Invalid Username or Password")
      }
    }
    else{
        alert("Please Enter Username or Password")
    }
  }

  render() {
    return (
      <div className="container-fluid mt-5 d-flex justify-content-center text-white ">
        <div
          class="card  bg-secondary"
          style={{ width: "25rem", borderRadius: "30px" }}
        >
          <div class="card-body">
            <h5 class="card-title fs-2 fw-bold">Login</h5>
            <div class="form-floating mt-3 mb-3">
              <input
                type="text"
                class="form-control bg-secondary"
                id="email"
                placeholder="name@example.com"
                style={{ borderRadius: "40px" }}
              />
              <label for="floatingInput">Username</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control bg-secondary"
                id="pass"
                placeholder="Password"
                style={{ borderRadius: "40px" }}
              />
              <label for="floatingPassword">Password</label>
            </div>
            <button
              onClick={this.login}
              class="btn btn-outline-light align-items-end"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
