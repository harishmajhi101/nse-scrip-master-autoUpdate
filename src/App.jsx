import { useState } from "react";
import {
  LayoutDashboard,
  Database,
  FileText,
  History,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Master from "./pages/Master";
import Staging from "./pages/Staging";
import ChangeHistory from "./pages/ChangeHistory";
import RunHistory from "./pages/RunHistory";
import ApprovalQueue from "./pages/ApprovalQueue";

import "./styles.css";

function App() {
  const [activePage, setActivePage] =
    useState("Dashboard");

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

      {/* =================================================
          SIDEBAR
      ================================================= */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">
            N
          </div>

          <div>
            <h2>NSE Scrip</h2>
            <span>
              Master Update
            </span>
          </div>
        </div>

        <nav className="navigation">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                type="button"
                className={`nav-item ${
                  activePage === item.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActivePage(item.name)
                }
              >
                <Icon size={19} />

                <span>
                  {item.name}
                </span>
              </button>
            );
          })}

        </nav>

        <div className="sidebar-footer">
          <span>Frontend</span>
          <strong>v1.0</strong>
        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}
      <main className="main">

        {/* =================================================
            TOP BAR
        ================================================= */}
        <header className="topbar">

          <div>
            <h1>
              {activePage}
            </h1>

            <p>
              NSE Scrip Master Auto Update
            </p>
          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}
        <section className="content">

          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <Dashboard />
          )}

          {/* SCRIP MASTER */}
          {activePage === "Scrip Master" && (
            <Master />
          )}

          {/* STAGING */}
          {activePage === "Staging" && (
            <Staging />
          )}

          {/* CHANGE HISTORY */}
          {activePage === "Change History" && (
            <ChangeHistory />
          )}

          {/* APPROVAL QUEUE */}
          {activePage === "Approval Queue" && (
            <ApprovalQueue />
          )}

          {/* RUN HISTORY */}
          {activePage === "Run History" && (
            <RunHistory />
          )}

        </section>

      </main>

    </div>
  );
}

export default App;