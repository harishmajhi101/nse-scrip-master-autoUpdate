import { Play, RefreshCw } from "lucide-react";

function Header({
  title,
  subtitle,
  onRun,
  running = false,
  onMenuClick,
}) {
  return (
    <header className="topbar">

      <div className="topbar-left">

        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div>
          <h1>{title}</h1>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>

      </div>

      <button
        className="run-button"
        onClick={onRun}
        disabled={running}
      >
        <Play size={17} />

        {running ? "Running..." : "Run Tier 1"}
      </button>

    </header>
  );
}

export default Header;