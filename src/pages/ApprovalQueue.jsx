
import { useEffect, useState } from "react";
import { Search, RefreshCw, Check, X } from "lucide-react";

const API_BASE_URL =
  import.meta.env.DEV
    ? "/api"
    : "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

function Approval() {
  const [approvalData, setApprovalData] = useState([]);
  const [search, setSearch] = useState("");

  // Start with Pending records
  const [statusFilter, setStatusFilter] = useState("pending");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [success, setSuccess] = useState("");

  // =========================================================
  // FETCH APPROVAL QUEUE
  // =========================================================

  const fetchApprovalData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/approval`);

      const result = await response.json();

      console.log("GET /approval status:", response.status);
      console.log("GET /approval response:", result);

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

  // =========================================================
  // LOAD ON PAGE OPEN
  // =========================================================

  useEffect(() => {
    fetchApprovalData();
  }, []);

  // =========================================================
  // APPROVE
  // =========================================================

  const handleApprove = async (item) => {
    const rowId = item.ROWID;

    console.log("APPROVE CLICKED:", rowId);

    if (!rowId) {
      setError("Approval ROWID is missing");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to approve this proposal?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(rowId);
      setError("");
      setSuccess("");

      console.log("Sending approve request...");

      const response = await fetch(
        `${API_BASE_URL}/approval/approve`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            rowId: rowId,
            decidedBy: "admin",
          }),
        }
      );

      console.log(
        "Approve HTTP status:",
        response.status
      );

      const result = await response.json();

      console.log(
        "Approve response:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.error ||
            "Approval failed"
        );
      }

      // =====================================================
      // IMPORTANT
      // Do NOT delete the row from approvalData.
      // Update it locally to APPROVED.
      // =====================================================

      setApprovalData((prev) =>
        prev.map((row) =>
          row.ROWID === rowId
            ? {
                ...row,
                Status: "APPROVED",
                Decided_By:
                  result.decidedBy || "admin",
                Decided_At:
                  result.decidedAt ||
                  new Date().toISOString(),
              }
            : row
        )
      );

      // =====================================================
      // Show the approved row immediately.
      //
      // Since the current filter is "Pending", an APPROVED
      // row would normally disappear.
      //
      // Switch to "All" so the approved row stays visible.
      // =====================================================

      setStatusFilter("all");

      setSuccess(
        result.message ||
          "Proposal approved successfully"
      );

      console.log(
        "Approval successful. Row kept visible:",
        rowId
      );
    } catch (err) {
      console.error(
        "APPROVE ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to approve proposal"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =========================================================
  // REJECT
  // =========================================================

  const handleReject = async (item) => {
    const rowId = item.ROWID;

    console.log("REJECT CLICKED:", rowId);

    if (!rowId) {
      setError("Approval ROWID is missing");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this proposal?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(rowId);
      setError("");
      setSuccess("");

      console.log("Sending reject request...");

      const response = await fetch(
        `${API_BASE_URL}/approval/reject`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            rowId: rowId,
            decidedBy: "admin",
          }),
        }
      );

      console.log(
        "Reject HTTP status:",
        response.status
      );

      const result = await response.json();

      console.log(
        "Reject response:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.error ||
            "Reject failed"
        );
      }

      // =====================================================
      // Keep the rejected row in the table.
      // Do NOT delete it.
      // =====================================================

      setApprovalData((prev) =>
        prev.map((row) =>
          row.ROWID === rowId
            ? {
                ...row,
                Status: "REJECTED",
                Decided_By:
                  result.decidedBy || "admin",
                Decided_At:
                  result.decidedAt ||
                  new Date().toISOString(),
              }
            : row
        )
      );

      // Show rejected row immediately
      setStatusFilter("all");

      setSuccess(
        result.message ||
          "Proposal rejected successfully"
      );

      console.log(
        "Rejection successful. Row kept visible:",
        rowId
      );
    } catch (err) {
      console.error(
        "REJECT ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to reject proposal"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredData = approvalData.filter(
    (item) => {
      const searchValue =
        search.toLowerCase().trim();

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

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "approved") {
      return "active";
    }

    if (value === "rejected") {
      return "rejected";
    }

    return "pending";
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div>
      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="page-heading">
        <div>
          <h2>Approval Queue</h2>

          <p>
            Review proposed changes before
            they are applied
          </p>
        </div>
      </div>

      {/* ===================================================
          SUCCESS MESSAGE
      =================================================== */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* ===================================================
          ERROR MESSAGE
      =================================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ===================================================
          TOOLBAR
      =================================================== */}

      <div className="toolbar">
        {/* SEARCH */}

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search ISIN, source or reason..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* STATUS FILTER */}

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
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

        {/* REFRESH */}

        <button
          type="button"
          className="secondary-button"
          onClick={fetchApprovalData}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading ? "spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* ===================================================
          APPROVAL TABLE
      =================================================== */}

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
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td colSpan="8">
                    <div className="table-empty">
                      Loading approval queue...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                /* EMPTY */

                <tr>
                  <td colSpan="8">
                    <div className="table-empty">
                      No approval records found
                    </div>
                  </td>
                </tr>
              ) : (
                /* DATA */

                filteredData.map((item) => {
                  const status = String(
                    item.Status ||
                      "pending"
                  ).toLowerCase();

                  const isProcessing =
                    processingId ===
                    item.ROWID;

                  return (
                    <tr
                      key={
                        item.ROWID ||
                        `${item.ISIN}-${item.CREATEDTIME}`
                      }
                    >
                      {/* =================================
                          ISIN
                      ================================= */}

                      <td className="isin">
                        {item.ISIN || "-"}
                      </td>

                      {/* =================================
                          CURRENT VALUES
                      ================================= */}

                      <td>
                        <pre className="json-cell">
                          {item.Current_Values ||
                            "-"}
                        </pre>
                      </td>

                      {/* =================================
                          PROPOSED VALUES
                      ================================= */}

                      <td>
                        <pre className="json-cell">
                          {item.Proposed_Values ||
                            "-"}
                        </pre>
                      </td>

                      {/* =================================
                          SOURCE
                      ================================= */}

                      <td>
                        {item.Source || "-"}
                      </td>

                      {/* =================================
                          CONFIDENCE
                      ================================= */}

                      <td>
                        <span className="status pending">
                          {item.Confidence ||
                            "-"}
                        </span>
                      </td>

                      {/* =================================
                          REASON
                      ================================= */}

                      <td>
                        {item.Agent_Reason ||
                          "-"}
                      </td>

                      {/* =================================
                          STATUS
                      ================================= */}

                      <td>
                        <span
                          className={`status ${getStatusClass(
                            status
                          )}`}
                        >
                          {String(
                            item.Status ||
                              "PENDING"
                          ).toUpperCase()}
                        </span>
                      </td>

                      {/* =================================
                          ACTION
                      ================================= */}

                      <td>
                        {status ===
                        "pending" ? (
                          <div className="approval-actions">
                            {/* APPROVE */}

                            <button
                              type="button"
                              className="approve-button"
                              title="Approve"
                              onClick={() =>
                                handleApprove(
                                  item
                                )
                              }
                              disabled={
                                isProcessing
                              }
                            >
                              <Check
                                size={15}
                              />

                              {isProcessing
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            {/* REJECT */}

                            <button
                              type="button"
                              className="reject-button"
                              title="Reject"
                              onClick={() =>
                                handleReject(
                                  item
                                )
                              }
                              disabled={
                                isProcessing
                              }
                            >
                              <X
                                size={15}
                              />

                              {isProcessing
                                ? "Processing..."
                                : "Reject"}
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