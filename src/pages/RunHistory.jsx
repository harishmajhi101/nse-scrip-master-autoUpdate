import React, { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Play } from "lucide-react";

const API_BASE =
  "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

export default function RunHistory() {
  const [runs, setRuns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRuns = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/run-history`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load run history"
        );
      }

      setRuns(result.data || []);
    } catch (err) {
      console.error("Run history error:", err);
      setError(err.message || "Failed to load run history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const filteredRuns = useMemo(() => {
    const value = search.trim().toLowerCase();

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
        String(run.started || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [runs, search]);

  const formatDate = (value) => {
    if (!value) return "-";

    return String(value)
      .replace("T", " ")
      .replace(".000Z", "");
  };

  const formatDuration = (seconds) => {
    const value = Number(seconds || 0);

    if (value < 60) {
      return `${value}s`;
    }

    const minutes = Math.floor(value / 60);
    const remainingSeconds = value % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="page">

      <div className="page-content">
        <div className="section-header">
          <div>
            <h2>Run History</h2>
            <p>
              Previous NSE processing runs and their results
            </p>
          </div>
        </div>

        <div className="history-toolbar">
          <div className="search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search Run ID, status or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="refresh-button"
            onClick={loadRuns}
            disabled={loading}
          >
            <RefreshCw
              size={18}
              className={loading ? "spin" : ""}
            />

            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="showing-count">
          Showing {filteredRuns.length} runs
        </div>

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
              {loading && runs.length === 0 ? (
                <tr>
                  <td colSpan="12" className="empty-cell">
                    Loading run history...
                  </td>
                </tr>
              ) : filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan="12" className="empty-cell">
                    No run history found
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => (
                  <tr key={run.ROWID || run.runId}>
                    <td className="run-id">
                      {run.runId}
                    </td>

                    <td>
                      {formatDate(run.started)}
                    </td>

                    <td>
                      {formatDate(run.completed)}
                    </td>

                    <td>
                      <span
                        className={
                          run.status === "Failed"
                            ? "status-badge failed"
                            : "status-badge completed"
                        }
                      >
                        {run.status}
                      </span>
                    </td>

                    <td>
                      {run.rowCounts?.equity ?? 0}
                    </td>

                    <td>
                      {run.rowCounts?.sme ?? 0}
                    </td>

                    <td>
                      {run.outcomes?.autoUpdated ?? 0}
                    </td>

                    <td>
                      {run.outcomes?.newRecords ?? 0}
                    </td>

                    <td>
                      {run.outcomes?.approval ?? 0}
                    </td>

                    <td>
                      {run.outcomes?.unresolved ?? 0}
                    </td>

                    <td>
                      {run.outcomes?.errors ?? 0}
                    </td>

                    <td>
                      {formatDuration(run.duration)}
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