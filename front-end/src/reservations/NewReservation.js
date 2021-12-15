

import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {
  createReservation,
  editReservation,
  listReservations,
} from "../utils/api";

export default function NewReservation({ loadDashboard, edit }) {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservationsError, setReservationsError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  /** makes a get request to "reservations" if the user is editing or filling out the form.*/
  useEffect(() => {
    /** sets condition to make an api call to get  */
    if (edit) {
      if (!reservation_id) return null;

      loadReservations()
        .then((response) =>
          response.find(
            (reservation) =>
              reservation.reservation_id === Number(reservation_id)
          )
        )
        .then(fillFields);
    }

    function fillFields(foundReservation) {
      if (!foundReservation || foundReservation.status !== "booked") {
        return <p>Only booked reservations can be edited.</p>;
      }

      const date = new Date(foundReservation.reservation_date);
      const dateString = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

      setFormData({
        first_name: foundReservation.first_name,
        last_name: foundReservation.last_name,
        mobile_number: foundReservation.mobile_number,
        reservation_date: dateString,
        reservation_time: foundReservation.reservation_time,
        people: foundReservation.people,
      });
    }

    /** lists reservations for the given date once the new reservation has been created */
    async function loadReservations() {
      const abortController = new AbortController();
      /** uses listReservations() to send a get request to display all reservations for the given date */
      return await listReservations(null, abortController.signal).catch(
        setReservationsError
      );
    }
  }, [edit, reservation_id]);

  /** updates the state of the form when the user makes any changes to it */
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]:
        target.name === "people" ? Number(target.value) : target.value,
    });
  }

  /** if a reservation was created or edited, clicking the "submit" button will do the following:
   * make an api call
   * save the reservation
   * display the previous page
   */
  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const foundErrors = [];

    if (validateDate(foundErrors) && validateFields(foundErrors)) {
      if (edit) {
        editReservation(reservation_id, formData, abortController.signal)
          .then(loadDashboard)
          .then(() =>
            history.push(`/dashboard?date=${formData.reservation_date}`)
          )
          .catch(setApiError);
      } else {
        createReservation(formData, abortController.signal)
          .then(loadDashboard)
          .then(() =>
            history.push(`/dashboard?date=${formData.reservation_date}`)
          )
          .catch(setApiError);
      }
    }
    setErrors(foundErrors);
    return () => abortController.abort();
  }

  /** checks if user has filled out each field in the form */
  function validateFields(foundErrors) {
    for (const field in formData) {
      if (formData[field] === "") {
        foundErrors.push({
          message: `${field.split("_").join(" ")} cannot be left blank.`,
        });
      }
    }

    return foundErrors.length === 0;
  }
  /** checks that the user has entered a date & time that the restaurant is available */
  function validateDate(foundErrors) {
    const reservationDateTime = new Date(
      `${formData.reservation_date}T${formData.reservation_time}:00.000`
    );
    const todaysDate = new Date();
    if (reservationDateTime.getDay() === 2) {
      foundErrors.push({
        message: "invalid date: restaurant is closed on tuesdays.",
      });
    }

    if (reservationDateTime < todaysDate) {
      foundErrors.push({
        message: "invalid date: only reservations for future dates can be made",
      });
    }

    if (
      reservationDateTime.getHours() < 10 ||
      (reservationDateTime.getHours() === 10 &&
        reservationDateTime.getMinutes() < 30)
    ) {
      foundErrors.push({
        message: "invalid time: restaurant does not open until 10:30am",
      });
    } else if (
      reservationDateTime.getHours() > 22 ||
      (reservationDateTime.getHours() === 22 &&
        reservationDateTime.getMinutes() >= 30)
    ) {
      foundErrors.push({
        message: "invalid time: restaurant closes at 10:30pm",
      });
    } else if (
      reservationDateTime.getHours() > 21 ||
      (reservationDateTime.getHours() === 21 &&
        reservationDateTime.getMinutes() > 30)
    ) {
      foundErrors.push({
        message:
          "invalid time: reservation must be made at least an hour before closing",
      });
    }
    return foundErrors.length === 0;
  }

  const errorsJSX = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
  };

  /** displays the reservation form to the user */
  return (
   <div style={{fontFamily: "Rubik"}}>
     <h2 className="font-weight-bold d-flex justify-content-center mt-4">New Reservation</h2>
      <div className="d-flex justify-content-center">
      <form className="font-weight-bold mt-3 m-3 w-75">
        {errorsJSX()}
        <ErrorAlert error={apiError} />
        <ErrorAlert error={reservationsError} />
        <label className="form-label" htmlFor="first_name">
          First Name&nbsp;
        </label>
        <input
          name="first_name"
          id="first_name"
          className="form-control mb-3 border-dark"
          type="text"
          onChange={handleChange}
          value={formData.first_name}
          required
        />
        <label className="form-label" htmlFor="last_name">
          Last Name&nbsp;
        </label>
        <input
          name="last_name"
          id="last_name"
          className="form-control mb-3 border-dark"
          type="text"
          onChange={handleChange}
          value={formData.last_name}
          required
        />
        <label className="form-label" htmlFor="mobile_number">
          Mobile Number&nbsp;
        </label>
        <input
          className="form-control mb-3 border-dark"
          name="mobile_number"
          id="mobile_number"
          type="text"
          onChange={handleChange}
          value={formData.mobile_number}
          required
        />

        <label className="form-label" htmlFor="reservation_date">
          Reservation Date&nbsp;
        </label>
        <input
          name="reservation_date"
          id="reservation_date"
          className="form-control mb-3 border-dark"
          type="date"
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          onChange={handleChange}
          value={formData.reservation_date}
          required
        />
        <label className="form-label" htmlFor="reservation_time">
          Reservation Time&nbsp;
        </label>
        <input
          name="reservation_time"
          id="reservation_time"
          className="form-control mb-3 border-dark"
          type="time"
          placeholder="HH:MM"
          pattern="[0-9]{2}:[0-9]{2}"
          onChange={handleChange}
          value={formData.reservation_time}
          required
        />
        <label className="form-label" htmlFor="people">
          Party Size&nbsp;
        </label>
        <input
          name="people"
          id="people"
          className="form-control mb-3 border-dark"
          type="number"
          min="1"
          onChange={handleChange}
          value={formData.people}
          required
        />
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-outline-0 btn-success border-dark m-1" 
            // style={{color: "white"}}
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="btn btn-danger m-1"
            type="button"
            onClick={history.goBack}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
   </div>
  );
}

