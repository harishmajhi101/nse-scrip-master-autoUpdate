// import { useEffect, useState } from "react";
// import { Plus, Search, RefreshCw } from "lucide-react";

// // import { Upload, X } from "lucide-react";

// const API_BASE_URL =
//   "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

// function Staging() {
//   const [stagingData, setStagingData] = useState([]);
//   const [search, setSearch] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const [showModal, setShowModal] = useState(false);
  

//   const [formData, setFormData] = useState({
//     ISIN: "",
//     Symbol: "",
//     Company_Name: "",
//     Series: "EQ",
//     Listing_Date: "",
//     Face_Value: "",
//     Source_File: "",
//   });

//   // =========================
//   // GET STAGING RECORDS
//   // =========================

//   const fetchStagingData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(`${API_BASE_URL}/staging`);

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Failed to fetch staging records"
//         );
//       }

//       setStagingData(result.data || []);
//     } catch (err) {
//       console.error("GET /staging error:", err);
//       setError(err.message || "Failed to load staging records");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load data when page opens
//   useEffect(() => {
//     fetchStagingData();
//   }, []);

//   // =========================
//   // FORM CHANGE
//   // =========================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   // =========================
//   // POST STAGING RECORD
//   // =========================

//   const handleCreateStaging = async () => {
//     try {
//       setSaving(true);
//       setError("");
//       setSuccessMessage("");

//       if (!formData.ISIN.trim()) {
//         setError("ISIN is required");
//         return;
//       }

//       if (!formData.Company_Name.trim()) {
//         setError("Company Name is required");
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/staging`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ISIN: formData.ISIN.trim(),
//           Symbol: formData.Symbol.trim(),
//           Company_Name: formData.Company_Name.trim(),
//           Series: formData.Series || "EQ",
//           Listing_Date: formData.Listing_Date || null,
//           Face_Value:
//             formData.Face_Value === ""
//               ? null
//               : Number(formData.Face_Value),
//           Source_File:
//             formData.Source_File.trim() || "manual",
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Failed to create staging record"
//         );
//       }

//       setSuccessMessage(
//         "Staging record created successfully"
//       );

//       setShowModal(false);

//       setFormData({
//         ISIN: "",
//         Symbol: "",
//         Company_Name: "",
//         Series: "EQ",
//         Listing_Date: "",
//         Face_Value: "",
//         Source_File: "",
//       });

//       await fetchStagingData();
//     } catch (err) {
//       console.error("POST /staging error:", err);
//       setError(
//         err.message || "Failed to create staging record"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================
//   // SEARCH
//   // =========================

//   const filteredData = stagingData.filter((item) => {
//     const value = search.toLowerCase().trim();

//     if (!value) {
//       return true;
//     }

//     return (
//       String(item.ISIN || "")
//         .toLowerCase()
//         .includes(value) ||
//       String(item.Company_Name || "")
//         .toLowerCase()
//         .includes(value) ||
//       String(item.Symbol || "")
//         .toLowerCase()
//         .includes(value)
//     );
//   });

//   return (
//     <div>
//       {/* =========================
//           PAGE HEADER
//       ========================= */}

//       <div className="page-heading">
//         <div>
//           <h2>Staging</h2>
//           <p>NSE records waiting for processing</p>
//         </div>

//         <button
//           className="primary-button"
//           onClick={() => {
//             setError("");
//             setSuccessMessage("");
//             setShowModal(true);
//           }}
//         >
//           <Plus size={17} />
//           Add Staging
//         </button>
//       </div>

//       {/* =========================
//           SUCCESS
//       ========================= */}

//       {successMessage && (
//         <div className="success-message">
//           {successMessage}
//         </div>
//       )}

//       {/* =========================
//           ERROR
//       ========================= */}

//       {error && (
//         <div className="error-message">
//           {error}
//         </div>
//       )}

//       {/* =========================
//           TOOLBAR
//       ========================= */}

//       <div className="toolbar">
//         <div className="search-box">
//           <Search size={18} />

//           <input
//             type="text"
//             placeholder="Search ISIN, company or symbol..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <button
//           className="secondary-button"
//           onClick={fetchStagingData}
//           disabled={loading}
//         >
//           <RefreshCw
//             size={16}
//             className={loading ? "spin" : ""}
//           />
//           Refresh
//         </button>
//       </div>

//       {/* =========================
//           TABLE
//       ========================= */}

//       <div className="panel">
//         <div className="table-wrapper">
//           <table>
//             <thead>
//               <tr>
//                 <th>ISIN</th>
//                 <th>Company Name</th>
//                 <th>Symbol</th>
//                 <th>Series</th>
//                 <th>Listing Date</th>
//                 <th>Face Value</th>
//                 <th>Source File</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="7">
//                     <div className="table-empty">
//                       Loading staging records...
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="7">
//                     <div className="table-empty">
//                       No records found
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((item) => (
//                   <tr key={item.ROWID || item.ISIN}>
//                     <td className="isin">
//                       {item.ISIN}
//                     </td>

//                     <td>
//                       {item.Company_Name}
//                     </td>

//                     <td>
//                       <strong>
//                         {item.Symbol || "-"}
//                       </strong>
//                     </td>

//                     <td>
//                       {item.Series || "EQ"}
//                     </td>

//                     <td>
//                       {item.Listing_Date || "-"}
//                     </td>

//                     <td>
//                       {item.Face_Value ?? "-"}
//                     </td>

//                     <td>
//                       {item.Source_File || "-"}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* =========================
//           ADD STAGING MODAL
//       ========================= */}

//       {showModal && (
//         <div
//           className="modal-overlay"
//           onClick={() => {
//             if (!saving) {
//               setShowModal(false);
//             }
//           }}
//         >
//           <div
//             className="modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-header">
//               <div>
//                 <h3>Add Staging Record</h3>
//                 <p>
//                   Add an NSE record to the staging table.
//                 </p>
//               </div>

//               <button
//                 className="modal-close"
//                 onClick={() => {
//                   if (!saving) {
//                     setShowModal(false);
//                   }
//                 }}
//               >
//                 ×
//               </button>
//             </div>

//             <div className="form">
//               <label>
//                 ISIN
//                 <input
//                   name="ISIN"
//                   value={formData.ISIN}
//                   onChange={handleChange}
//                   placeholder="INE123A01012"
//                 />
//               </label>

//               <label>
//                 Company Name
//                 <input
//                   name="Company_Name"
//                   value={formData.Company_Name}
//                   onChange={handleChange}
//                   placeholder="Company Name Limited"
//                 />
//               </label>

//               <label>
//                 Symbol
//                 <input
//                   name="Symbol"
//                   value={formData.Symbol}
//                   onChange={handleChange}
//                   placeholder="ABC"
//                 />
//               </label>

//               <label>
//                 Series
//                 <input
//                   name="Series"
//                   value="EQ"
//                   readOnly
//                 />
//               </label>

//               <label>
//                 Listing Date
//                 <input
//                   type="date"
//                   name="Listing_Date"
//                   value={formData.Listing_Date}
//                   onChange={handleChange}
//                 />
//               </label>

//               <label>
//                 Face Value
//                 <input
//                   type="number"
//                   name="Face_Value"
//                   value={formData.Face_Value}
//                   onChange={handleChange}
//                   placeholder="10"
//                 />
//               </label>

//               <label>
//                 Source File
//                 <input
//                   name="Source_File"
//                   value={formData.Source_File}
//                   onChange={handleChange}
//                   placeholder="EQUITY_L.csv"
//                 />
//               </label>
//             </div>

//             <div className="modal-footer">
//               <button
//                 className="secondary-button"
//                 onClick={() => setShowModal(false)}
//                 disabled={saving}
//               >
//                 Cancel
//               </button>

//               <button
//                 className="primary-button"
//                 onClick={handleCreateStaging}
//                 disabled={saving}
//               >
//                 {saving
//                   ? "Creating..."
//                   : "Create Staging"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Staging;

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";

const API_BASE_URL =
  "https://nse-data-sync-60066676245.development.catalystserverless.in/server/scrip_api";

function Staging() {
  const [stagingData, setStagingData] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Add staging modal
  const [showModal, setShowModal] = useState(false);

  // Upload staging modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    ISIN: "",
    Symbol: "",
    Company_Name: "",
    Series: "EQ",
    Listing_Date: "",
    Face_Value: "",
    Source_File: "",
  });

  // =========================================================
  // GET STAGING RECORDS
  // =========================================================

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

      setError(
        err.message || "Failed to load staging records"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD DATA WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    fetchStagingData();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // OPEN ADD STAGING MODAL
  // =========================================================

  const openAddModal = () => {
    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  // =========================================================
  // OPEN UPLOAD MODAL
  // =========================================================

  const openUploadModal = () => {
    setError("");
    setSuccessMessage("");
    setSelectedFile(null);
    setShowUploadModal(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // CLOSE UPLOAD MODAL
  // =========================================================

  const closeUploadModal = () => {
    if (uploading) {
      return;
    }

    setShowUploadModal(false);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // SELECT CSV FILE
  // =========================================================

  const handleFileChange = (e) => {
    setError("");
    setSuccessMessage("");

    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".csv")) {
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setError("Please select a CSV file.");
      return;
    }

    // 10 MB frontend check
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setError("File size must be less than 10 MB.");
      return;
    }

    setSelectedFile(file);
  };

  // =========================================================
  // UPLOAD STAGING FILE
  // =========================================================

  const handleUploadStagingFile = async () => {
    if (!selectedFile) {
      setError("Please select a CSV file.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccessMessage("");

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_BASE_URL}/staging/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          `Upload failed. Server returned HTTP ${response.status}`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to upload staging file"
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      const inserted =
        result.stagingInserted ??
        result.inserted ??
        result.uniqueRows ??
        0;

      setSuccessMessage(
        `Staging file uploaded successfully. ${inserted} records added to staging.`
      );

      // Clear selected file
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh staging records
      await fetchStagingData();

      // Close modal after successful upload
      setTimeout(() => {
        setShowUploadModal(false);
        setSuccessMessage("");
      }, 1800);
    } catch (err) {
      console.error(
        "POST /staging/upload error:",
        err
      );

      setError(
        err.message || "Failed to upload staging file"
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // POST STAGING RECORD
  // =========================================================

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

      const response = await fetch(
        `${API_BASE_URL}/staging`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ISIN: formData.ISIN.trim(),
            Symbol: formData.Symbol.trim(),
            Company_Name:
              formData.Company_Name.trim(),
            Series: formData.Series || "EQ",
            Listing_Date:
              formData.Listing_Date || null,
            Face_Value:
              formData.Face_Value === ""
                ? null
                : Number(formData.Face_Value),
            Source_File:
              formData.Source_File.trim() ||
              "manual",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to create staging record"
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
      console.error(
        "POST /staging error:",
        err
      );

      setError(
        err.message ||
          "Failed to create staging record"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredData = stagingData.filter(
    (item) => {
      const value = search
        .toLowerCase()
        .trim();

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
    }
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div>
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="page-heading">
        <div>
          <h2>Staging</h2>
          <p>NSE records waiting for processing</p>
        </div>

        <div className="staging-actions">
          {/* UPLOAD STAGING FILE */}

          <button
            className="upload-staging-button"
            onClick={openUploadModal}
          >
            <Upload size={17} />
            Upload Staging File
          </button>

          {/* ADD STAGING */}

          <button
            className="primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Staging
          </button>
        </div>
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search ISIN, company or symbol..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <button
          className="secondary-button"
          onClick={fetchStagingData}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading ? "spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

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
                  <tr
                    key={
                      item.ROWID ||
                      item.ISIN
                    }
                  >
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
                      {item.Listing_Date ||
                        "-"}
                    </td>

                    <td>
                      {item.Face_Value ??
                        "-"}
                    </td>

                    <td>
                      {item.Source_File ||
                        "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          ADD STAGING MODAL
      ===================================================== */}

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
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h3>
                  Add Staging Record
                </h3>

                <p>
                  Add an NSE record to the
                  staging table.
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
                  value={
                    formData.Company_Name
                  }
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
                  value={
                    formData.Listing_Date
                  }
                  onChange={handleChange}
                />
              </label>

              <label>
                Face Value

                <input
                  type="number"
                  name="Face_Value"
                  value={
                    formData.Face_Value
                  }
                  onChange={handleChange}
                  placeholder="10"
                />
              </label>

              <label>
                Source File

                <input
                  name="Source_File"
                  value={
                    formData.Source_File
                  }
                  onChange={handleChange}
                  placeholder="EQUITY_L.csv"
                />
              </label>
            </div>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() =>
                  setShowModal(false)
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={
                  handleCreateStaging
                }
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

      {/* =====================================================
          UPLOAD STAGING FILE MODAL
      ===================================================== */}

      {showUploadModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!uploading) {
              closeUploadModal();
            }
          }}
        >
          <div
            className="upload-staging-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div className="upload-modal-header">
              <div>
                <h3>
                  Upload Staging File
                </h3>

                <p>
                  Upload an NSE CSV manually
                  when the NSE download is
                  unavailable.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeUploadModal}
                disabled={uploading}
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="upload-modal-body">
              <div className="upload-info-box">
                <strong>
                  Supported files
                </strong>

                <span>
                  EQUITY_L.csv or
                  SME_EQUITY_L.csv
                </span>
              </div>

              {/* FILE SELECT */}

              <label
                className="file-upload-box"
              >
                <Upload size={30} />

                <strong>
                  {selectedFile
                    ? selectedFile.name
                    : "Choose CSV file"}
                </strong>

                <span>
                  Click here to select a
                  CSV file
                </span>

                <small>
                  Maximum file size: 10 MB
                </small>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={
                    handleFileChange
                  }
                />
              </label>

              {/* SELECTED FILE */}

              {selectedFile && (
                <div className="selected-file-box">
                  <div>
                    <span>
                      Selected file
                    </span>

                    <strong>
                      {selectedFile.name}
                    </strong>
                  </div>

                  <span>
                    {(
                      selectedFile.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </span>
                </div>
              )}

              {/* INFORMATION */}

              <div className="upload-note">
                The original CSV will first
                be stored in Catalyst
                Stratus. The file will then
                be validated and its valid
                records will be added to
                <strong>
                  {" "}
                  scrip_staging
                </strong>
                .
              </div>

              {/* UPLOAD ERROR */}

              {error && (
                <div className="upload-error">
                  {error}
                </div>
              )}

              {/* UPLOAD SUCCESS */}

              {successMessage && (
                <div className="upload-success">
                  {successMessage}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}

            <div className="upload-modal-footer">
              <button
                className="secondary-button"
                onClick={closeUploadModal}
                disabled={uploading}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={
                  handleUploadStagingFile
                }
                disabled={
                  !selectedFile ||
                  uploading
                }
              >
                <Upload size={16} />

                {uploading
                  ? "Uploading..."
                  : "Upload File"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staging;