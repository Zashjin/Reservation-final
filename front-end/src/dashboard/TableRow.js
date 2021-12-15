import React from "react";
import { finishTable } from "../utils/api";

export default function TableRow({ table, loadDashboard }) {
  if (!table) return null;

  /** handles finishing a seated table */
  function handleFinish() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      finishTable(table.table_id, abortController.signal).then(loadDashboard);
      return () => abortController.abort();
    }
  }

  /** displays a list of all tables */
  return (
    <tr style={{ fontFamily: "Rubik" }}>
      <th scope="row">{table.table_id}</th>
      <td class="text-center">{table.table_name}</td>
      <td class="text-center">{table.capacity}</td>
      <td class="text-center" data-table-id-status={table.table_id}>
        {table.status}
      </td>
      <td class="text-center">
        {table.reservation_id ? table.reservation_id : "--"}
      </td>

      {table.status === "occupied" && (
        <td className="text-center">
          <button
            className="btn btn-sm btn-danger"
            data-table-id-finish={table.table_id}
            onClick={handleFinish}
            type="button"
          >
            Finish
          </button>
        </td>
      )}
    </tr>
  );
}
