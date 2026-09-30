import { useEffect, useState } from "react";
import {
  Play,
  RefreshCw,
  Database,
  FileText,
  History,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  Brain,
  GitMerge,
  Clock,
} from "lucide-react";

const API_BASE_URL =
  "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

function Dashboard() {
  const [running, setRunning] = useState(false);

  const [stats, setStats] = useState({
    master: 0,
    staging: 0,
    history: 0,
    approval: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState("");
  const [apiError, setApiError] = useState("");

  // =========================================================
  // GET JSON
  // =========================================================

  const getJson = async (url) => {
    console.log("API REQUEST:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    console.log("API STATUS:", response.status);

    const text = await response.text();

    console.log("API RESPONSE:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Invalid JSON response from ${url}`
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          `Request failed with status ${response.status}`
      );
    }

    return data;
  };

  // =========================================================
  // LOAD COUNT
  // =========================================================

  const loadCount = async (endpoint) => {
    try {
      const result = await getJson(
        `${API_BASE_URL}/${endpoint}`
      );

      if (!result.success) {
        return 0;
      }

      if (typeof result.count === "number") {
        return result.count;
      }

      if (Array.isArray(result.data)) {
        return result.data.length;
      }

      return 0;
    } catch (error) {
      console.error(
        `${endpoint} API error:`,
        error
      );

      return 0;
    }
  };

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    setApiError("");

    try {
      const masterCount =
        await loadCount("master");

      const stagingCount =
        await loadCount("staging");

      const historyCount =
        await loadCount("history");

      let approvalCount = 0;

      try {
        const approvalResult =
          await getJson(
            `${API_BASE_URL}/approval`
          );

        if (
          approvalResult.success &&
          Array.isArray(approvalResult.data)
        ) {
          approvalCount =
            approvalResult.data.filter(
              (item) =>
                String(item.Status || "")
                  .toLowerCase() === "pending"
            ).length;
        }
      } catch (error) {
        console.error(
          "Approval API error:",
          error
        );
      }

      setStats({
        master: masterCount,
        staging: stagingCount,
        history: historyCount,
        approval: approvalCount,
      });
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setApiError(
        error.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoadingStats(false);
    }
  };

  // =========================================================
  // RUN TIER 1
  // =========================================================

  const handleRunNow = async () => {
    console.log(
      "================================="
    );

    console.log(
      "RUN NOW BUTTON CLICKED"
    );

    console.log(
      "================================="
    );

    setRunning(true);
    setRunError("");
    setRunResult(null);

    const url =
      `${API_BASE_URL}/tier1/run`;

    try {
      console.log(
        "TIER 1 REQUEST:",
        url
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({}),
      });

      console.log(
        "TIER 1 HTTP STATUS:",
        response.status
      );

      const text =
        await response.text();

      console.log(
        "TIER 1 RAW RESPONSE:",
        text
      );

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          "Tier 1 returned invalid JSON."
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Tier 1 HTTP error ${response.status}`
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            "Tier 1 run failed."
        );
      }

      setRunResult(result);

      await fetchDashboardStats();

    } catch (error) {
      console.error(
        "TIER 1 RUN ERROR:",
        error
      );

      setRunError(
        error.message ||
          "Unable to run Tier 1."
      );
    } finally {
      setRunning(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="dashboard-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="page-heading">

        <div>
          <h2>
            NSE Scrip Master Control Center
          </h2>

          <p>
            Monitor ingestion, matching,
            master updates and approvals
          </p>
        </div>

        <button
          type="button"
          className="run-button"
          onClick={handleRunNow}
          disabled={running}
        >
          {running ? (
            <RefreshCw
              size={18}
              className="spin"
            />
          ) : (
            <Play size={18} />
          )}

          {running
            ? "Running..."
            : "Run Tier 1"}
        </button>

      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {apiError && (
        <div className="error-message">
          <AlertTriangle size={18} />

          <span>
            Dashboard API Error:{" "}
            {apiError}
          </span>
        </div>
      )}

      {runError && (
        <div className="error-message">
          <AlertTriangle size={18} />

          <span>
            Tier 1 Error:{" "}
            {runError}
          </span>
        </div>
      )}



      {/* =====================================================
          DATABASE / PROCESSING METRICS
      ====================================================== */}

      <div className="section-title">
        <div>
          <h3>
            System Overview
          </h3>

          <p>
            Current records and processing state
          </p>
        </div>
      </div>

      <div className="dashboard-grid">

        <MetricCard
          icon={<Database size={22} />}
          title="Master Records"
          value={
            loadingStats
              ? "..."
              : stats.master
          }
          description="scrip_master"
        />

        <MetricCard
          icon={<FileText size={22} />}
          title="Staging Records"
          value={
            loadingStats
              ? "..."
              : stats.staging
          }
          description="Waiting for matching"
        />

        <MetricCard
          icon={<History size={22} />}
          title="History Records"
          value={
            loadingStats
              ? "..."
              : stats.history
          }
          description="Recorded field changes"
        />

        <MetricCard
          icon={<ShieldCheck size={22} />}
          title="Pending Approvals"
          value={
            loadingStats
              ? "..."
              : stats.approval
          }
          description="Requires review"
          warning={stats.approval > 0}
        />

      </div>

      {/* =====================================================
          LATEST TIER 1
      ====================================================== */}

      {runResult && (
        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>
                Latest Tier 1 Run
              </h3>

              <p>
                Deterministic ISIN matching result
              </p>
            </div>

            <div className="status-success">
              <CheckCircle2 size={17} />

              SUCCESS
            </div>

          </div>

          <div className="run-info">

            <div>
              <span>Run ID</span>

              <strong>
                {runResult.runId}
              </strong>
            </div>

            <div>
              <span>Duration</span>

              <strong>
                {runResult.duration ?? 0} ms
              </strong>
            </div>

          </div>

          <div className="run-summary">

            <RunMetric
              label="Staging"
              value={
                runResult.counts
                  ?.totalStaging ?? 0
              }
            />

            <RunMetric
              label="Matched"
              value={
                runResult.counts
                  ?.matched ?? 0
              }
            />

            <RunMetric
              label="Updated"
              value={
                runResult.counts
                  ?.updated ?? 0
              }
            />

            <RunMetric
              label="New Records"
              value={
                runResult.counts
                  ?.newRecords ?? 0
              }
            />

            <RunMetric
              label="Unchanged"
              value={
                runResult.counts
                  ?.unchanged ?? 0
              }
            />

            <RunMetric
              label="Unmatched"
              value={
                runResult.counts
                  ?.unmatched ?? 0
              }
            />

            <RunMetric
              label="Duplicates"
              value={
                runResult.counts
                  ?.duplicateStaging ?? 0
              }
            />

            <RunMetric
              label="Errors"
              value={
                runResult.counts
                  ?.errors ?? 0
              }
              error={
                (runResult.counts
                  ?.errors ?? 0) > 0
              }
            />

          </div>

        </div>
      )}

      {/* =====================================================
          PROCESSING DESTINATIONS
      ====================================================== */}

      <div className="dashboard-two-column">

        {/* MASTER + HISTORY */}

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

          <div className="operation-row">

            <div className="operation-icon">
              <Database size={20} />
            </div>

            <div>
              <strong>
                Master Records
              </strong>

              <span>
                {stats.master} active records
              </span>
            </div>

            <CheckCircle2
              size={20}
              className="success-icon"
            />

          </div>

          <div className="operation-row">

            <div className="operation-icon">
              <History size={20} />
            </div>

            <div>
              <strong>
                Change History
              </strong>

              <span>
                {stats.history} recorded changes
              </span>
            </div>

            <CheckCircle2
              size={20}
              className="success-icon"
            />

          </div>

        </div>

        {/* APPROVAL */}

        <div className="panel">

          <div className="panel-header">

            <div>
              <h3>
                Approval Queue
              </h3>

              <p>
                Changes requiring human review
              </p>
            </div>

          </div>

          {stats.approval > 0 ? (
            <div className="alert-box">

              <AlertTriangle size={22} />

              <div>
                <strong>
                  {stats.approval} pending
                  approval
                  {stats.approval !== 1
                    ? "s"
                    : ""}
                </strong>

                <span>
                  Review proposed master
                  changes before applying.
                </span>
              </div>

            </div>
          ) : (
            <div className="clear-box">

              <CheckCircle2 size={22} />

              <div>
                <strong>
                  No pending approvals
                </strong>

                <span>
                  Approval queue is clear.
                </span>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          AI TIER 2
      ====================================================== */}

      <div className="panel">

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

          <div className="status-info">
            <Brain size={17} />

            NOT CONNECTED
          </div>

        </div>

        <div className="ai-status">

          <Brain size={32} />

          <div>
            <strong>
              AI Agent Layer
            </strong>

            <span>
              Tier 2 agent processing will
              handle unresolved ISINs after
              Tier 1 matching.
            </span>
          </div>

        </div>

      </div>

      {/* =====================================================
          REFRESH
      ====================================================== */}

      <div className="dashboard-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={fetchDashboardStats}
          disabled={loadingStats}
        >
          <RefreshCw
            size={16}
            className={
              loadingStats
                ? "spin"
                : ""
            }
          />

          Refresh Dashboard
        </button>

      </div>

    </div>
  );
}

// =========================================================
// PIPELINE COMPONENT
// =========================================================

function PipelineStep({
  icon,
  title,
  status,
  description,
  type,
}) {
  return (
    <div
      className={`pipeline-step ${type}`}
    >
      <div className="pipeline-icon">
        {icon}
      </div>

      <strong>
        {title}
      </strong>

      <span>
        {status}
      </span>

      <small>
        {description}
      </small>
    </div>
  );
}

// =========================================================
// METRIC CARD
// =========================================================

function MetricCard({
  icon,
  title,
  value,
  description,
  warning = false,
}) {
  return (
    <div
      className={`metric-card ${
        warning
          ? "metric-warning"
          : ""
      }`}
    >
      <div className="metric-icon">
        {icon}
      </div>

      <div>
        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {description}
        </small>
      </div>
    </div>
  );
}

// =========================================================
// RUN METRIC
// =========================================================

function RunMetric({
  label,
  value,
  error = false,
}) {
  return (
    <div
      className={`run-metric ${
        error
          ? "run-metric-error"
          : ""
      }`}
    >
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

export default Dashboard;