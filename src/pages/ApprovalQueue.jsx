import { useEffect, useState } from "react";
import { Search, RefreshCw, Check, X } from "lucide-react";

const API_BASE_URL =
  "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

function Approval() {
  const [approvalData, setApprovalData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApprovalData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/approval`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch approval queue"
        );
      }

      setApprovalData(result.data || []);
    } catch (err) {
      console.error("GET /approval error:", err);
      setError(
        err.message || "Failed to load approval queue"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalData();
  }, []);

  const filteredData = approvalData.filter((item) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      String(item.ISIN || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(item.Source || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(item.Agent_Reason || "")
        .toLowerCase()
        .includes(searchValue);

    const itemStatus = String(
      item.Status || "pending"
    ).toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      itemStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "approved") {
      return "active";
    }

    if (value === "rejected") {
      return "rejected";
    }

    return "pending";
  };

  return (
    <div>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-heading">
        <div>
          <h2>Approval Queue</h2>
          <p>
            Review proposed changes before they are applied
          </p>
        </div>
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search ISIN, source or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="pending">
            Pending
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>

          <option value="all">
            All
          </option>
        </select>

        <button
          className="secondary-button"
          onClick={fetchApprovalData}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ISIN</th>
                <th>Current Values</th>
                <th>Proposed Values</th>
                <th>Source</th>
                <th>Confidence</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8">
                    <div className="table-empty">
                      Loading approval queue...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="table-empty">
                      No approval records found
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const status = String(
                    item.Status || "pending"
                  ).toLowerCase();

                  return (
                    <tr
                      key={
                        item.ROWID ||
                        `${item.ISIN}-${item.CREATEDTIME}`
                      }
                    >
                      <td className="isin">
                        {item.ISIN}
                      </td>

                      <td>
                        <pre className="json-cell">
                          {item.Current_Values || "-"}
                        </pre>
                      </td>

                      <td>
                        <pre className="json-cell">
                          {item.Proposed_Values || "-"}
                        </pre>
                      </td>

                      <td>
                        {item.Source || "-"}
                      </td>

                      <td>
                        <span className="status pending">
                          {item.Confidence || "-"}
                        </span>
                      </td>

                      <td>
                        {item.Agent_Reason || "-"}
                      </td>

                      <td>
                        <span
                          className={`status ${getStatusClass(
                            status
                          )}`}
                        >
                          {item.Status || "pending"}
                        </span>
                      </td>

                      <td>
                        {status === "pending" ? (
                          <div className="approval-actions">
                            <button
                              className="approve-button"
                              title="Approve"
                            >
                              <Check size={15} />
                              Approve
                            </button>

                            <button
                              className="reject-button"
                              title="Reject"
                            >
                              <X size={15} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="muted">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Approval;