import { useCallback, useEffect, useState } from "react";

import {
  Database,
  FileText,
  History,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Bot,
  RefreshCw,
  Play,
} from "lucide-react";

const API_BASE_URL =
  "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

// =========================================================
// DASHBOARD
// =========================================================

function Dashboard({
  refreshKey,
  running,
  runResult,
  runError,
}) {
  const [stats, setStats] = useState({
    master: 0,
    staging: 0,
    history: 0,
    approval: 0,
  });

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // =========================================================
  // API HELPER
  // =========================================================

  const fetchJson = useCallback(async (url, apiName) => {
    console.log(`DASHBOARD ${apiName} REQUEST:`, url);

    let response;

    try {
      response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error(
        `DASHBOARD ${apiName} NETWORK ERROR:`,
        error
      );

      throw new Error(
        `${apiName}: ${
          error?.message ||
          "Unable to connect to the API."
        }`
      );
    }

    console.log(
      `DASHBOARD ${apiName} STATUS:`,
      response.status
    );

    console.log(
      `DASHBOARD ${apiName} CONTENT-TYPE:`,
      response.headers.get("content-type")
    );

    // Always read as text first.
    // This prevents response.json() from hiding the actual
    // response returned by Catalyst.
    const text = await response.text();

    console.log(
      `DASHBOARD ${apiName} RAW RESPONSE:`,
      text
    );

    // Empty response
    if (!text.trim()) {
      throw new Error(
        `${apiName}: API returned an empty response. HTTP ${response.status}`
      );
    }

    let result;

    try {
      result = JSON.parse(text);
    } catch (error) {
      console.error(
        `DASHBOARD ${apiName} JSON PARSE ERROR:`,
        error
      );

      throw new Error(
        `${apiName}: Invalid JSON returned by API. HTTP ${response.status}. Response: ${text.slice(
          0,
          250
        )}`
      );
    }

    // HTTP error
    if (!response.ok) {
      throw new Error(
        `${apiName}: ${
          result?.message ||
          result?.error ||
          result?.data?.message ||
          `API failed with status ${response.status}`
        }`
      );
    }

    return result;
  }, []);

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  const loadDashboard = useCallback(async () => {
    if (running) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      console.log(
        "======================================"
      );

      console.log(
        "Loading dashboard data..."
      );

      console.log(
        "======================================"
      );

      // -----------------------------------------------------
      // MASTER
      // -----------------------------------------------------

      const masterResult = await fetchJson(
        `${API_BASE_URL}/master`,
        "MASTER"
      );

      console.log(
        "MASTER RESULT:",
        masterResult
      );

      // Small delay to avoid hitting Catalyst endpoints
      // simultaneously.
      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );

      // -----------------------------------------------------
      // STAGING
      // -----------------------------------------------------

      const stagingResult = await fetchJson(
        `${API_BASE_URL}/staging`,
        "STAGING"
      );

      console.log(
        "STAGING RESULT:",
        stagingResult
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );

      // -----------------------------------------------------
      // HISTORY
      // -----------------------------------------------------

      const historyResult = await fetchJson(
        `${API_BASE_URL}/history`,
        "HISTORY"
      );

      console.log(
        "HISTORY RESULT:",
        historyResult
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );

      // -----------------------------------------------------
      // APPROVAL
      // -----------------------------------------------------

      const approvalResult = await fetchJson(
        `${API_BASE_URL}/approval`,
        "APPROVAL"
      );

      console.log(
        "APPROVAL RESULT:",
        approvalResult
      );

      // =====================================================
      // MASTER COUNT
      // =====================================================

      const masterCount =
        masterResult?.success
          ? Number(
              masterResult.count ??
                masterResult.data?.length ??
                0
            )
          : 0;

      // =====================================================
      // STAGING COUNT
      // =====================================================

      const stagingCount =
        stagingResult?.success
          ? Number(
              stagingResult.count ??
                stagingResult.data?.length ??
                0
            )
          : 0;

      // =====================================================
      // HISTORY COUNT
      // =====================================================

      const historyCount =
        historyResult?.success
          ? Number(
              historyResult.count ??
                historyResult.data?.length ??
                0
            )
          : 0;

      // =====================================================
      // PENDING APPROVAL COUNT
      // =====================================================

      const approvalData =
        Array.isArray(approvalResult?.data)
          ? approvalResult.data
          : [];

      const approvalCount =
        approvalResult?.success
          ? approvalData.filter((item) => {
              return (
                String(
                  item?.Status || ""
                ).toLowerCase() === "pending"
              );
            }).length
          : 0;

      // =====================================================
      // UPDATE DASHBOARD
      // =====================================================

      setStats({
        master: masterCount,
        staging: stagingCount,
        history: historyCount,
        approval: approvalCount,
      });

      console.log(
        "======================================"
      );

      console.log(
        "DASHBOARD STATS:",
        {
          master: masterCount,
          staging: stagingCount,
          history: historyCount,
          approval: approvalCount,
        }
      );

      console.log(
        "Dashboard loaded successfully."
      );

      console.log(
        "======================================"
      );
    } catch (error) {
      console.error(
        "======================================"
      );

      console.error(
        "Dashboard loading error:",
        error
      );

      console.error(
        "======================================"
      );

      setApiError(
        error?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchJson, running]);

  // =========================================================
  // INITIAL LOAD + AFTER TIER 1
  // =========================================================

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, refreshKey]);

  // =========================================================
  // MANUAL REFRESH
  // =========================================================

  const handleRefresh = () => {
    if (loading || running) {
      return;
    }

    loadDashboard();
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="dashboard-page"
      style={{
        paddingBottom: "40px",
      }}
    >
      {/* ===================================================
          DASHBOARD API ERROR
      ==================================================== */}

      {apiError && (
        <div
          className="error-message"
          style={{
            marginBottom: "20px",
          }}
        >
          <AlertTriangle
            size={17}
            style={{
              verticalAlign: "middle",
              marginRight: "6px",
            }}
          />

          Dashboard API Error: {apiError}
        </div>
      )}

      {/* ===================================================
          TIER 1 ERROR
      ==================================================== */}

      {runError && (
        <div
          className="error-message"
          style={{
            marginBottom: "20px",
          }}
        >
          <AlertTriangle
            size={17}
            style={{
              verticalAlign: "middle",
              marginRight: "6px",
            }}
          />

          Tier 1 Error: {runError}
        </div>
      )}

      {/* ===================================================
          TIER 1 SUCCESS
      ==================================================== */}

      {runResult && !runError && (
        <div
          className="success-message"
          style={{
            marginBottom: "20px",
          }}
        >
          <CheckCircle2
            size={17}
            style={{
              verticalAlign: "middle",
              marginRight: "6px",
            }}
          />

          Tier 1 completed successfully.
        </div>
      )}

      {/* ===================================================
          SYSTEM OVERVIEW
      ==================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "18px",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 5px",
            }}
          >
            System Overview
          </h2>

          <p
            style={{
              margin: 0,
            }}
          >
            Current records and processing state
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={handleRefresh}
          disabled={loading || running}
        >
          <RefreshCw
            size={16}
            className={
              loading ? "spin" : ""
            }
          />

          {loading
            ? "Refreshing..."
            : running
            ? "Tier 1 Running..."
            : "Refresh"}
        </button>
      </div>

      {/* ===================================================
          STAT CARDS
      ==================================================== */}

      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        <DashboardCard
          icon={<Database size={22} />}
          title="Master Records"
          value={
            loading ? "..." : stats.master
          }
          description="Current scrip_master records"
        />

        <DashboardCard
          icon={<FileText size={22} />}
          title="Staging Records"
          value={
            loading ? "..." : stats.staging
          }
          description="Waiting for matching"
        />

        <DashboardCard
          icon={<History size={22} />}
          title="History Records"
          value={
            loading ? "..." : stats.history
          }
          description="Recorded field changes"
        />

        <DashboardCard
          icon={<ShieldCheck size={22} />}
          title="Pending Approvals"
          value={
            loading ? "..." : stats.approval
          }
          description="Requires human review"
          warning={stats.approval > 0}
        />
      </div>

      {/* ===================================================
          MASTER + APPROVAL
      ==================================================== */}

      <div
        className="dashboard-two-column"
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "22px",
          marginBottom: "22px",
        }}
      >
        {/* MASTER & HISTORY */}

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Master &amp; History</h3>

              <p>
                Data integrity tracking
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "0 18px",
            }}
          >
            <StatusRow
              icon={<Database size={21} />}
              title="Master Records"
              description={`${stats.master} active records`}
              ok
            />

            <StatusRow
              icon={<History size={21} />}
              title="Change History"
              description={`${stats.history} recorded changes`}
              ok
            />
          </div>
        </div>

        {/* APPROVAL QUEUE */}

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Approval Queue</h3>

              <p>
                Changes requiring human review
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "18px",
            }}
          >
            {stats.approval > 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "20px",
                  border:
                    "1px solid #f0d98a",
                  borderRadius: "12px",
                  background: "#fffbea",
                }}
              >
                <AlertTriangle size={25} />

                <div>
                  <strong>
                    {stats.approval} pending approval
                    {stats.approval > 1
                      ? "s"
                      : ""}
                  </strong>

                  <p
                    style={{
                      margin: "5px 0 0",
                    }}
                  >
                    Review proposed master
                    changes before applying.
                  </p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "20px",
                }}
              >
                <CheckCircle2 size={24} />

                <div>
                  <strong>
                    No pending approvals
                  </strong>

                  <p
                    style={{
                      margin: "5px 0 0",
                    }}
                  >
                    Approval queue is clear.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          LATEST TIER 1 RESULT
      ==================================================== */}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Latest Tier 1 Run</h3>

            <p>
              Deterministic ISIN matching result
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "20px",
          }}
        >
          {!runResult ? (
            <div className="table-empty">
              <Play size={20} />

              <span>
                No Tier 1 run from this session yet.
              </span>
            </div>
          ) : (
            <div
              className="tier1-result-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(5, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              <RunValue
                title="Run ID"
                value={
                  runResult.runId || "-"
                }
              />

              <RunValue
                title="Staging"
                value={
                  runResult.counts
                    ?.totalStaging ?? 0
                }
              />

              <RunValue
                title="Matched"
                value={
                  runResult.counts
                    ?.matched ?? 0
                }
              />

              <RunValue
                title="Updated"
                value={
                  runResult.counts
                    ?.updated ?? 0
                }
              />

              <RunValue
                title="New Records"
                value={
                  runResult.counts
                    ?.newRecords ?? 0
                }
              />

              <RunValue
                title="Unchanged"
                value={
                  runResult.counts
                    ?.unchanged ?? 0
                }
              />

              <RunValue
                title="Unmatched"
                value={
                  runResult.counts
                    ?.unmatched ?? 0
                }
              />

              <RunValue
                title="Errors"
                value={
                  runResult.counts
                    ?.errors ?? 0
                }
              />

              <RunValue
                title="Duplicates"
                value={
                  runResult.counts
                    ?.duplicateStaging ?? 0
                }
              />

              <RunValue
                title="Duration"
                value={`${runResult.duration ?? 0} ms`}
              />
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          AI TIER 2
      ==================================================== */}

      <div
        className="panel"
        style={{
          marginTop: "22px",
        }}
      >
        <div className="panel-header">
          <div>
            <h3>AI Tier 2</h3>

            <p>
              Unresolved records requiring agent
              investigation
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Bot size={24} />

            <div>
              <strong>
                NOT CONNECTED
              </strong>

              <p
                style={{
                  margin: "5px 0 0",
                }}
              >
                AI Tier 2 will process unresolved
                ISIN records after Tier 1.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// DASHBOARD CARD
// =========================================================

function DashboardCard({
  icon,
  title,
  value,
  description,
  warning,
}) {
  return (
    <div
      className="stat-card"
      style={{
        minHeight: "145px",
        border: warning
          ? "1px solid #f0c84b"
          : undefined,
      }}
    >
      <div className="stat-icon">
        {icon}
      </div>

      <div
        className="stat-card-content"
        style={{
          minWidth: 0,
        }}
      >
        <p>{title}</p>

        <h3>{value}</h3>

        <span
          style={{
            color: "#718096",
            fontSize: "14px",
          }}
        >
          {description}
        </span>
      </div>
    </div>
  );
}

// =========================================================
// STATUS ROW
// =========================================================

function StatusRow({
  icon,
  title,
  description,
  ok,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "17px 0",
        borderBottom:
          "1px solid #edf0f5",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          minWidth: "42px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eef5ff",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <strong>{title}</strong>

        <p
          style={{
            margin: "4px 0 0",
          }}
        >
          {description}
        </p>
      </div>

      {ok && (
        <CheckCircle2
          size={21}
          style={{
            color: "#16a34a",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}

// =========================================================
// RUN VALUE
// =========================================================

function RunValue({
  title,
  value,
}) {
  return (
    <div
      style={{
        padding: "14px",
        border:
          "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fafbfc",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <small
        style={{
          display: "block",
          color: "#718096",
          marginBottom: "6px",
        }}
      >
        {title}
      </small>

      <strong
        style={{
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

export default Dashboard;