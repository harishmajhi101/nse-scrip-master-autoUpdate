import React, { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";

const API_BASE =
  "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

export default function RunHistory() {
  const [runs, setRuns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Run History
  |--------------------------------------------------------------------------
  */

  const loadRuns = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "RUN HISTORY REQUEST:",
        `${API_BASE}/run-history`
      );

      const response = await fetch(
        `${API_BASE}/run-history`
      );

      console.log(
        "RUN HISTORY STATUS:",
        response.status
      );

      const text = await response.text();

      console.log(
        "RUN HISTORY RAW RESPONSE:",
        text
      );

      let result;

      try {
        result = JSON.parse(text);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response from run-history API: ${text.substring(
            0,
            300
          )}`
        );
      }

      console.log(
        "RUN HISTORY RESULT:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.error ||
            "Failed to load run history"
        );
      }

      const historyData = Array.isArray(result.data)
        ? result.data
        : [];

      console.log(
        "RUN HISTORY RECORDS:",
        historyData.length
      );

      console.log(
        "RUN HISTORY FIRST RECORD:",
        historyData[0]
      );

      setRuns(historyData);
    } catch (err) {
      console.error(
        "Run history error:",
        err
      );

      setError(
        err.message ||
          "Failed to load run history"
      );

      setRuns([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadRuns();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filteredRuns = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return runs;
    }

    return runs.filter((run) => {
      return (
        String(run.runId || "")
          .toLowerCase()
          .includes(value) ||

        String(run.status || "")
          .toLowerCase()
          .includes(value) ||

        String(run.startedAt || "")
          .toLowerCase()
          .includes(value) ||

        String(run.completedAt || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [runs, search]);

  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return String(value)
      .replace("T", " ")
      .replace(".000Z", "");
  };

  /*
  |--------------------------------------------------------------------------
  | Format Duration
  |--------------------------------------------------------------------------
  */

  const formatDuration = (value) => {
    const duration = Number(value || 0);

    if (!Number.isFinite(duration)) {
      return "0s";
    }

    if (duration < 1000) {
      return `${duration}ms`;
    }

    const seconds = Math.floor(
      duration / 1000
    );

    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  /*
  |--------------------------------------------------------------------------
  | Status Class
  |--------------------------------------------------------------------------
  */

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (
      value.includes("error") ||
      value.includes("failed")
    ) {
      return "status-badge failed";
    }

    if (
      value.includes("running")
    ) {
      return "status-badge running";
    }

    if (
      value.includes("completed")
    ) {
      return "status-badge completed";
    }

    return "status-badge completed";
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="page">
      <div className="page-content">

        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="section-header">
          <div>
            <h2>Run History</h2>

            <p>
              Previous NSE processing runs
              and their results
            </p>
          </div>
        </div>

        {/* ============================================================
            TOOLBAR
        ============================================================ */}

        <div className="history-toolbar">

          <div className="search-box">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search Run ID, status or date..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <button
            className="run-history-refresh"
            onClick={loadRuns}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "spin"
                  : ""
              }
            />

            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* ============================================================
            ERROR
        ============================================================ */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* ============================================================
            COUNT
        ============================================================ */}

        <div className="showing-count">
          Showing {filteredRuns.length} runs
        </div>

        {/* ============================================================
            TABLE
        ============================================================ */}

        <div className="history-table-wrapper">

          <table className="history-table">

            <thead>
              <tr>

                <th>RUN ID</th>

                <th>STARTED</th>

                <th>COMPLETED</th>

                <th>STATUS</th>

                <th>EQUITY</th>

                <th>SME</th>

                <th>AUTO UPDATED</th>

                <th>NEW RECORDS</th>

                <th>APPROVAL</th>

                <th>UNRESOLVED</th>

                <th>ERRORS</th>

                <th>DURATION</th>

              </tr>
            </thead>

            <tbody>

              {/* ======================================================
                  LOADING
              ====================================================== */}

              {loading &&
              runs.length === 0 ? (

                <tr>
                  <td
                    colSpan="12"
                    className="empty-cell"
                  >
                    Loading run history...
                  </td>
                </tr>

              ) : filteredRuns.length === 0 ? (

                /* ====================================================
                   EMPTY
                ==================================================== */

                <tr>
                  <td
                    colSpan="12"
                    className="empty-cell"
                  >
                    {error
                      ? "Unable to load run history"
                      : "No run history found"}
                  </td>
                </tr>

              ) : (

                /* ====================================================
                   DATA
                ==================================================== */

                filteredRuns.map((run) => (

                  <tr
                    key={
                      run.ROWID ||
                      run.runId
                    }
                  >

                    {/* RUN ID */}

                    <td className="run-id">
                      {run.runId || "-"}
                    </td>

                    {/* STARTED */}

                    <td>
                      {formatDate(
                        run.startedAt
                      )}
                    </td>

                    {/* COMPLETED */}

                    <td>
                      {formatDate(
                        run.completedAt
                      )}
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={getStatusClass(
                          run.status
                        )}
                      >
                        {run.status ||
                          "Unknown"}
                      </span>
                    </td>

                    {/* EQUITY */}

                    <td>
                      {run.equity ?? 0}
                    </td>

                    {/* SME */}

                    <td>
                      {run.sme ?? 0}
                    </td>

                    {/* AUTO UPDATED */}

                    <td>
                      {run.autoUpdated ?? 0}
                    </td>

                    {/* NEW RECORDS */}

                    <td>
                      {run.newRecords ?? 0}
                    </td>

                    {/* APPROVAL */}

                    <td>
                      {run.approval ?? 0}
                    </td>

                    {/* UNRESOLVED */}

                    <td>
                      {run.unresolved ?? 0}
                    </td>

                    {/* ERRORS */}

                    <td>
                      {run.errors ?? 0}
                    </td>

                    {/* DURATION */}

                    <td>
                      {formatDuration(
                        run.duration
                      )}
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