import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";

const sampleRunData = [
  {
    id: 1,
    runId: "RUN-20260930-063001",
    startedAt: "2026-09-30 06:30:01",
    completedAt: "2026-09-30 06:35:25",
    status: "Completed",
    downloaded: 2,
    staging: 1850,
    matched: 1780,
    updated: 42,
    newRecords: 18,
    unmatched: 10,
    errors: 0,
  },
  {
    id: 2,
    runId: "RUN-20260929-063002",
    startedAt: "2026-09-29 06:30:02",
    completedAt: "2026-09-29 06:34:48",
    status: "Completed",
    downloaded: 2,
    staging: 1842,
    matched: 1775,
    updated: 31,
    newRecords: 12,
    unmatched: 24,
    errors: 0,
  },
  {
    id: 3,
    runId: "RUN-20260928-063001",
    startedAt: "2026-09-28 06:30:01",
    completedAt: "2026-09-28 06:31:42",
    status: "Failed",
    downloaded: 1,
    staging: 0,
    matched: 0,
    updated: 0,
    newRecords: 0,
    unmatched: 0,
    errors: 1,
  },
];

function RunHistory() {
  const [search, setSearch] = useState("");

  const filteredData = sampleRunData.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.runId.toLowerCase().includes(value) ||
      item.status.toLowerCase().includes(value) ||
      item.startedAt.toLowerCase().includes(value)
    );
  });

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="page-heading">
        <div>
          <h2>Run History</h2>
          <p>
            Previous NSE processing runs and their results
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search Run ID, status or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="secondary-button">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* COUNT */}
      <div className="staging-info">
        Showing <strong>{filteredData.length}</strong> runs
      </div>

      {/* TABLE */}
      <div className="panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Started</th>
                <th>Completed</th>
                <th>Status</th>
                <th>Staging</th>
                <th>Matched</th>
                <th>Updated</th>
                <th>New</th>
                <th>Unmatched</th>
                <th>Errors</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    <div className="table-empty">
                      No runs found
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="run-id">
                      {item.runId}
                    </td>

                    <td className="history-date">
                      {item.startedAt}
                    </td>

                    <td className="history-date">
                      {item.completedAt}
                    </td>

                    <td>
                      <span
                        className={`run-status ${
                          item.status === "Completed"
                            ? "completed"
                            : "failed"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>{item.staging}</td>

                    <td>{item.matched}</td>

                    <td>{item.updated}</td>

                    <td>{item.newRecords}</td>

                    <td>{item.unmatched}</td>

                    <td>
                      <span
                        className={
                          item.errors > 0
                            ? "error-count"
                            : "success-count"
                        }
                      >
                        {item.errors}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RunHistory;