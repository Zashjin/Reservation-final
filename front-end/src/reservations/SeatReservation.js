import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, seatTable } from "../utils/api";

export default function SeatReservation({ tables, loadDashboard }) {
  const history = useHistory();

  const [table_id, setTableId] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState(null);

  const { reservation_id } = useParams();

  /** makes a get request to list all reservations to the user */
  useEffect(() => {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(null, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }, []);

  if (!tables || !reservations) return null;

  /** updates the state of the form upon any changes made by the user */
  function handleChange({ target }) {
    setTableId(target.value);
  }

  /**
   * makes a put request to update the form upon the user's submission
   */
  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();

    if (validateSeat()) {
      seatTable(reservation_id, table_id, abortController.signal)
        .then(loadDashboard)
        .then(() => history.push(`/dashboard`))
        .catch(setApiError);
    }
    return () => abortController.abort();
  }

  /** checks that the seat can host the user's reservation */
  function validateSeat() {
    const foundErrors = [];

    /** checks for table that matches the given table_id */
    const foundTable = tables.find(
      (table) => table.table_id === Number(table_id)
    );
    /** checks for reservation that matches the given reservation_id */
    const foundReservation = reservations.find(
      (reservation) => reservation.reservation_id === Number(reservation_id)
    );

    if (!foundTable) {
      foundErrors.push("invalid table: table does not exist");
    } else if (!foundReservation) {
      foundErrors.push("invalid reservation: reservation does not exist");
    } else {
      if (foundTable.status === "occupied") {
        foundErrors.push("invalid table: the table is occupied");
      }

      if (foundTable.capacity < foundReservation.people) {
        foundErrors.push(
          `invalid table: table cannot seat ${foundReservation.people} people.`
        );
      }
    }

    setErrors(foundErrors);
    return foundErrors.length === 0;
  }

  const tableOptionsJSX = () => {
    return tables.map((table) => (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    ));
  };

  const errorsJSX = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
  };

  return (
    <form className="form-select" style={{fontFamily: "Rubik"}}>
      {errorsJSX()}
      <ErrorAlert error={apiError} />
      <ErrorAlert error={reservationsError} />

      <label className="form-label" htmlFor="table_id">
        Choose table:
      </label>
      <select
        className="form-control"
        name="table_id"
        id="table_id"
        value={table_id}
        onChange={handleChange}
      >
        <option value={0}>Choose a table</option>
        {tableOptionsJSX()}
      </select>

      <button
        className="btn btn-success m-1"
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
    </form>
  );
}
