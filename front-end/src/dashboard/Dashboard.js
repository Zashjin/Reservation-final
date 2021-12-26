import React from "react";
import { useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import TableRow from "./TableRow";
import ReservationRow from "./ReservationRow";
/**
 * Defines the dashboard page.
 */
function Dashboard({
  date,
  reservations,
  reservationsError,
  tables,
  tablesError,
  loadDashboard,
}) {
  const history = useHistory();

  const reservationsJSX = () => {
    return reservations.map((reservation) => (
      <ReservationRow
        key={reservation.reservation_id}
        reservation={reservation}
        loadDashboard={loadDashboard}
      />
    ));
  };

  const tablesJSX = () => {
    return tables.map((table) => (
      <TableRow
        key={table.table_id}
        table={table}
        loadDashboard={loadDashboard}
      />
    ));
  };
  function handleClick({ target }) {
    let newDate;
    let useDate;

    /** uses:
     * previous() to set the reservations' list date to be the previous day
     * next() to set the reservations' list date to be the following day
     * today() to set reservation's list date to current day
     */
    if (!date) {
      useDate = today();
    } else {
      useDate = date;
    }

    if (target.name === "previous") {
      newDate = previous(useDate);
    } else if (target.name === "next") {
      newDate = next(useDate);
    } else {
      newDate = today();
    }

    history.push(`/dashboard?date=${newDate}`);
  }

  return (
    <div
      className="w-80 ml-2 pr-4 mr-4 pt-4"
      style={{ fontFamily: "Rubik" }}
    >

<h1 className="font-weight-bold d-flex justify-content-center text-center text-wrap mt-3" style={{ fontSize: "50px" }}>
          Restaurant Reservation App
        </h1>
      <main>
        <h2 className="font-weight-bold d-flex justify-content-center mt-5 mb-4">
          Dashboard
        </h2>

        <div className="mt-4 mb-4 d-flex justify-content-center">
          <button
            className="btn-xs rounded btn-light btn-outline-dark m-1 p-1"
            type="button"
            name="previous"
            onClick={handleClick}
          >
            Previous
          </button>
          <button
            className="btn-xs rounded btn-success btn-outline-success m-1 text-white"
            type="button"
            name="today"
            onClick={handleClick}
          >
            Today
          </button>
          <button
            className="btn-xs rounded btn-light btn-outline-dark m-1"
            type="button"
            name="next"
            onClick={handleClick}
          >
            Next
          </button>
        </div>
        <h4 className="mt-4 font-weight-bold d-flex justify-content-center mb-2">
        {date}
        </h4>

        <h3 className="mb-4 font-weight-bold">Reservations</h3>
        <ErrorAlert error={reservationsError} />

        <table className="table text-wrap text-center table-hover">
          <thead className="thead-dark">
            <tr className="text-center">
              <th scope="col">ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">People</th>
              <th scope="col">Status</th>
              <th scope="col">Edit</th>
              <th scope="col">Cancel</th>
              <th scope="col">Seat</th>
            </tr>
          </thead>

          <tbody>{reservationsJSX()}</tbody>
        </table>

        <br />
        <br />

        <h3 className="mb-4 font-weight-bold">Tables</h3>

        <ErrorAlert error={tablesError} />

        <table className="table table-hover m-1 text-nowrap mb-4">
          <thead className="thead-dark">
            <tr className="text-center">
              <th scope="col">Table ID</th>
              <th scope="col">Table Name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Status</th>
              <th scope="col">Reservation ID</th>
              <th scope="col">Finish</th>
            </tr>
          </thead>

          <tbody>{tablesJSX()}</tbody>
        </table>
      </main>
      <h2 className="font-weight-bold d-flex justify-content-center text-center text-wrap mt-3" style={{ fontSize: "20px" }}>periodic tables</h2>
    </div>
  );
}

export default Dashboard;