import axios from "axios";
import React from "react";

import Swal from "sweetalert2";

class Booking extends React.Component {
  state = {
    bookings: [],
    vehicles: [],
    drivers: [],
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

  fetchBookings = async () => {
    const data = await axios.get("http://localhost:8200/api/booking/");
    console.log(data.data);
    this.setState({ bookings: data.data });
  };

  fetchDrivers = async (type) => {
    switch (type) {
      case "SEDAN":
        const data = await axios.get("http://localhost:8300/api/drivers/");
        console.log(data.data);
        this.setState({ drivers: data.data });
        break;
      case "SUV":
        try {
          const res1 = await axios.get(`http://localhost:8300/api/drivers/SUV`);
          this.setState({ drivers: res1.data });
        } catch (error) {
          alert("No SUV Driver");
        }
        try {
          const res2 = await axios.get("http://localhost:8300/api/drivers/VAN");
          const x = res2.data.concat(this.state.drivers);
          this.setState({ drivers: x });
        } catch (error) {
          console.log(error);
          alert("No VAN Driver");
        }

        break;
      case "VAN":
        try {
          const res3 = await axios.get(`http://localhost:8300/api/drivers/VAN`);
          this.setState({ drivers: res3.data });
        } catch (error) {
          alert("No VAN Driver");
          console.log(error);
        }
        console.log();
        break;

      default:
        break;
    }
  };

  clearForm() {
    this.setState({ update: false, id: "" });
    document.getElementById("name").value = "";
    document.getElementById("vehicleType").value = "SUV";
    document.getElementById("driver").value = "";
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("tripFare").value = "";
    document.getElementById("type").value = "Pickup";
    document.getElementById("distance").value = "";
    document.getElementById("driverShare").value = "";
    document.getElementById("fuelExpense").value = "";
    document.getElementById("fromLocation").value = "";
    document.getElementById("toLocation").value = "";
  }

  componentDidMount() {
    this.fetchBookings();
    this.validate()
  }

  componentDidUpdate(){
    this.validate()
  }

  fetchVehicles = async (type) => {
    const data = await axios.get(`http://localhost:8400/api/${type}`);
    console.log(data.data);
    this.setState({ vehicles: data.data });
  };

  ModalClose() {
    this.clearForm();
    document.getElementById("close-modal").click();
  }

  addModal() {
    return (
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
                <h5 class="modal-title">Add Booking</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.clearForm();
                    this.setState({ update: false, id: "" });
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
                          id="name"
                          placeholder="Jhon Doe"
                        />
                        <label for="name">Cutomer Name</label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div class="form-floating mb-3">
                        <select
                          class="form-select"
                          id="type"
                          aria-label="Trip Type"
                        >
                          <option selected value="Pickup">
                            Pickup
                          </option>
                          <option value="Round_Trip">Round Trip</option>
                          <option value="Drop">Drop</option>
                        </select>
                        <label for="type">Trip Type</label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <div class="form-floating mb-3">
                        <select
                          class="form-select"
                          id="vehicleType"
                          aria-label="Expret In"
                          onChange={() => {
                            const type =
                              document.getElementById("vehicleType").value;
                            console.log(type);
                            this.setState({ drivers: [], vehicles: [] });
                            this.fetchDrivers(type);
                            this.fetchVehicles(type);
                          }}
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
                          id="driver"
                          aria-label="driver"
                        >
                          {this.state.drivers.map((driver) => {
                            return (
                              <option value={driver.name}>{driver.name}</option>
                            );
                          })}
                        </select>
                        <label for="driver">Drivers</label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div class="form-floating">
                        <select
                          class="form-select"
                          id="vehicles"
                          aria-label="vehicles"
                        >
                          {this.state.vehicles.map((vehicle) => {
                            return (
                              <option value={vehicle.modelName}>
                                {vehicle.modelName}
                              </option>
                            );
                          })}
                        </select>
                        <label for="vehicles">Vehicles</label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <div class="form-floating mb-3">
                        <input
                          type="datetime-local"
                          class="form-control"
                          id="startTime"
                          placeholder="---------"
                        />
                        <label for="startTime">Start Time</label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div class="form-floating mb-3">
                        <input
                          type="datetime-local"
                          class="form-control"
                          id="endTime"
                          placeholder="---------"
                        />
                        <label for="endTime">End Time</label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div class="form-floating mb-3">
                        <input
                          type="text"
                          class="form-control"
                          id="distance"
                          placeholder="---------"
                        />
                        <label for="distance">Total Distance</label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div class="form-floating mb-3">
                        <input
                          type="text"
                          class="form-control"
                          id="fromLocation"
                          placeholder="---------"
                        />
                        <label for="fromLocation">From</label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div class="form-floating mb-3">
                        <input
                          type="text"
                          class="form-control"
                          id="toLocation"
                          placeholder="---------"
                        />
                        <label for="toLocation">To</label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <div class="form-floating mb-3">
                        <input
                          type="text"
                          class="form-control"
                          id="tripFare"
                          placeholder="---------"
                        />
                        <label for="tripFare">Trip Fare</label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div class="form-floating mb-3">
                        <input
                          type="text"
                          class="form-control"
                          id="fuelExpense"
                          placeholder="---------"
                        />
                        <label for="fuelExpense">Fuel Expense</label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div class="form-floating mb-3">
                        <input
                          type="text"
                          class="form-control"
                          id="driverShare"
                          placeholder="---------"
                        />
                        <label for="driverShare">Driver Share</label>
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
                    this.clearForm();
                    this.setState({ update: false, id: "" });
                  }}
                >
                  Close
                </button>
                {this.state.update ? (
                  <button
                    onClick={() => {
                      this.updateBooking();
                    }}
                    type="button"
                    class="btn btn-primary"
                  >
                    Update
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      this.bookingAdd(null);
                    }}
                    type="button"
                    class="btn btn-primary"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  updateBooking = async () => {
    var bookingNew = {
      remark: document.getElementById("name").value,
      vehicle: document.getElementById("vehicleType").value,
      driver: document.getElementById("driver").value,
      sdTime: document.getElementById("startTime").value,
      edTime: document.getElementById("endTime").value,
      tripFare: document.getElementById("tripFare").value,
      type: document.getElementById("type").value,
      distance: document.getElementById("distance").value,
      driverShare: document.getElementById("driverShare").value,
      fuelExpense: document.getElementById("fuelExpense").value,
      fromLocation: document.getElementById("fromLocation").value,
      toLocation: document.getElementById("toLocation").value,
    };

    const data = await axios.put(
      `http://localhost:8200/api/booking/id/${this.state.id}`,
      bookingNew
    );
    console.log(data.data);
    this.ModalClose();
    this.fetchBookings();
    this.setState({ update: false, id: "" });
  };

  bookingAdd = async (booking) => {
    if (booking === null) {
      var bookingNew = {
        remark: document.getElementById("name").value,
        vehicle: document.getElementById("vehicleType").value,
        driver: document.getElementById("driver").value,
        sdTime: document.getElementById("startTime").value,
        edTime: document.getElementById("endTime").value,
        tripFare: document.getElementById("tripFare").value,
        type: document.getElementById("type").value,
        distance: document.getElementById("distance").value,
        driverShare: document.getElementById("driverShare").value,
        fuelExpense: document.getElementById("fuelExpense").value,
        fromLocation: document.getElementById("fromLocation").value,
        toLocation: document.getElementById("toLocation").value,
      };
      const data = await axios.post(
        "http://localhost:8200/api/booking",
        bookingNew
      );
      console.log(data.data);
      this.ModalClose();
      this.fetchBookings();
    } else {
      this.fetchDrivers(booking.vehicle);
      this.setState({ id: booking.bookingId });
      document.getElementById("name").value = booking.remark;
      document.getElementById("vehicleType").value = booking.vehicle;
      document.getElementById("driver").value = booking.driver;
      document.getElementById("startTime").value = booking.sdTime;
      document.getElementById("endTime").value = booking.edTime;
      document.getElementById("tripFare").value = booking.tripFare;
      document.getElementById("type").value = booking.type;
      document.getElementById("distance").value = booking.distance;
      document.getElementById("driverShare").value = booking.driverShare;
      document.getElementById("fuelExpense").value = booking.fuelExpense;
      document.getElementById("fromLocation").value = booking.fromLocation;
      document.getElementById("toLocation").value = booking.toLocation;
    }
  };

  deleteBooking = async (id) => {
    const data = await axios.delete(
      `http://localhost:8200/api/booking/id/${id}`
    );
    console.log(data);
    this.fetchBookings();
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
            Add Booking
          </button>
        </div>
        {this.state.bookings.map((booking) => {
          return (
            <div
              class="collapse mt-2"
              id={`collapseExample${booking.bookingId}`}
            >
              <div class="card ">
                <div className="card-header">
                  <h6>Booking ID: {booking.bookingId}</h6>
                </div>
                <div className="card-body">
                  <ul class="list-group">
                    <li class="list-group-item">
                      <span className="fw-bold">Booking Type: </span>
                      {booking.type}
                    </li>
                    <li class="list-group-item">
                      <span className="fw-bold">Trip Distance: </span>
                      {booking.distance}
                    </li>
                    <li class="list-group-item">
                      <span className="fw-bold">Fuel Expense : </span>
                      {booking.fuelExpense}
                    </li>
                    <li class="list-group-item">
                      <span className="fw-bold">Driver Share: </span>
                      {booking.driverShare}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
        {this.addModal()}
        <div className="bg-light" style={{ borderRadius: "20px" }}>
          <table class="table table-striped mt-5 ">
            <thead>
              <th className="">Booking Id</th>
              <th className="">Driver Name</th>

              <th className="">Vehicle</th>
              <th className="">From</th>
              <th className="">To</th>
              <th className="">Trip Fare</th>
              <th className="">Customer Name</th>
              <th className="">Details</th>
              <th className="">Action</th>
            </thead>
            <tbody className=" table-striped">
              {this.state.bookings.map((booking) => {
                return (
                  <tr key={booking.driverId} className="">
                    <td className="">{booking.bookingId}</td>
                    <td className="">{booking.driver}</td>

                    <td className="">{booking.vehicle}</td>
                    <td className="">{booking.fromLocation}</td>
                    <td className="">{booking.toLocation}</td>
                    <td className="">{booking.tripFare}</td>
                    <td className="">{booking.remark}</td>

                    <td className="">
                      <button
                        class="btn btn-primary"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseExample${booking.bookingId}`}
                        aria-expanded="false"
                        aria-controls={`collapseExample${booking.bookingId}`}
                      >
                        More Details
                      </button>
                    </td>
                    <td className="">
                      <button
                        onClick={() => {
                          this.bookingAdd(booking);
                          this.setState({ update: true });
                        }}
                        className="btn btn-outline-success"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        // data-bs-whatever="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger mx-2"
                        // data-bs-whatever="Edit"
                        onClick={() => {
                          this.deleteBooking(booking.bookingId);
                        }}
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

export default Booking;
