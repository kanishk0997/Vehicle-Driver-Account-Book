import axios from "axios";
import React from "react";

import Swal from "sweetalert2";

class Driver extends React.Component {
  state = {
    drivers: [],
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

  fetchDrivers = async () => {
    const data = await axios.get("http://localhost:8300/api/drivers/");
    console.log(data.data);
    this.setState({ drivers: data.data });
  };

  clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("licenceNumber").value = "";
    document.getElementById("vehicleType").value = "SUV";
  }

  componentDidMount() {
    this.fetchDrivers();
    this.validate()
  }

  componentDidUpdate(){
    this.validate()
  }

  ModalClose() {
    document.getElementById("close-modal").click();
    this.clearForm();
  }

  deleteDriver = async (driver) => {
    const data = await axios.delete(
      `http://localhost:8300/api/drivers/${driver.licenceNumber}`
    );
    console.log(data);
    this.fetchDrivers();
  };

  driverAdd = async (driver) => {
    if (driver === null) {
      var driverNew = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        licenceNumber: document.getElementById("licenceNumber").value,
        vehicleType: document.getElementById("vehicleType").value,
      };
      const data = await axios.post(
        "http://localhost:8300/api/drivers/",
        driverNew
      );
      console.log(data);
      this.ModalClose();
      this.fetchDrivers();
    } else {
      console.log("update");
      document.getElementById("name").value = driver.name;
      document.getElementById("age").value = driver.age;
      document.getElementById("licenceNumber").value = driver.licenceNumber;
      document.getElementById("vehicleType").value = driver.vehicleType;
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-whatever="Add Driver"
          >
            Add Driver
          </button>
        </div>
        <div>
          <div
            class="modal"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered modal-xl">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Add Driver</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <div className="ontainer-fluid">
                    <div className="row">
                      <div className="col-8">
                        <div class="form-floating mb-3">
                          <input
                            type="text"
                            class="form-control"
                            id="name"
                            placeholder="Jhon Doe"
                          />
                          <label for="name">Name</label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div class="form-floating mb-3">
                          <input
                            type="number"
                            class="form-control"
                            id="age"
                            placeholder="Age"
                          />
                          <label for="name">Age</label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div class="form-floating mb-3">
                          <input
                            type="text"
                            class="form-control"
                            id="licenceNumber"
                            placeholder="xx"
                          />
                          <label for="name">Licence Number</label>
                        </div>
                      </div>
                      <div className="col-3">
                        <div class="form-floating">
                          <select
                            class="form-select"
                            id="vehicleType"
                            aria-label="Expret In"
                          >
                            <option selected value="SUV">
                              SUV
                            </option>
                            <option value="SEDAN">SEDAN</option>
                            <option value="VAN">VAN</option>
                          </select>
                          <label for="floatingSelect">Vehicle Expertise</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    id="close-modal"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      this.driverAdd(null);
                    }}
                    type="button"
                    class="btn btn-primary"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-light" style={{ borderRadius: "20px" }}>
          <table class="table table-striped mt-5 ">
            <thead>
              <th className="">Driver Id</th>
              <th className="">First Name</th>
              <th className="">Age</th>
              <th className="">License Number</th>
              <th className="">Expert in</th>
              <th className="">Action</th>
            </thead>
            <tbody className=" table-striped">
              {this.state.drivers.map((driver, idx) => {
                return (
                  <tr key={driver.driverId} className="">
                    <td className="">{idx + 1}</td>
                    <td className="">{driver.name}</td>
                    <td className="">{driver.age}</td>
                    <td className="">{driver.licenceNumber}</td>
                    <td className="">{driver.vehicleType}</td>
                    <td className="">
                      <button
                        onClick={() => this.driverAdd(driver)}
                        className="btn btn-outline-success"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        // data-bs-whatever="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => this.deleteDriver(driver)}
                        className="btn btn-outline-danger mx-2"
                        // data-bs-whatever="Edit"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Driver;
