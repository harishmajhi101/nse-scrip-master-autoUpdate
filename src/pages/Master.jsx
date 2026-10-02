import { useEffect, useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";

const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_SCRIP_API_URL ||
    "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

function Master() {
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    ISIN: "",
    Company_Name: "",
    Symbol: "",
    NSE_Series: "EQ",
    BSE_Code: "",
    Status: "active",
  });

  // =========================
  // GET MASTER RECORDS
  // =========================
  const fetchMasterData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/master`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch master records"
        );
      }

      setMasterData(result.data || []);
    } catch (err) {
      console.error("GET /master error:", err);
      setError(err.message || "Failed to load master records");
    } finally {
      setLoading(false);
    }
  };

  // Load data when page opens
  useEffect(() => {
    fetchMasterData();
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
  // POST MASTER RECORD
  // =========================
  const handleCreateMaster = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${API_BASE_URL}/master`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries({
              ISIN: formData.ISIN.trim().toUpperCase(),
              Company_Name: formData.Company_Name.trim(),
              Symbol: formData.Symbol.trim().toUpperCase(),
              NSE_Series: formData.NSE_Series.trim().toUpperCase(),
              BSE_Code: formData.BSE_Code.trim(),
              Status: formData.Status.trim(),
              Last_Update_Source: "manual",
            }).filter(([, value]) => value !== "")
          )
        ),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create master record"
        );
      }

      setSuccessMessage("Master record created successfully");

      // Close modal
      setShowModal(false);

      // Reset form
      setFormData({
        ISIN: "",
        Company_Name: "",
        Symbol: "",
        NSE_Series: "EQ",
        BSE_Code: "",
        Status: "active",
      });

      // Reload master data
      await fetchMasterData();
    } catch (err) {
      console.error("POST /master error:", err);
      setError(err.message || "Failed to create master record");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredData = masterData.filter((item) => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return true;
    }

    return (
      String(item.ISIN || "").toLowerCase().includes(value) ||
      String(item.Company_Name || "").toLowerCase().includes(value) ||
      String(item.Symbol || "").toLowerCase().includes(value)
    );
  });

  return (
    <div>
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="page-heading">
        <div>
          <h2>Scrip Master</h2>
          <p>Current NSE scrip master records</p>
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
          Add Master
        </button>
      </div>

      {/* =========================
          SUCCESS MESSAGE
      ========================= */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* =========================
          ERROR MESSAGE
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
          onClick={fetchMasterData}
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
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">
                    <div className="table-empty">
                      Loading master records...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5">
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
                      {item.NSE_Series || "EQ"}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          String(item.Status || "")
                            .toLowerCase() === "active"
                            ? "active"
                            : ""
                        }`}
                      >
                        {item.Status || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          ADD MASTER MODAL
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
            className="modal master-add-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3>Add Master Record</h3>
                <p>
                  All fields are optional. Enter any available scrip information.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close"
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

            <div className="form master-form-grid">
              <label>
                <span>ISIN</span>
                <input
                  name="ISIN"
                  value={formData.ISIN}
                  onChange={handleChange}
                  placeholder="INE123A01012"
                />
              </label>

              <label>
                <span>Company Name</span>
                <input
                  name="Company_Name"
                  value={formData.Company_Name}
                  onChange={handleChange}
                  placeholder="Company Name Limited"
                />
              </label>

              <label>
                <span>Symbol</span>
                <input
                  name="Symbol"
                  value={formData.Symbol}
                  onChange={handleChange}
                  placeholder="ABC"
                />
              </label>

              <label>
                <span>Series</span>
                <select
                  name="NSE_Series"
                  value={formData.NSE_Series}
                  onChange={handleChange}
                >
                  <option value="">Select Series</option>
                  <option value="EQ">EQ</option>
                  <option value="BE">BE</option>
                  <option value="BZ">BZ</option>
                  <option value="SM">SM</option>
                  <option value="ST">ST</option>
                  <option value="GB">GB</option>
                </select>
              </label>

              <label>
                <span>BSE Code</span>
                <input
                  name="BSE_Code"
                  value={formData.BSE_Code}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </label>

              <label>
                <span>Status</span>
                <select
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                  <option value="unresolved">
                    Unresolved
                  </option>
                </select>
              </label>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowModal(false)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleCreateMaster}
                disabled={saving}
              >
                {saving ? "Creating..." : "Create Master"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Master;