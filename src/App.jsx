// import { useState } from "react";
// import {
//   LayoutDashboard,
//   Database,
//   FileText,
//   History,
//   Play,
//   ShieldCheck,
// } from "lucide-react";


// import Sidebar from "./components/Sidebar";
// import Header from "./components/Header";

// import Master from "./pages/Master";
// import Staging from "./pages/Staging";
// import ChangeHistory from "./pages/ChangeHistory";
// import RunHistory from "./pages/RunHistory";
// import ApprovalQueue from "./pages/ApprovalQueue";
// import Dashboard from "./pages/Dashboard";

// import "./styles.css";

// const API_BASE_URL =
//   "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

// function App() {
//   const [activePage, setActivePage] =
//     useState("Dashboard");

//   const [running, setRunning] =
//     useState(false);

//   const [runResult, setRunResult] =
//     useState(null);

//   const [runError, setRunError] =
//     useState("");

//   const [refreshKey, setRefreshKey] =
//     useState(0);

//   const menuItems = [
//     {
//       name: "Dashboard",
//       icon: LayoutDashboard,
//     },
//     {
//       name: "Scrip Master",
//       icon: Database,
//     },
//     {
//       name: "Staging",
//       icon: FileText,
//     },
//     {
//       name: "Change History",
//       icon: History,
//     },
//     {
//       name: "Approval Queue",
//       icon: ShieldCheck,
//     },
//     {
//       name: "Run History",
//       icon: History,
//     },
//   ];

//   // =========================================================
//   // RUN TIER 1
//   // =========================================================

//   const handleRunTier1 = async () => {
//     if (running) {
//       return;
//     }

//     console.log(
//       "================================="
//     );

//     console.log(
//       "RUN TIER 1 BUTTON CLICKED"
//     );

//     console.log(
//       "================================="
//     );

//     setRunning(true);
//     setRunError("");
//     setRunResult(null);

//     const url =
//       `${API_BASE_URL}/tier1/run`;

//     try {
//       console.log(
//         "TIER 1 REQUEST:",
//         url
//       );

//       /*
//        * Tier 1 does not need a request body.
//        *
//        * We intentionally do NOT send:
//        *
//        * Content-Type: application/json
//        * body: JSON.stringify({})
//        *
//        * This avoids unnecessary CORS preflight
//        * for the browser.
//        */

//       const response = await fetch(
//         url,
//         {
//           method: "POST",
//         }
//       );

//       console.log(
//         "TIER 1 STATUS:",
//         response.status
//       );

//       const text =
//         await response.text();

//       console.log(
//         "TIER 1 RESPONSE:",
//         text
//       );

//       let result;

//       try {
//         result = JSON.parse(text);
//       } catch {
//         throw new Error(
//           "Tier 1 API returned invalid JSON."
//         );
//       }

//       console.log(
//         "TIER 1 RESULT:",
//         result
//       );

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             `Tier 1 request failed with status ${response.status}`
//         );
//       }

//       if (!result.success) {
//         throw new Error(
//           result.message ||
//             "Tier 1 run failed."
//         );
//       }

//       // Store successful result
//       setRunResult(result);

//       // Tell Dashboard to reload all counts
//       setRefreshKey(
//         (previous) =>
//           previous + 1
//       );

//     } catch (error) {
//       console.error(
//         "TIER 1 ERROR:",
//         error
//       );

//       setRunError(
//         error.message ||
//           "Failed to run Tier 1."
//       );

//     } finally {
//       setRunning(false);
//     }
//   };

//   return (
//     <div className="app">

//       {/* =====================================================
//           SIDEBAR
//       ====================================================== */}

//       <aside className="sidebar">

//         <div className="logo">

//           <div className="logo-icon">
//             N
//           </div>

//           <div>
//             <h2>NSE Scrip</h2>
//             <span>
//               Master Update
//             </span>
//           </div>

//         </div>

//         <nav className="navigation">

//           {menuItems.map(
//             (item) => {

//               const Icon =
//                 item.icon;

//               return (
//                 <button
//                   key={item.name}
//                   className={`nav-item ${
//                     activePage ===
//                     item.name
//                       ? "active"
//                       : ""
//                   }`}
//                   onClick={() =>
//                     setActivePage(
//                       item.name
//                     )
//                   }
//                 >
//                   <Icon
//                     size={19}
//                   />

//                   <span>
//                     {item.name}
//                   </span>
//                 </button>
//               );
//             }
//           )}

//         </nav>

//         <div className="sidebar-footer">
//           <span>
//             Frontend
//           </span>

//           <strong>
//             v1.0
//           </strong>
//         </div>

//       </aside>

//       {/* =====================================================
//           MAIN
//       ====================================================== */}

//       <main className="main">

//         {/* ===================================================
//             TOP BAR
//         ==================================================== */}

//         <header
//           className="topbar"
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent:
//               "space-between",
//             gap: "20px",
//           }}
//         >

//           <div>
//             <h1>
//               {activePage}
//             </h1>

//             <p>
//               NSE Scrip Master Auto Update
//             </p>
//           </div>

//           {/* =================================================
//               RUN TIER 1 BUTTON
//           ================================================= */}

//           <button
//             className="run-button"
//             onClick={
//               handleRunTier1
//             }
//             disabled={running}
//             style={{
//               marginLeft:
//                 "auto",
//               flexShrink: 0,
//               display:
//                 "inline-flex",
//               alignItems:
//                 "center",
//               justifyContent:
//                 "center",
//               gap: "8px",
//               whiteSpace:
//                 "nowrap",
//             }}
//           >

//             <Play
//               size={17}
//             />

//             {running
//               ? "Running..."
//               : "Update Scrip Master"}

//           </button>

//         </header>

//         {/* ===================================================
//             PAGE CONTENT
//         ==================================================== */}

//         <section className="content">

//           {/* DASHBOARD */}

//           {activePage ===
//             "Dashboard" && (
//             <Dashboard
//               refreshKey={
//                 refreshKey
//               }
//               running={
//                 running
//               }
//               runResult={
//                 runResult
//               }
//               runError={
//                 runError
//               }
//             />
//           )}

//           {/* SCRIP MASTER */}

//           {activePage ===
//             "Scrip Master" && (
//             <Master />
//           )}

//           {/* STAGING */}

//           {activePage ===
//             "Staging" && (
//             <Staging />
//           )}

//           {/* CHANGE HISTORY */}

//           {activePage ===
//             "Change History" && (
//             <ChangeHistory />
//           )}

//           {/* APPROVAL QUEUE */}

//           {activePage ===
//             "Approval Queue" && (
//             <ApprovalQueue />
//           )}

//           {/* RUN HISTORY */}

//           {activePage ===
//             "Run History" && (
//             <RunHistory />
//           )}

//         </section>

//       </main>

//     </div>
//   );
// }

// export default App;


import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Database,
  FileText,
  History,
  Play,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Master from "./pages/Master";
import Staging from "./pages/Staging";
import ChangeHistory from "./pages/ChangeHistory";
import RunHistory from "./pages/RunHistory";
import ApprovalQueue from "./pages/ApprovalQueue";
import Dashboard from "./pages/Dashboard";

import "./styles.css";

const API_BASE_URL =
  "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

function App() {
  // Keep the current page after browser refresh.
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activePage") || "Dashboard";
  });

  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  // =========================================================
  // TIER 1 STATE
  // =========================================================

  const [running, setRunning] =
    useState(false);

  const [runResult, setRunResult] =
    useState(null);

  const [runError, setRunError] =
    useState("");

  // =========================================================
  // TIER 2 STATE
  // =========================================================

  const [runningTier2, setRunningTier2] =
    useState(false);

  const [tier2Result, setTier2Result] =
    useState(null);

  const [tier2Error, setTier2Error] =
    useState("");

  // =========================================================
  // DASHBOARD REFRESH
  // =========================================================

  const [refreshKey, setRefreshKey] =
    useState(0);

  // =========================================================
  // MENU
  // =========================================================

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
      icon: ShieldCheck,
    },
    {
      name: "Run History",
      icon: History,
    },
  ];

  // =========================================================
  // RUN TIER 1
  // =========================================================

  const handleRunTier1 = async () => {
    if (running || runningTier2) {
      return;
    }

    console.log(
      "================================="
    );

    console.log(
      "RUN TIER 1 BUTTON CLICKED"
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

      const response = await fetch(
        url,
        {
          method: "POST",
        }
      );

      console.log(
        "TIER 1 STATUS:",
        response.status
      );

      const text =
        await response.text();

      console.log(
        "TIER 1 RESPONSE:",
        text
      );

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          "Tier 1 API returned invalid JSON."
        );
      }

      console.log(
        "TIER 1 RESULT:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Tier 1 request failed with status ${response.status}`
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            "Tier 1 run failed."
        );
      }

      setRunResult(result);

      // Refresh Dashboard
      setRefreshKey(
        (previous) =>
          previous + 1
      );
    } catch (error) {
      console.error(
        "TIER 1 ERROR:",
        error
      );

      setRunError(
        error.message ||
          "Failed to run Tier 1."
      );
    } finally {
      setRunning(false);
    }
  };

  // =========================================================
  // RUN TIER 2
  // =========================================================

  const handleRunTier2 = async () => {
    if (runningTier2 || running) {
      return;
    }

    console.log(
      "================================="
    );

    console.log(
      "RUN TIER 2 BUTTON CLICKED"
    );

    console.log(
      "================================="
    );

    setRunningTier2(true);
    setTier2Error("");
    setTier2Result(null);

    const url =
      `${API_BASE_URL}/tier2/run`;

    try {
      console.log(
        "TIER 2 REQUEST:",
        url
      );

      /*
       * Tier 2 does not need a request body.
       *
       * We intentionally use a simple POST,
       * same as Tier 1.
       */

      const response = await fetch(
        url,
        {
          method: "POST",
        }
      );

      console.log(
        "TIER 2 STATUS:",
        response.status
      );

      const text =
        await response.text();

      console.log(
        "TIER 2 RESPONSE:",
        text
      );

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          "Tier 2 API returned invalid JSON."
        );
      }

      console.log(
        "TIER 2 RESULT:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Tier 2 request failed with status ${response.status}`
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            "Tier 2 run failed."
        );
      }

      // Store Tier 2 result
      setTier2Result(result);

      // Refresh Dashboard
      setRefreshKey(
        (previous) =>
          previous + 1
      );

      /*
       * Optional:
       * After Tier 2 finishes, open Approval Queue
       * so the human can review the proposals.
       */

      setActivePage(
        "Approval Queue"
      );

    } catch (error) {
      console.error(
        "TIER 2 ERROR:",
        error
      );

      setTier2Error(
        error.message ||
          "Failed to run Tier 2."
      );
    } finally {
      setRunningTier2(false);
    }
  };

  return (
    <div className="app">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

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

          {menuItems.map(
            (item) => {

              const Icon =
                item.icon;

              return (
                <button
                  key={item.name}
                  className={`nav-item ${
                    activePage ===
                    item.name
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActivePage(
                      item.name
                    )
                  }
                >
                  <Icon
                    size={19}
                  />

                  <span>
                    {item.name}
                  </span>
                </button>
              );
            }
          )}

        </nav>

        <div className="sidebar-footer">
          <span>
            Frontend
          </span>

          <strong>
            v1.0
          </strong>
        </div>

      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="main">

        {/* ===================================================
            TOP BAR
        ==================================================== */}

        <header
          className="topbar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "12px",
          }}
        >

          <div>
            <h1>
              {activePage}
            </h1>

            <p>
              NSE Scrip Master Auto Update
            </p>
          </div>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >

            {/* ===============================================
                TIER 1
            ================================================ */}

            <button
              className="run-button"
              onClick={
                handleRunTier1
              }
              disabled={
                running ||
                runningTier2
              }
              style={{
                flexShrink: 0,
                display:
                  "inline-flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: "8px",
                whiteSpace:
                  "nowrap",
              }}
            >

              <Play
                size={17}
              />

              {running
                ? "Running..."
                : "Update Scrip Master"}

            </button>

            {/* ===============================================
                TIER 2
            ================================================ */}

            <button
              className="run-button"
              onClick={
                handleRunTier2
              }
              disabled={
                running ||
                runningTier2
              }
              style={{
                flexShrink: 0,
                display:
                  "inline-flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: "8px",
                whiteSpace:
                  "nowrap",
              }}
               title="Find possible matches for unresolved records and send them to the Approval Queue for review."
            >

              <ShieldCheck
                size={17}
              />

              {runningTier2
                ? "Running Tier 2..."
                : "Review Unmatched Records"}

            </button>

          </div>

        </header>

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}

        <section className="content">

          {/* DASHBOARD */}

          {activePage ===
            "Dashboard" && (
            <Dashboard
              refreshKey={
                refreshKey
              }

              running={
                running
              }

              runResult={
                runResult
              }

              runError={
                runError
              }

              tier2Result={
                tier2Result
              }

              tier2Error={
                tier2Error
              }
            />
          )}

          {/* SCRIP MASTER */}

          {activePage ===
            "Scrip Master" && (
            <Master />
          )}

          {/* STAGING */}

          {activePage ===
            "Staging" && (
            <Staging />
          )}

          {/* CHANGE HISTORY */}

          {activePage ===
            "Change History" && (
            <ChangeHistory />
          )}

          {/* APPROVAL QUEUE */}

          {activePage ===
            "Approval Queue" && (
            <ApprovalQueue />
          )}

          {/* RUN HISTORY */}

          {activePage ===
            "Run History" && (
            <RunHistory />
          )}

        </section>

      </main>

    </div>
  );
}

export default App;