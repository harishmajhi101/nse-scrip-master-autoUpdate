import {
  LayoutDashboard,
  Database,
  FileText,
  History,
  ShieldCheck,
  Clock3,
  X,
} from "lucide-react";

function Sidebar({
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "master",
      label: "Scrip Master",
      icon: Database,
    },
    {
      id: "staging",
      label: "Staging",
      icon: FileText,
    },
    {
      id: "history",
      label: "Change History",
      icon: History,
    },
    {
      id: "approval",
      label: "Approval Queue",
      icon: ShieldCheck,
    },
    {
      id: "run-history",
      label: "Run History",
      icon: Clock3,
    },
  ];

  const handleNavigation = (id) => {
    setActivePage(id);

    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="logo">
          <div className="logo-icon">N</div>

          <div className="logo-text">
            <h2>NSE Scrip</h2>
            <span>Master Update</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => handleNavigation(item.id)}
              >
                <Icon size={19} />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span>NSE Auto Update</span>
          <span>v1.0</span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;