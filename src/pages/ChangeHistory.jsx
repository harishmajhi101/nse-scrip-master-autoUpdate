import { useEffect, useState } from "react";
import { Search, RefreshCw } from "lucide-react";

const API_BASE_URL =
  "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/history`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch change history"
        );
      }

      setHistoryData(result.data || []);
    } catch (err) {
      // console.error("GET /history error:", err);
      setError(
        err.message || "Failed to load change history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredData = historyData.filter((item) => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return true;
    }

    return (
      String(item.ISIN || "")
        .toLowerCase()
        .includes(value) ||
      String(item.Field || "")
        .toLowerCase()
        .includes(value) ||
      String(item.Old_Value || "")
        .toLowerCase()
        .includes(value) ||
      String(item.New_Value || "")
        .toLowerCase()
        .includes(value) ||
      String(item.Source || "")
        .toLowerCase()
        .includes(value)
    );
  });

  return (
    <div>
      <div className="page-heading">
        <div>
          <h2>Change History</h2>
          <p>History of changes made to scrip master records</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search ISIN, field, old value or new value..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="secondary-button"
          onClick={fetchHistory}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ISIN</th>
                <th>Field</th>
                <th>Old Value</th>
                <th>New Value</th>
                <th>Source</th>
                <th>Applied By</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">
                    <div className="table-empty">
                      Loading change history...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="table-empty">
                      No history records found
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={
                      item.ROWID ||
                      `${item.ISIN}-${item.Field}-${item["Time-stamp"]}`
                    }
                  >
                    <td className="isin">
                      {item.ISIN}
                    </td>

                    <td>
                      <strong>
                        {item.Field}
                      </strong>
                    </td>

                    <td>
                      {item.Old_Value || "-"}
                    </td>

                    <td>
                      {item.New_Value || "-"}
                    </td>

                    <td>
                      {item.Source || "-"}
                    </td>

                    <td>
                      {item.Applied_By || "-"}
                    </td>

                    <td>
                      {item["Time-stamp"] || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default History;