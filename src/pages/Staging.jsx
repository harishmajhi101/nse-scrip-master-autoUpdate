import { useEffect, useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";

const API_BASE_URL =
  "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

function Staging() {
  const [stagingData, setStagingData] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    ISIN: "",
    Symbol: "",
    Company_Name: "",
    Series: "EQ",
    Listing_Date: "",
    Face_Value: "",
    Source_File: "",
  });

  // =========================
  // GET STAGING RECORDS
  // =========================

  const fetchStagingData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/staging`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch staging records"
        );
      }

      setStagingData(result.data || []);
    } catch (err) {
      console.error("GET /staging error:", err);
      setError(err.message || "Failed to load staging records");
    } finally {
      setLoading(false);
    }
  };

  // Load data when page opens
  useEffect(() => {
    fetchStagingData();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // POST STAGING RECORD
  // =========================

  const handleCreateStaging = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (!formData.ISIN.trim()) {
        setError("ISIN is required");
        return;
      }

      if (!formData.Company_Name.trim()) {
        setError("Company Name is required");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/staging`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ISIN: formData.ISIN.trim(),
          Symbol: formData.Symbol.trim(),
          Company_Name: formData.Company_Name.trim(),
          Series: formData.Series || "EQ",
          Listing_Date: formData.Listing_Date || null,
          Face_Value:
            formData.Face_Value === ""
              ? null
              : Number(formData.Face_Value),
          Source_File:
            formData.Source_File.trim() || "manual",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create staging record"
        );
      }

      setSuccessMessage(
        "Staging record created successfully"
      );

      setShowModal(false);

      setFormData({
        ISIN: "",
        Symbol: "",
        Company_Name: "",
        Series: "EQ",
        Listing_Date: "",
        Face_Value: "",
        Source_File: "",
      });

      await fetchStagingData();
    } catch (err) {
      console.error("POST /staging error:", err);
      setError(
        err.message || "Failed to create staging record"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredData = stagingData.filter((item) => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return true;
    }

    return (
      String(item.ISIN || "")
        .toLowerCase()
        .includes(value) ||
      String(item.Company_Name || "")
        .toLowerCase()
        .includes(value) ||
      String(item.Symbol || "")
        .toLowerCase()
        .includes(value)
    );
  });

  return (
    <div>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-heading">
        <div>
          <h2>Staging</h2>
          <p>NSE records waiting for processing</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setError("");
            setSuccessMessage("");
            setShowModal(true);
          }}
        >
          <Plus size={17} />
          Add Staging
        </button>
      </div>

      {/* =========================
          SUCCESS
      ========================= */}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search ISIN, company or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="secondary-button"
          onClick={fetchStagingData}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ISIN</th>
                <th>Company Name</th>
                <th>Symbol</th>
                <th>Series</th>
                <th>Listing Date</th>
                <th>Face Value</th>
                <th>Source File</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">
                    <div className="table-empty">
                      Loading staging records...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="table-empty">
                      No records found
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.ROWID || item.ISIN}>
                    <td className="isin">
                      {item.ISIN}
                    </td>

                    <td>
                      {item.Company_Name}
                    </td>

                    <td>
                      <strong>
                        {item.Symbol || "-"}
                      </strong>
                    </td>

                    <td>
                      {item.Series || "EQ"}
                    </td>

                    <td>
                      {item.Listing_Date || "-"}
                    </td>

                    <td>
                      {item.Face_Value ?? "-"}
                    </td>

                    <td>
                      {item.Source_File || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          ADD STAGING MODAL
      ========================= */}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!saving) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3>Add Staging Record</h3>
                <p>
                  Add an NSE record to the staging table.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => {
                  if (!saving) {
                    setShowModal(false);
                  }
                }}
              >
                ×
              </button>
            </div>

            <div className="form">
              <label>
                ISIN
                <input
                  name="ISIN"
                  value={formData.ISIN}
                  onChange={handleChange}
                  placeholder="INE123A01012"
                />
              </label>

              <label>
                Company Name
                <input
                  name="Company_Name"
                  value={formData.Company_Name}
                  onChange={handleChange}
                  placeholder="Company Name Limited"
                />
              </label>

              <label>
                Symbol
                <input
                  name="Symbol"
                  value={formData.Symbol}
                  onChange={handleChange}
                  placeholder="ABC"
                />
              </label>

              <label>
                Series
                <input
                  name="Series"
                  value="EQ"
                  readOnly
                />
              </label>

              <label>
                Listing Date
                <input
                  type="date"
                  name="Listing_Date"
                  value={formData.Listing_Date}
                  onChange={handleChange}
                />
              </label>

              <label>
                Face Value
                <input
                  type="number"
                  name="Face_Value"
                  value={formData.Face_Value}
                  onChange={handleChange}
                  placeholder="10"
                />
              </label>

              <label>
                Source File
                <input
                  name="Source_File"
                  value={formData.Source_File}
                  onChange={handleChange}
                  placeholder="EQUITY_L.csv"
                />
              </label>
            </div>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowModal(false)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={handleCreateStaging}
                disabled={saving}
              >
                {saving
                  ? "Creating..."
                  : "Create Staging"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staging;