import React from "react";
import axios from "axios";

class Home extends React.Component {
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
  validate = async () => {
    const token = this.getCookie("token");
    console.log(token);
    try {
      const data = await axios.get(`http://localhost:8100/api/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setCookie("loggedIn", true, 30);
    } catch (error) {
      alert("User Not Authourized please try logging in again");
      this.setCookie("token", null);
      this.setCookie("loggedIn", null);
      this.setCookie("user", null);
      window.location.pathname = "/login";
    }
  };

  componentDidMount() {
    this.validate();
  }

  render() {
    return (
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <div class="col">
          <a href="/drivers" style={{ textDecoration: "none", color: "black" }}>
            <div class="card h-100 " style={{ backgroundColor: "lavender" }}>
              <img
                src="data:image/jpeg;base64,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"
                class="card-img-top"
                alt="..."
              />
              <div class="card-body">
                <h5 class="card-title">Drivers</h5>
                <p class="card-text ">
                  Click here to get details of all thedrivers working under the
                  company.
                  <br /> You can also add and delete drivers and edit thier
                  details....
                </p>
              </div>
              <div class="card-footer">
                <small class="text-muted"></small>
              </div>
            </div>
          </a>
        </div>
        <div class="col">
          <a
            href="/vehicles"
            style={{ textDecoration: "none", color: "black" }}
          >
            <div class="card h-100" style={{ backgroundColor: "lavender" }}>
              <img
                src="https://m.economictimes.com/thumb/msid-92811339,width-1200,height-900,resizemode-4,imgsize-67386/luxury-vehicle-sales-in-india-grew-in-strong-double-digits-in-first-half-of-2022.jpg"
                class="card-img-top"
                alt="..."
              />
              <div class="card-body">
                <h5 class="card-title">Vehicles</h5>
                <p class="card-text">
                  Click here to get details of all the vehicles working under
                  the company.
                  <br /> You can also add and delete Vehicles and edit thier
                  details....
                </p>
              </div>
              <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </a>
        </div>
        <div class="col">
          <a
            href="/bookings"
            style={{ textDecoration: "none", color: "black" }}
          >
            <div class="card h-100" style={{ backgroundColor: "lavender" }}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ5XIoKqwMSuUAiq1FihairB-vt4iv6HKtAw&usqp=CAU"
                class="card-img-top"
                alt="..."
              />
              <div class="card-body">
                <h5 class="card-title">Booking</h5>
                <p class="card-text">
                  This is a wider card with supporting text below as a natural
                  lead-in to additional content. This card has even longer
                  content than the first to show that equal height action.
                </p>
              </div>
              <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

export default Home;
