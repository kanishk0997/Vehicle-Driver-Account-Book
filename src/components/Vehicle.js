import axios from "axios";
import React from "react";

import Swal from "sweetalert2";

class Vehicle extends React.Component {
  state = {
    vehicles: [],
    update: false,
    id: "",
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

  fetchvehicles = async () => {
    const data = await axios.get("http://localhost:8400/api/vehicledetail");
    console.log(data.data);
    this.setState({ vehicles: data.data });
  };

  clearForm() {
    document.getElementById("modelName").value = "";
    document.getElementById("registrationNumber").value = "";
    document.getElementById("vehicleType").value = "VAN";
    document.getElementById("numberOfSeats").value = "";
    document.getElementById("acAvailable").value = "false";
  }

  componentDidMount() {
    this.fetchvehicles();
    this.validate()
  }

  componentDidUpdate(){
    this.validate()
  }

  ModalClose() {
    document.getElementById("close-modal").click();
    this.clearForm();
  }

  deletevehicle = async (vehicle) => {
    const data = await axios.delete(
      `http://localhost:8400/api/delete/${vehicle.registrationNo}`
    );
    console.log(data);
    this.fetchvehicles();
  };

  vehicleAdd = async (vehicle) => {
    if (vehicle === null) {
      var vehicleNew = {
        modelName: document.getElementById("modelName").value,
        registrationNo: document.getElementById("registrationNumber").value,
        vehicleType: document.getElementById("vehicleType").value,
        numberOfSeat: document.getElementById("numberOfSeats").value,
        acAvailable: document.getElementById("acAvailable").value,
      };
      if (this.state.update) {
        const data = await axios.put(
          `http://localhost:8400/api/update/${this.state.id}`,
          vehicleNew
        );
        console.log(data);
        this.setState({ update: false, id: "" });
      } else {
        const data = await axios.post(
          "http://localhost:8400/api/vehicledetails",
          vehicleNew
        );
        console.log(data);
      }
      this.ModalClose();
      this.fetchvehicles();
    } else {
      console.log("update");
      document.getElementById("modelName").value = vehicle.modelName;
      document.getElementById("registrationNumber").value =
        vehicle.registrationNo;
      document.getElementById("vehicleType").value = vehicle.vehicleType;
      document.getElementById("numberOfSeats").value = vehicle.numberOfSeat;
      document.getElementById("acAvailable").value = vehicle.acAvailable;
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
            data-bs-whatever="Add vehicle"
          >
            Add vehicle
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
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Add vehicle</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      this.setState({ update: false, id: "" });
                      this.clearForm();
                    }}
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
                            id="registrationNumber"
                            placeholder="Jhon Doe"
                          />
                          <label for="registrationNumber">
                            Registration Number
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div class="form-floating mb-3">
                          <input
                            type="text"
                            class="form-control"
                            id="modelName"
                            placeholder="modelName"
                          />
                          <label for="modelName">Model Name</label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4">
                        <div class="form-floating mb-3">
                          <input
                            type="text"
                            class="form-control"
                            id="numberOfSeats"
                            placeholder="xx"
                          />
                          <label for="numberOfSeats">Number of Seats</label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div class="form-floating">
                          <select
                            class="form-select"
                            id="vehicleType"
                            aria-label="vehicleType"
                          >
                            <option selected value="SUV">
                              SUV
                            </option>
                            <option value="SEDAN">SEDAN</option>
                            <option value="VAN">VAN</option>
                          </select>
                          <label for="vehicleType">Vehicle Type</label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div class="form-floating">
                          <select
                            class="form-select"
                            id="acAvailable"
                            aria-label="acAvailable"
                          >
                            <option value={true}>Available</option>
                            <option value={false}>Not Available</option>
                          </select>
                          <label for="acAvailable">Ac Available</label>
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
                    onClick={() => {
                      this.setState({ update: false, id: "" });
                      this.clearForm();
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      this.vehicleAdd(null);
                    }}
                    type="button"
                    class="btn btn-primary"
                  >
                    {this.state.update ? "update" : "save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-light" style={{ borderRadius: "20px" }}>
          <table class="table table-striped mt-5 ">
            <thead>
              <th className="">Vehicle Id</th>
              <th className="">Model</th>
              <th className="">Vehicle Type</th>
              <th className="">Registration Number</th>
              <th className="">Number Of Seats</th>
              <th className="">Ac Available</th>
            </thead>
            <tbody className=" table-striped">
              {this.state.vehicles.map((vehicle) => {
                return (
                  <tr key={vehicle.vehicleId} className="">
                    <td className="">{vehicle.id}</td>
                    <td className="">{vehicle.modelName}</td>
                    <td className="">{vehicle.vehicleType}</td>
                    <td className="">{vehicle.registrationNo}</td>
                    <td className="">{vehicle.numberOfSeat}</td>
                    <td className="">
                      {vehicle.acAvailable ? (
                        <span class="badge text-bg-success"> </span>
                      ) : (
                        <span class="badge text-bg-danger"> </span>
                      )}
                    </td>
                    <td className="">
                      <button
                        onClick={() => {
                          this.vehicleAdd(vehicle);
                          this.setState({ update: true, id: vehicle.id });
                        }}
                        className="btn btn-outline-success"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        // data-bs-whatever="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => this.deletevehicle(vehicle)}
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

export default Vehicle;
