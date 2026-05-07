import { useState } from "react";
import { useSelector } from "react-redux";
import SearchBar from "../SearchBar";

const users = [
  {
    id: 1,
    name: "Dr. John Smith",
    email: "john.smith@edulearn.com",
    empId: "EMP: FS1023",
    dept: "Computer Science Engineering",
    role: "Professor",
    status: "Active",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    email: "sarah.j@edulearn.com",
    empId: "EMP: FS1045",
    dept: "Information Science Engineering",
    role: "Associate Professor",
    status: "Active",
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Dr. Michael Brown",
    email: "michael.b@edulearn.com",
    empId: "EMP: FS1067",
    dept: "Electronics & Communication",
    role: "Professor",
    status: "Active",
    avatar: "MB",
  },
  {
    id: 4,
    name: "Dr. Emily Davis",
    email: "emily.d@edulearn.com",
    empId: "EMP: FS1089",
    dept: "Computer Science Engineering",
    role: "Associate Professor",
    status: "Active",
    avatar: "ED",
  },
  {
    id: 5,
    name: "Dr. Robert Wilson",
    email: "robert.w@edulearn.com",
    empId: "EMP: FS1101",
    dept: "Mechanical Engineering",
    role: "Professor",
    status: "Active",
    avatar: "RW",
  },
];

const avatarColors = ["#3dba5c", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function CreateDepartmentModal({ onClose, open }) {
  const currentTheme = useSelector((s) => s.theme.currentTheme);
  const theme = useSelector((s) => s.theme[currentTheme]);

  const [debounceSearch, setDebounceSearch] = useState("");
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(1);

  const handleSubmit = () => {
    alert(`Department "${deptName}" created!`);
    onClose?.();
  };

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 16,
    },
    modal: {
      background: theme.surface,
      borderRadius: 16,
      width: "100%",
      maxWidth: 680,
      maxHeight: "92vh",
      display: "flex",
      flexDirection: "column",
      boxShadow: `0 20px 60px ${theme.shadow}`,
      overflow: "hidden",
    },
    header: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: "24px 28px 16px",
      borderBottom: `1px solid ${theme.divider}`,
      flexShrink: 0,
    },
    title: {
      margin: 0,
      fontSize: 20,
      fontWeight: 700,
      color: theme.textPrimary,
    },
    subtitle: { margin: "4px 0 0", fontSize: 13, color: theme.textSecondary },
    closeBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 16,
      color: theme.textMuted,
      padding: 4,
      lineHeight: 1,
      borderRadius: 6,
    },
    body: { overflowY: "auto", flex: 1, padding: "0 28px" },
    section: { padding: "20px 0" },
    sectionTitle: {
      margin: "0 0 16px",
      fontSize: 15,
      fontWeight: 700,
      color: theme.textPrimary,
    },
    sectionSub: {
      margin: "-8px 0 14px",
      fontSize: 13,
      color: theme.textSecondary,
    },
    row: { display: "flex", gap: 16, flexWrap: "wrap" },
    field: {
      flex: 1,
      minWidth: 200,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginBottom: 16,
    },
    label: { fontSize: 13, fontWeight: 600, color: theme.textPrimary },
    input: {
      padding: "10px 14px",
      borderRadius: 8,
      border: `1px solid ${theme.inputBorder}`,
      background: theme.inputBg,
      color: theme.inputText,
      fontSize: 14,
      outline: "none",
    },
    select: {
      padding: "10px 14px",
      borderRadius: 8,
      border: `1px solid ${theme.inputBorder}`,
      background: theme.inputBg,
      color: theme.inputText,
      fontSize: 14,
      outline: "none",
      cursor: "pointer",
    },
    divider: { height: 1, background: theme.divider, margin: "0 0 4px" },
    searchWrap: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      border: `1px solid ${theme.inputBorder}`,
      borderRadius: 8,
      padding: "8px 14px",
      background: theme.inputBg,
      marginBottom: 14,
    },
    searchIcon: { fontSize: 14, opacity: 0.6 },
    searchInput: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      fontSize: 14,
      color: theme.inputText,
    },
    tableWrap: {
      border: `1px solid ${theme.border}`,
      borderRadius: 10,
      overflow: "auto",
      maxHeight: 260,
    },
    table: { width: "100%", borderCollapse: "collapse", minWidth: 500 },
    th: {
      padding: "10px 14px",
      textAlign: "left",
      fontSize: 12,
      fontWeight: 600,
      color: theme.textSecondary,
      background: theme.background,
      borderBottom: `1px solid ${theme.border}`,
      whiteSpace: "nowrap",
    },
    tr: {
      borderBottom: `1px solid ${theme.divider}`,
      transition: "background 0.15s",
    },
    td: { padding: "10px 14px", verticalAlign: "middle" },
    userCell: { display: "flex", alignItems: "center", gap: 10 },
    radioWrap: { flexShrink: 0 },
    radioDot: { width: 8, height: 8, borderRadius: "50%", background: "#fff" },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 700,
      color: "#fff",
      flexShrink: 0,
    },
    userName: {
      fontSize: 13,
      fontWeight: 600,
      color: theme.textPrimary,
      whiteSpace: "nowrap",
    },
    userEmail: {
      fontSize: 11,
      color: theme.textSecondary,
      whiteSpace: "nowrap",
    },
    empId: { fontSize: 12, color: theme.textSecondary, whiteSpace: "nowrap" },
    cellText: { fontSize: 13, color: theme.textPrimary },
    note: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      background: theme.primarySoft,
      border: `1px solid ${theme.border}`,
      borderRadius: 8,
      padding: "12px 14px",
      marginTop: 14,
    },
    noteIcon: { fontSize: 16, flexShrink: 0, marginTop: 1 },
    noteText: {
      margin: 0,
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 1.5,
    },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 12,
      padding: "16px 28px",
      borderTop: `1px solid ${theme.divider}`,
      flexShrink: 0,
    },
    cancelBtn: {
      padding: "10px 24px",
      borderRadius: 8,
      border: `1px solid ${theme.border}`,
      background: "transparent",
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
    },
    submitBtn: {
      padding: "10px 24px",
      borderRadius: 8,
      border: "none",
      background: theme.primary,
      color: "#fff",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
    },
  };

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Add Department</h2>
            <p style={styles.subtitle}>
              Fill in the details to create a new department.
            </p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          {/* Section 1 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>1. Department Information</h3>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Department Name <span style={{ color: theme.danger }}>*</span>
                </label>
                <input
                  style={styles.input}
                  placeholder="Enter department name"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>
                  Department Code <span style={{ color: theme.danger }}>*</span>
                </label>
                <input
                  style={styles.input}
                  placeholder="Enter unique department code"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                />
              </div>
            </div>

            <div style={{ ...styles.field, maxWidth: 280 }}>
              <label style={styles.label}>
                Status <span style={{ color: theme.danger }}>*</span>
              </label>
              <select
                style={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div style={styles.divider} />

          {/* Section 2 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              2. Assign Head of Department (HOD)
            </h3>
            <p style={styles.sectionSub}>
              Search and select a user to assign as Head of Department.
            </p>

            <SearchBar
              debounceSearch={debounceSearch}
              setDebounceSearch={setDebounceSearch}
            />

            {/* Note */}
            <div style={styles.note}>
              <span style={styles.noteIcon}>ℹ️</span>
              <p style={styles.noteText}>
                <strong>Note:</strong> A single user cannot be the HOD of two
                departments. If the selected user is already assigned as HOD of
                another department, they will be removed from that department
                and assigned here.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={styles.submitBtn}>
            Create Department
          </button>
        </div>
      </div>
    </div>
  );
}
