import { useState } from "react";
import {
  LayoutDashboard,
  Database,
  FileText,
  History,
  Play,
} from "lucide-react";

import Master from "./pages/Master";
import Staging from "./pages/Staging";
import ChangeHistory from "./pages/ChangeHistory";
import RunHistory from "./pages/RunHistory";
import ApprovalQueue from "./pages/ApprovalQueue";
import "./styles.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Scrip Master",
      icon: Database,
    },
    {
      name: "Staging",
      icon: FileText,
    },
    {
      name: "Change History",
      icon: History,
    },
    {
    name: "Approval Queue",
    icon: FileText,
  },
    {
      name: "Run History",
      icon: History,
    },
  ];

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">N</div>

          <div>
            <h2>NSE Scrip</h2>
            <span>Master Update</span>
          </div>
        </div>

        <nav className="navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span>Frontend</span>
          <strong>v1.0</strong>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {/* TOP BAR */}
        <header className="topbar">
          <div>
            <h1>{activePage}</h1>
            <p>NSE Scrip Master Auto Update</p>
          </div>

          <button className="run-button">
            <Play size={17} />
            Run Now
          </button>
        </header>

        {/* PAGE CONTENT */}
        <section className="content">
          {/* DASHBOARD */}
          {activePage === "Dashboard" && <Dashboard />}

          {/* SCRIP MASTER */}
          {activePage === "Scrip Master" && <Master />}

          {/* STAGING */}
          {activePage === "Staging" && <Staging />}

          {/* CHANGE HISTORY */}
          {activePage === "Change History" && <ChangeHistory />}

          {activePage === "Approval Queue" && <ApprovalQueue />}

          {/* RUN HISTORY */}
          {activePage === "Run History" && <RunHistory />}
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard() {
  return (
    <>
      <div className="welcome">
        <h2>Welcome to NSE Scrip Master</h2>

        <p>
          Monitor NSE scrip data, staging records, master updates and
          processing history.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Master Records"
          value="0"
          description="Current master records"
        />

        <StatCard
          title="Staging Records"
          value="0"
          description="Records waiting for processing"
        />

        <StatCard
          title="Updated"
          value="0"
          description="Records updated"
        />

        <StatCard
          title="Errors"
          value="0"
          description="Processing errors"
        />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Recent Runs</h3>

            <p>Latest NSE processing activity</p>
          </div>
        </div>

        <div className="empty-state">
          <div className="empty-icon">
            <History size={28} />
          </div>

          <h3>No runs yet</h3>

          <p>
            Once the NSE update process is connected, run information
            will appear here.
          </p>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({ title, value, description }) {
  return (
    <div className="stat-card">
      <span className="stat-title">{title}</span>

      <strong className="stat-value">{value}</strong>

      <span className="stat-description">{description}</span>
    </div>
  );
}

/* =========================================================
   STAGING
   ========================================================= */

// function Staging() {
//   return (
//     <PagePlaceholder
//       title="Staging"
//       description="Parsed NSE records will appear here before matching."
//     />
//   );
// }

/* =========================================================
   CHANGE HISTORY
   ========================================================= */

function HistoryPage() {
  return (
    <PagePlaceholder
      title="Change History"
      description="Master changes and their sources will appear here."
    />
  );
}



/* =========================================================
   COMMON PLACEHOLDER
   ========================================================= */

function PagePlaceholder({ title, description }) {
  return (
    <div className="panel">
      <div className="placeholder">
        <h2>{title}</h2>

        <p>{description}</p>
      </div>
    </div>
  );
}

export default App;