import React from "react";
import axios from "axios";

class Navbar extends React.Component {
  state = {
    isLoggedIn: false,
  };

  setCookie(name, value, mins) {
    var expires = "";
    if (mins) {
      var date = new Date();
      date.setTime(date.getTime() + mins * 60 * 60 * 1000);
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
      this.setState({isLoggedIn: true})
    } catch (error) {
      alert("User Not Authourized please try logging in again")
      this.setCookie("token",null)
      this.setCookie("loggedIn", null)
      this.setCookie("user",null)
      if (window.location.pathname !== "/login") {
        window.location.pathname='/login'
      }
    }
  }

  componentDidMount(){
    this.validate()
    
  }

  logout() {
    this.setCookie("token", "")
    this.setCookie("user", "")
    this.setCookie("loggedIn" , "")
    this.setState({isLoggedIn: false})
    window.location.pathname="/login"
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <span className="navbar-brand mb-0 h1">
              Vehicle Driver Account Book
            </span>
          </a>

          {this.state.isLoggedIn ? (
            <div>
              <span
                class="btn text-bg-secondary mx-3"
                style={{ borderRadius: "20px" }}
              >
                {this.getCookie("user")}
              </span>
              <button onClick={()=>this.logout()} className="btn btn-primary">
                Logout
              </button>
            </div>
          ) : null}
        </div>
        <div></div>
      </nav>
    );
  }
}

export default Navbar;
