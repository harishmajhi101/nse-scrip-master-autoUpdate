import { useEffect, useState } from "react";

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

function Dashboard({
  refreshKey,
  running,
  runResult,
  runError,
}) {
  const [stats, setStats] =
    useState({
      master: 0,
      staging: 0,
      history: 0,
      approval: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [apiError, setApiError] =
    useState("");

  // =========================================================
  // API HELPER
  // =========================================================

  const fetchJson = async (
    url
  ) => {
    console.log(
      "DASHBOARD API REQUEST:",
      url
    );

    const response =
      await fetch(url);

    console.log(
      "DASHBOARD API STATUS:",
      response.status
    );

    const text =
      await response.text();

    console.log(
      "DASHBOARD API RESPONSE:",
      text
    );

    let result;

    try {
      result =
        JSON.parse(text);
    } catch {
      throw new Error(
        "Invalid JSON returned by API."
      );
    }

    if (!response.ok) {
      throw new Error(
        result.message ||
          `API failed with status ${response.status}`
      );
    }

    return result;
  };

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  const loadDashboard =
    async () => {
      setLoading(true);
      setApiError("");

      try {

        const [
          masterResult,
          stagingResult,
          historyResult,
          approvalResult,
        ] =
          await Promise.all([
            fetchJson(
              `${API_BASE_URL}/master`
            ),

            fetchJson(
              `${API_BASE_URL}/staging`
            ),

            fetchJson(
              `${API_BASE_URL}/history`
            ),

            fetchJson(
              `${API_BASE_URL}/approval`
            ),
          ]);

        // -----------------------------------------------
        // MASTER
        // -----------------------------------------------

        const masterCount =
          masterResult.success
            ? masterResult.count ??
              masterResult.data
                ?.length ??
              0
            : 0;

        // -----------------------------------------------
        // STAGING
        // -----------------------------------------------

        const stagingCount =
          stagingResult.success
            ? stagingResult.count ??
              stagingResult.data
                ?.length ??
              0
            : 0;

        // -----------------------------------------------
        // HISTORY
        // -----------------------------------------------

        const historyCount =
          historyResult.success
            ? historyResult.count ??
              historyResult.data
                ?.length ??
              0
            : 0;

        // -----------------------------------------------
        // APPROVAL
        // -----------------------------------------------

        const approvalCount =
          approvalResult.success
            ? (
                approvalResult.data ||
                []
              ).filter(
                (item) =>
                  String(
                    item.Status ||
                      ""
                  ).toLowerCase() ===
                  "pending"
              ).length
            : 0;

        setStats({
          master:
            masterCount,

          staging:
            stagingCount,

          history:
            historyCount,

          approval:
            approvalCount,
        });

      } catch (error) {

        console.error(
          "Dashboard loading error:",
          error
        );

        setApiError(
          error.message ||
            "Failed to load dashboard."
        );

      } finally {
        setLoading(false);
      }
    };

  // =========================================================
  // INITIAL LOAD + AFTER TIER 1
  // =========================================================

  useEffect(() => {
    loadDashboard();
  }, [refreshKey]);

  // =========================================================
  // MANUAL REFRESH
  // =========================================================

  const handleRefresh =
    () => {
      loadDashboard();
    };

  return (
    <div
      className="dashboard-page"
      style={{
        paddingBottom:
          "40px",
      }}
    >

      {/* ===================================================
          ERROR FROM DASHBOARD API
      ==================================================== */}

      {apiError && (
        <div
          className="error-message"
          style={{
            marginBottom:
              "20px",
          }}
        >
          Dashboard API Error:{" "}
          {apiError}
        </div>
      )}

      {/* ===================================================
          TIER 1 ERROR
      ==================================================== */}

      {runError && (
        <div
          className="error-message"
          style={{
            marginBottom:
              "20px",
          }}
        >
          <AlertTriangle
            size={17}
            style={{
              verticalAlign:
                "middle",
              marginRight:
                "6px",
            }}
          />

          Tier 1 Error:{" "}
          {runError}
        </div>
      )}

      {/* ===================================================
          TIER 1 SUCCESS
      ==================================================== */}

      {runResult && (
        <div
          className="success-message"
          style={{
            marginBottom:
              "20px",
          }}
        >
          <CheckCircle2
            size={17}
            style={{
              verticalAlign:
                "middle",
              marginRight:
                "6px",
            }}
          />

          Tier 1 completed
          successfully.
        </div>
      )}

      {/* ===================================================
          SYSTEM OVERVIEW
      ==================================================== */}

      <div
        style={{
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
          marginBottom:
            "18px",
        }}
      >

        <div>
          <h2
            style={{
              margin:
                "0 0 5px",
            }}
          >
            System Overview
          </h2>

          <p
            style={{
              margin: 0,
            }}
          >
            Current records and
            processing state
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={
            handleRefresh
          }
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

          Refresh
        </button>

      </div>

      {/* ===================================================
          STAT CARDS
      ==================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "18px",
          marginBottom:
            "28px",
        }}
      >

        {/* MASTER */}

        <DashboardCard
          icon={
            <Database
              size={22}
            />
          }
          title="Master Records"
          value={
            loading
              ? "..."
              : stats.master
          }
          description="Current scrip_master records"
        />

        {/* STAGING */}

        <DashboardCard
          icon={
            <FileText
              size={22}
            />
          }
          title="Staging Records"
          value={
            loading
              ? "..."
              : stats.staging
          }
          description="Waiting for matching"
        />

        {/* HISTORY */}

        <DashboardCard
          icon={
            <History
              size={22}
            />
          }
          title="History Records"
          value={
            loading
              ? "..."
              : stats.history
          }
          description="Recorded field changes"
        />

        {/* APPROVAL */}

        <DashboardCard
          icon={
            <ShieldCheck
              size={22}
            />
          }
          title="Pending Approvals"
          value={
            loading
              ? "..."
              : stats.approval
          }
          description="Requires human review"
          warning={
            stats.approval > 0
          }
        />

      </div>

      {/* ===================================================
          MASTER + APPROVAL
      ==================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "22px",
          marginBottom:
            "22px",
        }}
      >

        {/* MASTER & HISTORY */}

        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>
                Master & History
              </h3>

              <p>
                Data integrity tracking
              </p>
            </div>

          </div>

          <div
            style={{
              padding:
                "0 18px",
            }}
          >

            <StatusRow
              icon={
                <Database
                  size={21}
                />
              }
              title="Master Records"
              description={`${stats.master} active records`}
              ok
            />

            <StatusRow
              icon={
                <History
                  size={21}
                />
              }
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
              <h3>
                Approval Queue
              </h3>

              <p>
                Changes requiring human
                review
              </p>
            </div>

          </div>

          <div
            style={{
              padding:
                "18px",
            }}
          >

            {stats.approval >
            0 ? (
              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "15px",
                  padding:
                    "20px",
                  border:
                    "1px solid #f0d98a",
                  borderRadius:
                    "12px",
                  background:
                    "#fffbea",
                }}
              >

                <AlertTriangle
                  size={25}
                />

                <div>
                  <strong>
                    {stats.approval}{" "}
                    pending approval
                    {stats.approval >
                    1
                      ? "s"
                      : ""}
                  </strong>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                    }}
                  >
                    Review proposed
                    master changes
                    before applying.
                  </p>
                </div>

              </div>
            ) : (
              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                  padding:
                    "20px",
                }}
              >

                <CheckCircle2
                  size={24}
                />

                <div>
                  <strong>
                    No pending approvals
                  </strong>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                    }}
                  >
                    Approval queue is
                    clear.
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
            <h3>
              Latest Tier 1 Run
            </h3>

            <p>
              Deterministic ISIN matching
              result
            </p>
          </div>

        </div>

        <div
          style={{
            padding:
              "20px",
          }}
        >

          {!runResult ? (
            <div
              className="table-empty"
            >
              <Play
                size={20}
              />

              <span>
                No Tier 1 run from this
                session yet.
              </span>
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(5, minmax(0, 1fr))",
                gap: "14px",
              }}
            >

              <RunValue
                title="Run ID"
                value={
                  runResult.runId ||
                  "-"
                }
              />

              <RunValue
                title="Staging"
                value={
                  runResult.counts
                    ?.totalStaging ??
                  0
                }
              />

              <RunValue
                title="Matched"
                value={
                  runResult.counts
                    ?.matched ??
                  0
                }
              />

              <RunValue
                title="Updated"
                value={
                  runResult.counts
                    ?.updated ??
                  0
                }
              />

              <RunValue
                title="New Records"
                value={
                  runResult.counts
                    ?.newRecords ??
                  0
                }
              />

              <RunValue
                title="Unchanged"
                value={
                  runResult.counts
                    ?.unchanged ??
                  0
                }
              />

              <RunValue
                title="Unmatched"
                value={
                  runResult.counts
                    ?.unmatched ??
                  0
                }
              />

              <RunValue
                title="Errors"
                value={
                  runResult.counts
                    ?.errors ??
                  0
                }
              />

              <RunValue
                title="Duplicates"
                value={
                  runResult.counts
                    ?.duplicateStaging ??
                  0
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
          marginTop:
            "22px",
        }}
      >

        <div className="panel-header">

          <div>
            <h3>
              AI Tier 2
            </h3>

            <p>
              Unresolved records requiring
              agent investigation
            </p>
          </div>

        </div>

        <div
          style={{
            padding:
              "20px",
          }}
        >

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "12px",
            }}
          >

            <Bot
              size={24}
            />

            <div>

              <strong>
                NOT CONNECTED
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0",
                }}
              >
                AI Tier 2 will process
                unresolved ISIN records
                after Tier 1.
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
        minHeight:
          "145px",
        border: warning
          ? "1px solid #f0c84b"
          : undefined,
      }}
    >

      <div
        className="stat-icon"
      >
        {icon}
      </div>

      <div>

        <p>
          {title}
        </p>

        <h3>
          {value}
        </h3>

        <span
          style={{
            color:
              "#718096",
            fontSize:
              "14px",
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
        display:
          "flex",
        alignItems:
          "center",
        gap: "14px",
        padding:
          "17px 0",
        borderBottom:
          "1px solid #edf0f5",
      }}
    >

      <div
        style={{
          width:
            "42px",
          height:
            "42px",
          borderRadius:
            "10px",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          background:
            "#eef5ff",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          flex: 1,
        }}
      >

        <strong>
          {title}
        </strong>

        <p
          style={{
            margin:
              "4px 0 0",
          }}
        >
          {description}
        </p>

      </div>

      {ok && (
        <CheckCircle2
          size={21}
          style={{
            color:
              "#16a34a",
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
        padding:
          "14px",
        border:
          "1px solid #e5e7eb",
        borderRadius:
          "10px",
        background:
          "#fafbfc",
      }}
    >

      <small
        style={{
          display:
            "block",
          color:
            "#718096",
          marginBottom:
            "6px",
        }}
      >
        {title}
      </small>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default Dashboard;