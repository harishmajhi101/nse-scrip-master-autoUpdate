// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Plus,
//   Upload,
//   RefreshCw,
//   Search,
//   X,
//   Save,
//   Loader2,
//   FileText,
//   Database,
//   CheckCircle2,
// } from "lucide-react";

// const API_BASE_URL =
//   import.meta.env.VITE_SCRIP_API_URL ||
//   "/api";

// function Staging() {
//   const [rows, setRows] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   const [search, setSearch] = useState("");

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showUploadModal, setShowUploadModal] = useState(false);

//   const [selectedFile, setSelectedFile] = useState(null);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [form, setForm] = useState({
//     ISIN: "",
//     Company_Name: "",
//     Symbol: "",
//     Series: "EQ",
//     Listing_Date: "",
//     Face_Value: "",
//     Source_File: "",
//   });

//   // =====================================================
//   // LOAD STAGING
//   // =====================================================

//   const loadStaging = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE_URL}/staging`, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       const text = await response.text();

//       let data = {};

//       try {
//         data = text ? JSON.parse(text) : {};
//       } catch (parseError) {
//         throw new Error(
//           `Invalid server response (${response.status}).`
//         );
//       }

//       if (!response.ok || data.success === false) {
//         throw new Error(
//           data.message ||
//             data.error ||
//             `Failed to load staging records (${response.status}).`
//         );
//       }

//       const stagingData =
//         Array.isArray(data.data)
//           ? data.data
//           : Array.isArray(data.rows)
//           ? data.rows
//           : [];

//       setRows(stagingData);
//     } catch (err) {
//       console.error("STAGING LOAD ERROR:", err);

//       setError(
//         err.message ||
//           "Unable to load staging records."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadStaging();
//   }, []);

//   // =====================================================
//   // SEARCH
//   // =====================================================

//   const filteredRows = useMemo(() => {
//     const value = search.trim().toLowerCase();

//     if (!value) {
//       return rows;
//     }

//     return rows.filter((row) => {
//       return (
//         String(row.ISIN || "")
//           .toLowerCase()
//           .includes(value) ||
//         String(row.Company_Name || "")
//           .toLowerCase()
//           .includes(value) ||
//         String(row.Symbol || "")
//           .toLowerCase()
//           .includes(value) ||
//         String(row.Series || "")
//           .toLowerCase()
//           .includes(value) ||
//         String(row.Source_File || "")
//           .toLowerCase()
//           .includes(value)
//       );
//     });
//   }, [rows, search]);

//   // =====================================================
//   // FORM CHANGE
//   // =====================================================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // =====================================================
//   // RESET FORM
//   // =====================================================

//   const resetForm = () => {
//     setForm({
//       ISIN: "",
//       Company_Name: "",
//       Symbol: "",
//       Series: "EQ",
//       Listing_Date: "",
//       Face_Value: "",
//       Source_File: "",
//     });

//     setError("");
//     setSuccess("");
//   };

//   // =====================================================
//   // OPEN ADD STAGING
//   // =====================================================

//   const openAddModal = () => {
//     resetForm();
//     setShowAddModal(true);
//   };

//   // =====================================================
//   // CLOSE ADD MODAL
//   // =====================================================

//   const closeAddModal = () => {
//     if (saving) {
//       return;
//     }

//     setShowAddModal(false);
//     resetForm();
//   };

//   // =====================================================
//   // CREATE STAGING
//   // =====================================================

// const handleCreateStaging = async (e) => {
//   e.preventDefault();

//   setError("");
//   setSuccess("");
//   setSaving(true);

//   try {
//     const payload = {
//       ISIN: String(form.ISIN || "")
//         .trim()
//         .toUpperCase(),

//       Company_Name: String(
//         form.Company_Name || ""
//       ).trim(),

//       Symbol: String(
//         form.Symbol || ""
//       )
//         .trim()
//         .toUpperCase(),

//       Series: String(
//         form.Series || ""
//       )
//         .trim()
//         .toUpperCase(),

//       Listing_Date: String(
//         form.Listing_Date || ""
//       ).trim(),

//       Face_Value: String(
//         form.Face_Value || ""
//       ).trim(),

//       Source_File: String(
//         form.Source_File || ""
//       ).trim(),
//     };

//     console.log(
//       "CREATE STAGING PAYLOAD:",
//       payload
//     );

//     const url =
//       `${API_BASE_URL}/staging`;

//     console.log(
//       "CREATE STAGING URL:",
//       url
//     );

//     const response = await fetch(url, {
//       method: "POST",

//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },

//       body: JSON.stringify(payload),
//     });

//     console.log(
//       "CREATE STAGING STATUS:",
//       response.status
//     );

//     const text =
//       await response.text();

//     console.log(
//       "CREATE STAGING RESPONSE:",
//       text
//     );

//     let data = {};

//     try {
//       data =
//         text
//           ? JSON.parse(text)
//           : {};
//     } catch (parseError) {
//       throw new Error(
//         `Invalid server response. HTTP ${response.status}`
//       );
//     }

//     if (
//       !response.ok ||
//       data.success === false
//     ) {
//       throw new Error(
//         data.message ||
//         data.error ||
//         `Failed to save staging record. HTTP ${response.status}`
//       );
//     }

//     console.log(
//       "STAGING SAVE SUCCESS:",
//       data
//     );

//     if (data.action === "updated") {
//       setSuccess(
//         "Staging record updated successfully."
//       );
//     } else {
//       setSuccess(
//         "Staging record created successfully."
//       );
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | REFRESH STAGING TABLE
//     |--------------------------------------------------------------------------
//     */

//     await loadStaging();

//     /*
//     |--------------------------------------------------------------------------
//     | CLOSE MODAL
//     |--------------------------------------------------------------------------
//     */

//     setTimeout(() => {
//       setShowAddModal(false);

//       setForm({
//         ISIN: "",
//         Company_Name: "",
//         Symbol: "",
//         Series: "EQ",
//         Listing_Date: "",
//         Face_Value: "",
//         Source_File: "",
//       });

//       setSuccess("");
//       setError("");
//     }, 700);

//   } catch (error) {
//     console.error(
//       "CREATE STAGING ERROR:",
//       error
//     );

//     setError(
//       error.message ||
//       "Failed to save staging record."
//     );

//   } finally {
//     setSaving(false);
//   }
// };

//   // =====================================================
//   // FILE SELECT
//   // =====================================================

//   const handleFileChange = (e) => {
//     const file = e.target.files && e.target.files[0];

//     setError("");
//     setSuccess("");

//     if (!file) {
//       setSelectedFile(null);
//       return;
//     }

//     if (!file.name.toLowerCase().endsWith(".csv")) {
//       setError("Please select a CSV file.");
//       e.target.value = "";
//       setSelectedFile(null);
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       setError("File size must be 10 MB or less.");
//       e.target.value = "";
//       setSelectedFile(null);
//       return;
//     }

//     setSelectedFile(file);
//   };

//   // =====================================================
//   // UPLOAD STAGING FILE
//   // =====================================================

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!selectedFile) {
//       setError("Please select a CSV file.");
//       return;
//     }

//     setUploading(true);

//     try {
//       const formData = new FormData();

//       formData.append("file", selectedFile);

//       const response = await fetch(
//         `${API_BASE_URL}/staging/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const text = await response.text();

//       let data = {};

//       try {
//         data = text ? JSON.parse(text) : {};
//       } catch (parseError) {
//         throw new Error(
//           `Invalid server response (${response.status}).`
//         );
//       }

//       if (!response.ok || data.success === false) {
//         throw new Error(
//           data.message ||
//             data.error ||
//             `Upload failed (${response.status}).`
//         );
//       }

//       setSuccess(
//         data.message ||
//           "Staging file uploaded successfully."
//       );

//       setSelectedFile(null);

//       const fileInput =
//         document.getElementById("staging-file-input");

//       if (fileInput) {
//         fileInput.value = "";
//       }

//       await loadStaging();

//       setTimeout(() => {
//         setShowUploadModal(false);
//         setSuccess("");
//       }, 900);
//     } catch (err) {
//       console.error("STAGING FILE UPLOAD ERROR:", err);

//       setError(
//         err.message ||
//           "Unable to upload staging file."
//       );
//     } finally {
//       setUploading(false);
//     }
//   };

//   // =====================================================
//   // CLOSE UPLOAD MODAL
//   // =====================================================

//   const closeUploadModal = () => {
//     if (uploading) {
//       return;
//     }

//     setShowUploadModal(false);
//     setSelectedFile(null);
//     setError("");
//     setSuccess("");

//     const fileInput =
//       document.getElementById("staging-file-input");

//     if (fileInput) {
//       fileInput.value = "";
//     }
//   };

//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <div className="staging-page">
//       {/* =================================================
//           PAGE HEADER
//           ================================================= */}

//       <div className="page-header">
//         <div>
//           <h1>Scrip Staging</h1>

//           <p>
//             Review and manage staging records before Tier 1
//             processing.
//           </p>
//         </div>

//         <div className="page-header-actions">
//           <button
//             className="secondary-button"
//             onClick={loadStaging}
//             disabled={loading}
//           >
//             <RefreshCw
//               size={16}
//               className={loading ? "button-spinner" : ""}
//             />

//             {loading ? "Refreshing..." : "Refresh"}
//           </button>

//           <button
//             className="secondary-button"
//             onClick={() => {
//               setError("");
//               setSuccess("");
//               setShowUploadModal(true);
//             }}
//           >
//             <Upload size={16} />
//             Upload Staging File
//           </button>

          

//           <button
//             className="primary-button"
//             onClick={openAddModal}
//           >
//             <Plus size={17} />
//             Add Staging
//           </button>
//         </div>
//       </div>

//       {/* =================================================
//           ERROR
//           ================================================= */}

//       {error && !showAddModal && !showUploadModal && (
//         <div className="form-alert form-alert-error staging-page-alert">
//           <span>{error}</span>

//           <button
//             type="button"
//             onClick={() => setError("")}
//           >
//             <X size={15} />
//           </button>
//         </div>
//       )}

//       {/* =================================================
//           SUCCESS
//           ================================================= */}

//       {success && !showAddModal && !showUploadModal && (
//         <div className="form-alert form-alert-success staging-page-alert">
//           <CheckCircle2 size={18} />

//           <span>{success}</span>
//         </div>
//       )}

//       {/* =================================================
//           SEARCH + COUNT
//           ================================================= */}

//       <div className="staging-toolbar">
//         <div className="staging-search">
//           <Search size={17} />

//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search ISIN, company, symbol..."
//           />

//           {search && (
//             <button
//               type="button"
//               onClick={() => setSearch("")}
//             >
//               <X size={15} />
//             </button>
//           )}
//         </div>

//         <div className="staging-count">
//           <Database size={16} />

//           <span>
//             {filteredRows.length} record
//             {filteredRows.length === 1 ? "" : "s"}
//           </span>
//         </div>
//       </div>

//       {/* =================================================
//           TABLE
//           ================================================= */}

//       <div className="staging-table-card">
//         {loading ? (
//           <div className="staging-empty">
//             <Loader2
//               size={28}
//               className="button-spinner"
//             />

//             <p>Loading staging records...</p>
//           </div>
//         ) : filteredRows.length === 0 ? (
//           <div className="staging-empty">
//             <FileText size={34} />

//             <h3>No staging records found</h3>

//             <p>
//               Add a staging record manually or upload an NSE
//               CSV file.
//             </p>
//           </div>
//         ) : (
//           <div className="staging-table-wrapper">
//             <table className="staging-table">
//               <thead>
//                 <tr>
//                   <th>ISIN</th>
//                   <th>Company Name</th>
//                   <th>Symbol</th>
//                   <th>Series</th>
//                   <th>Listing Date</th>
//                   <th>Face Value</th>
//                   <th>Source File</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredRows.map((row, index) => (
//                   <tr
//                     key={
//                       row.ROWID ||
//                       row.ROW_ID ||
//                       `${row.ISIN}-${index}`
//                     }
//                   >
//                     <td>
//                       <span className="table-isin">
//                         {row.ISIN || "-"}
//                       </span>
//                     </td>

//                     <td>
//                       {row.Company_Name || "-"}
//                     </td>

//                     <td>
//                       {row.Symbol || "-"}
//                     </td>

//                     <td>
//                       {row.Series || "-"}
//                     </td>

//                     <td>
//                       {row.Listing_Date || "-"}
//                     </td>

//                     <td>
//                       {row.Face_Value || "-"}
//                     </td>

//                     <td>
//                       {row.Source_File || "-"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* =================================================
//           ADD STAGING MODAL
//           ================================================= */}

//       {showAddModal && (
//         <div
//           className="modal-overlay"
//           onMouseDown={(e) => {
//             if (e.target === e.currentTarget) {
//               closeAddModal();
//             }
//           }}
//         >
//           <div className="modal-card staging-add-modal">
//             <div className="modal-header">
//               <div>
//                 <h2>Add Staging Record</h2>

//                 <p>
//                   Enter the available staging information.
//                   All fields are optional.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 className="modal-close"
//                 onClick={closeAddModal}
//                 disabled={saving}
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <form onSubmit={handleCreateStaging}>
//               {error && (
//                 <div className="form-alert form-alert-error">
//                   <span>{error}</span>
//                 </div>
//               )}

//               {success && (
//                 <div className="form-alert form-alert-success">
//                   <CheckCircle2 size={18} />

//                   <span>{success}</span>
//                 </div>
//               )}

//               <div className="staging-form-grid">
//                 {/* ISIN */}
//                 <div className="form-field">
//                   <label htmlFor="staging-ISIN">
//                     ISIN
//                   </label>

//                   <input
//                     id="staging-ISIN"
//                     name="ISIN"
//                     value={form.ISIN}
//                     onChange={handleChange}
//                     placeholder="INE123A01012"
//                     maxLength={12}
//                   />
//                 </div>

//                 {/* COMPANY */}
//                 <div className="form-field">
//                   <label htmlFor="staging-Company_Name">
//                     Company Name
//                   </label>

//                   <input
//                     id="staging-Company_Name"
//                     name="Company_Name"
//                     value={form.Company_Name}
//                     onChange={handleChange}
//                     placeholder="Company Name Limited"
//                   />
//                 </div>

//                 {/* SYMBOL */}
//                 <div className="form-field">
//                   <label htmlFor="staging-Symbol">
//                     Symbol
//                   </label>

//                   <input
//                     id="staging-Symbol"
//                     name="Symbol"
//                     value={form.Symbol}
//                     onChange={handleChange}
//                     placeholder="ABC"
//                   />
//                 </div>

//                 {/* SERIES */}
//                 <div className="form-field">
//                   <label htmlFor="staging-Series">
//                     Series
//                   </label>

//                   <select
//                     id="staging-Series"
//                     name="Series"
//                     value={form.Series}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select Series</option>
//                     <option value="EQ">EQ</option>
//                     <option value="BE">BE</option>
//                     <option value="BZ">BZ</option>
//                     <option value="SM">SM</option>
//                     <option value="ST">ST</option>
//                     <option value="GB">GB</option>
//                   </select>
//                 </div>

//                 {/* LISTING DATE */}
//                 <div className="form-field">
//                   <label htmlFor="staging-Listing_Date">
//                     Listing Date
//                   </label>

//                   <input
//                     id="staging-Listing_Date"
//                     name="Listing_Date"
//                     type="date"
//                     value={form.Listing_Date}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 {/* FACE VALUE */}
//                 <div className="form-field">
//                   <label htmlFor="staging-Face_Value">
//                     Face Value
//                   </label>

//                   <input
//                     id="staging-Face_Value"
//                     name="Face_Value"
//                     type="text"
//                     value={form.Face_Value}
//                     onChange={handleChange}
//                     placeholder="10"
//                   />
//                 </div>

//                 {/* SOURCE FILE */}
//                 <div className="form-field full-width">
//                   <label htmlFor="staging-Source_File">
//                     Source File
//                   </label>

//                   <input
//                     id="staging-Source_File"
//                     name="Source_File"
//                     value={form.Source_File}
//                     onChange={handleChange}
//                     placeholder="EQUITY_L.csv"
//                   />
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="secondary-button"
//                   onClick={closeAddModal}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="primary-button"
//                   disabled={saving}
//                 >
//                   {saving ? (
//                     <>
//                       <Loader2
//                         size={17}
//                         className="button-spinner"
//                       />
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <Save size={17} />
//                       Create Staging
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* =================================================
//           UPLOAD MODAL
//           ================================================= */}

//       {showUploadModal && (
//         <div
//           className="modal-overlay"
//           onMouseDown={(e) => {
//             if (e.target === e.currentTarget) {
//               closeUploadModal();
//             }
//           }}
//         >
//           <div className="modal-card staging-upload-modal">
//             <div className="modal-header">
//               <div>
//                 <h2>Upload Staging File</h2>

//                 <p>
//                   Upload an NSE staging CSV file.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 className="modal-close"
//                 onClick={closeUploadModal}
//                 disabled={uploading}
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <form onSubmit={handleUpload}>
//               {error && (
//                 <div className="form-alert form-alert-error">
//                   <span>{error}</span>
//                 </div>
//               )}

//               {success && (
//                 <div className="form-alert form-alert-success">
//                   <CheckCircle2 size={18} />

//                   <span>{success}</span>
//                 </div>
//               )}

//               <div className="upload-area">
//                 <Upload size={34} />

//                 <h3>
//                   Select CSV file
//                 </h3>

//                 <p>
//                   Maximum file size: 10 MB
//                 </p>

//                 <label
//                   htmlFor="staging-file-input"
//                   className="file-select-button"
//                 >
//                   Choose CSV File
//                 </label>

//                 <input
//                   id="staging-file-input"
//                   type="file"
//                   accept=".csv,text/csv"
//                   onChange={handleFileChange}
//                   hidden
//                 />

//                 {selectedFile && (
//                   <div className="selected-file">
//                     <FileText size={18} />

//                     <div>
//                       <strong>
//                         {selectedFile.name}
//                       </strong>

//                       <span>
//                         {(
//                           selectedFile.size /
//                           1024 /
//                           1024
//                         ).toFixed(2)}{" "}
//                         MB
//                       </span>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSelectedFile(null);

//                         const input =
//                           document.getElementById(
//                             "staging-file-input"
//                           );

//                         if (input) {
//                           input.value = "";
//                         }
//                       }}
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="upload-info">
//                 <strong>Supported files</strong>

//                 <span>
//                   EQUITY_L.csv or SME_EQUITY_L.csv
//                 </span>
//               </div>

//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="secondary-button"
//                   onClick={closeUploadModal}
//                   disabled={uploading}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="primary-button"
//                   disabled={
//                     uploading || !selectedFile
//                   }
//                 >
//                   {uploading ? (
//                     <>
//                       <Loader2
//                         size={17}
//                         className="button-spinner"
//                       />
//                       Uploading...
//                     </>
//                   ) : (
//                     <>
//                       <Upload size={17} />
//                       Upload File
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Staging;
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Upload,
  RefreshCw,
  Search,
  X,
  Save,
  Loader2,
  FileText,
  Database,
  CheckCircle2,
} from "lucide-react";

/*
 * LOCAL DEVELOPMENT:
 * Always use the Vite proxy so the browser calls:
 *   http://localhost:5173/api/...
 *
 * Vite forwards /api/... to the Catalyst function.
 *
 * PRODUCTION:
 * Use VITE_SCRIP_API_URL if it is configured.
 */
const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_SCRIP_API_URL || "/api";

function Staging() {
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    ISIN: "",
    Company_Name: "",
    Symbol: "",
    Series: "EQ",
    Listing_Date: "",
    Face_Value: "",
    Source_File: "",
  });

  // =====================================================
  // LOAD STAGING
  // =====================================================

  const loadStaging = async () => {
    setLoading(true);
    setError("");

    try {
      const stagingUrl = `${API_BASE_URL}/staging`;

      console.log("LOAD STAGING URL:", stagingUrl);

      const response = await fetch(stagingUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        throw new Error(
          `Invalid server response (${response.status}).`
        );
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
            data.error ||
            `Failed to load staging records (${response.status}).`
        );
      }

      const stagingData =
        Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.rows)
          ? data.rows
          : [];

      setRows(stagingData);
    } catch (err) {
      console.error("STAGING LOAD ERROR:", err);

      setError(
        err.message ||
          "Unable to load staging records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaging();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredRows = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return rows;
    }

    return rows.filter((row) => {
      return (
        String(row.ISIN || "")
          .toLowerCase()
          .includes(value) ||
        String(row.Company_Name || "")
          .toLowerCase()
          .includes(value) ||
        String(row.Symbol || "")
          .toLowerCase()
          .includes(value) ||
        String(row.Series || "")
          .toLowerCase()
          .includes(value) ||
        String(row.Source_File || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [rows, search]);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      ISIN: "",
      Company_Name: "",
      Symbol: "",
      Series: "EQ",
      Listing_Date: "",
      Face_Value: "",
      Source_File: "",
    });

    setError("");
    setSuccess("");
  };

  // =====================================================
  // OPEN ADD STAGING
  // =====================================================

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  // =====================================================
  // CLOSE ADD MODAL
  // =====================================================

  const closeAddModal = () => {
    if (saving) {
      return;
    }

    setShowAddModal(false);
    resetForm();
  };

  // =====================================================
  // CREATE STAGING
  // =====================================================

const handleCreateStaging = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");
  setSaving(true);

  try {
    const payload = {
      ISIN: String(form.ISIN || "")
        .trim()
        .toUpperCase(),

      Company_Name: String(
        form.Company_Name || ""
      ).trim(),

      Symbol: String(
        form.Symbol || ""
      )
        .trim()
        .toUpperCase(),

      Series: String(
        form.Series || ""
      )
        .trim()
        .toUpperCase(),

      Listing_Date: String(
        form.Listing_Date || ""
      ).trim(),

      Face_Value: String(
        form.Face_Value || ""
      ).trim(),

      Source_File: String(
        form.Source_File || ""
      ).trim(),
    };

    console.log(
      "CREATE STAGING PAYLOAD:",
      payload
    );

    const url =
      `${API_BASE_URL}/staging`;

    console.log(
      "CREATE STAGING URL:",
      url
    );

    console.log(
      "CREATE STAGING MODE:",
      import.meta.env.DEV
        ? "LOCAL VITE PROXY"
        : "PRODUCTION API"
    );

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify(payload),
    });

    console.log(
      "CREATE STAGING STATUS:",
      response.status
    );

    const text =
      await response.text();

    console.log(
      "CREATE STAGING RESPONSE:",
      text
    );

    let data = {};

    try {
      data =
        text
          ? JSON.parse(text)
          : {};
    } catch (parseError) {
      throw new Error(
        `Invalid server response. HTTP ${response.status}`
      );
    }

    if (
      !response.ok ||
      data.success === false
    ) {
      throw new Error(
        data.message ||
        data.error ||
        `Failed to save staging record. HTTP ${response.status}`
      );
    }

    console.log(
      "STAGING SAVE SUCCESS:",
      data
    );

    if (data.action === "updated") {
      setSuccess(
        "Staging record updated successfully."
      );
    } else {
      setSuccess(
        "Staging record created successfully."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | REFRESH STAGING TABLE
    |--------------------------------------------------------------------------
    */

    await loadStaging();

    /*
    |--------------------------------------------------------------------------
    | CLOSE MODAL
    |--------------------------------------------------------------------------
    */

    setTimeout(() => {
      setShowAddModal(false);

      setForm({
        ISIN: "",
        Company_Name: "",
        Symbol: "",
        Series: "EQ",
        Listing_Date: "",
        Face_Value: "",
        Source_File: "",
      });

      setSuccess("");
      setError("");
    }, 700);

  } catch (error) {
    console.error(
      "CREATE STAGING ERROR:",
      error
    );

    setError(
      error.message ||
      "Failed to save staging record."
    );

  } finally {
    setSaving(false);
  }
};

  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be 10 MB or less.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // =====================================================
  // UPLOAD STAGING FILE
  // =====================================================

  const handleUpload = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError("Please select a CSV file.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_BASE_URL}/staging/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        throw new Error(
          `Invalid server response (${response.status}).`
        );
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
            data.error ||
            `Upload failed (${response.status}).`
        );
      }

      setSuccess(
        data.message ||
          "Staging file uploaded successfully."
      );

      setSelectedFile(null);

      const fileInput =
        document.getElementById("staging-file-input");

      if (fileInput) {
        fileInput.value = "";
      }

      await loadStaging();

      setTimeout(() => {
        setShowUploadModal(false);
        setSuccess("");
      }, 900);
    } catch (err) {
      console.error("STAGING FILE UPLOAD ERROR:", err);

      setError(
        err.message ||
          "Unable to upload staging file."
      );
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // CLOSE UPLOAD MODAL
  // =====================================================

  const closeUploadModal = () => {
    if (uploading) {
      return;
    }

    setShowUploadModal(false);
    setSelectedFile(null);
    setError("");
    setSuccess("");

    const fileInput =
      document.getElementById("staging-file-input");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="staging-page">
      {/* =================================================
          PAGE HEADER
          ================================================= */}

      <div className="page-header">
        <div>
          <h1>Scrip Staging</h1>

          <p>
            Review and manage staging records before Tier 1
            processing.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            className="secondary-button"
            onClick={loadStaging}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "button-spinner" : ""}
            />

            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            className="secondary-button"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowUploadModal(true);
            }}
          >
            <Upload size={16} />
            Upload Staging File
          </button>

          

          <button
            className="primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Staging
          </button>
        </div>
      </div>

      {/* =================================================
          ERROR
          ================================================= */}

      {error && !showAddModal && !showUploadModal && (
        <div className="form-alert form-alert-error staging-page-alert">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* =================================================
          SUCCESS
          ================================================= */}

      {success && !showAddModal && !showUploadModal && (
        <div className="form-alert form-alert-success staging-page-alert">
          <CheckCircle2 size={18} />

          <span>{success}</span>
        </div>
      )}

      {/* =================================================
          SEARCH + COUNT
          ================================================= */}

      <div className="staging-toolbar">
        <div className="staging-search">
          <Search size={17} />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ISIN, company, symbol..."
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="staging-count">
          <Database size={16} />

          <span>
            {filteredRows.length} record
            {filteredRows.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* =================================================
          TABLE
          ================================================= */}

      <div className="staging-table-card">
        {loading ? (
          <div className="staging-empty">
            <Loader2
              size={28}
              className="button-spinner"
            />

            <p>Loading staging records...</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="staging-empty">
            <FileText size={34} />

            <h3>No staging records found</h3>

            <p>
              Add a staging record manually or upload an NSE
              CSV file.
            </p>
          </div>
        ) : (
          <div className="staging-table-wrapper">
            <table className="staging-table">
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
                {filteredRows.map((row, index) => (
                  <tr
                    key={
                      row.ROWID ||
                      row.ROW_ID ||
                      `${row.ISIN}-${index}`
                    }
                  >
                    <td>
                      <span className="table-isin">
                        {row.ISIN || "-"}
                      </span>
                    </td>

                    <td>
                      {row.Company_Name || "-"}
                    </td>

                    <td>
                      {row.Symbol || "-"}
                    </td>

                    <td>
                      {row.Series || "-"}
                    </td>

                    <td>
                      {row.Listing_Date || "-"}
                    </td>

                    <td>
                      {row.Face_Value || "-"}
                    </td>

                    <td>
                      {row.Source_File || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================
          ADD STAGING MODAL
          ================================================= */}

      {showAddModal && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeAddModal();
            }
          }}
        >
          <div className="modal-card staging-add-modal">
            <div className="modal-header">
              <div>
                <h2>Add Staging Record</h2>

                <p>
                  Enter the available staging information.
                  All fields are optional.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeAddModal}
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStaging}>
              {error && (
                <div className="form-alert form-alert-error">
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="form-alert form-alert-success">
                  <CheckCircle2 size={18} />

                  <span>{success}</span>
                </div>
              )}

              <div className="staging-form-grid">
                {/* ISIN */}
                <div className="form-field">
                  <label htmlFor="staging-ISIN">
                    ISIN
                  </label>

                  <input
                    id="staging-ISIN"
                    name="ISIN"
                    value={form.ISIN}
                    onChange={handleChange}
                    placeholder="INE123A01012"
                    maxLength={12}
                  />
                </div>

                {/* COMPANY */}
                <div className="form-field">
                  <label htmlFor="staging-Company_Name">
                    Company Name
                  </label>

                  <input
                    id="staging-Company_Name"
                    name="Company_Name"
                    value={form.Company_Name}
                    onChange={handleChange}
                    placeholder="Company Name Limited"
                  />
                </div>

                {/* SYMBOL */}
                <div className="form-field">
                  <label htmlFor="staging-Symbol">
                    Symbol
                  </label>

                  <input
                    id="staging-Symbol"
                    name="Symbol"
                    value={form.Symbol}
                    onChange={handleChange}
                    placeholder="ABC"
                  />
                </div>

                {/* SERIES */}
                <div className="form-field">
                  <label htmlFor="staging-Series">
                    Series
                  </label>

                  <select
                    id="staging-Series"
                    name="Series"
                    value={form.Series}
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
                </div>

                {/* LISTING DATE */}
                <div className="form-field">
                  <label htmlFor="staging-Listing_Date">
                    Listing Date
                  </label>

                  <input
                    id="staging-Listing_Date"
                    name="Listing_Date"
                    type="date"
                    value={form.Listing_Date}
                    onChange={handleChange}
                  />
                </div>

                {/* FACE VALUE */}
                <div className="form-field">
                  <label htmlFor="staging-Face_Value">
                    Face Value
                  </label>

                  <input
                    id="staging-Face_Value"
                    name="Face_Value"
                    type="text"
                    value={form.Face_Value}
                    onChange={handleChange}
                    placeholder="10"
                  />
                </div>

                {/* SOURCE FILE */}
                <div className="form-field full-width">
                  <label htmlFor="staging-Source_File">
                    Source File
                  </label>

                  <input
                    id="staging-Source_File"
                    name="Source_File"
                    value={form.Source_File}
                    onChange={handleChange}
                    placeholder="EQUITY_L.csv"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeAddModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="button-spinner"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Create Staging
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          UPLOAD MODAL
          ================================================= */}

      {showUploadModal && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeUploadModal();
            }
          }}
        >
          <div className="modal-card staging-upload-modal">
            <div className="modal-header">
              <div>
                <h2>Upload Staging File</h2>

                <p>
                  Upload an NSE staging CSV file.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeUploadModal}
                disabled={uploading}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload}>
              {error && (
                <div className="form-alert form-alert-error">
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="form-alert form-alert-success">
                  <CheckCircle2 size={18} />

                  <span>{success}</span>
                </div>
              )}

              <div className="upload-area">
                <Upload size={34} />

                <h3>
                  Select CSV file
                </h3>

                <p>
                  Maximum file size: 10 MB
                </p>

                <label
                  htmlFor="staging-file-input"
                  className="file-select-button"
                >
                  Choose CSV File
                </label>

                <input
                  id="staging-file-input"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  hidden
                />

                {selectedFile && (
                  <div className="selected-file">
                    <FileText size={18} />

                    <div>
                      <strong>
                        {selectedFile.name}
                      </strong>

                      <span>
                        {(
                          selectedFile.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);

                        const input =
                          document.getElementById(
                            "staging-file-input"
                          );

                        if (input) {
                          input.value = "";
                        }
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="upload-info">
                <strong>Supported files</strong>

                <span>
                  EQUITY_L.csv or SME_EQUITY_L.csv
                </span>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeUploadModal}
                  disabled={uploading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    uploading || !selectedFile
                  }
                >
                  {uploading ? (
                    <>
                      <Loader2
                        size={17}
                        className="button-spinner"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      Upload File
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staging;