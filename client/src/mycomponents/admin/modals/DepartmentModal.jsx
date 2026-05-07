import { useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Building2, GraduationCap, Users, UserCheck, Mail,
  Briefcase, BookOpen, ScrollText, CalendarDays, Search,
  CheckCircle2, X, ChevronRight, Clock
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DEPT = {
  id: "dept-01",
  name: "Computer Science Engineering",
  code: "CSE",
  is_active: true,
  created_at: "2023-01-15T10:30:00Z",
  updated_at: "2024-05-20T16:25:00Z",
  hod: { id: "f1", name: "Dr. John Smith", email: "john.smith@edulearn.com", employee_id: "FSI023", designation: "Professor" },
  branches: [
    { id: "br-01", name: "Computer Science", code: "CS", is_active: true, specCount: 2 },
    { id: "br-02", name: "Information Technology", code: "IT", is_active: true, specCount: 2 },
    { id: "br-03", name: "Data Science", code: "DS", is_active: true, specCount: 2 },
  ],
  stats: { totalBranches: 3, totalSpecializations: 6, totalUsers: 248, totalCoordinators: 5 },
};

const FACULTY = [
  { id: "f2", name: "Dr. Sarah Johnson", email: "sarah@edulearn.com", employee_id: "EMP021", designation: "Associate Professor" },
  { id: "f3", name: "Prof. Michael Brown", email: "michael@edulearn.com", employee_id: "EMP034", designation: "Professor" },
  { id: "f4", name: "Dr. Asha Reddy", email: "asha@edulearn.com", employee_id: "EMP045", designation: "Assistant Professor" },
  { id: "f5", name: "Dr. Rajesh Nair", email: "rajesh@edulearn.com", employee_id: "EMP056", designation: "Associate Professor" },
  { id: "f6", name: "Prof. Kavya Menon", email: "kavya@edulearn.com", employee_id: "EMP067", designation: "Professor" },
];

const USERS = [
  { id: "u1", name: "Rahul Sharma", email: "rahul@edu.com", role: "student", status: "active", joined: "May 15, 2024" },
  { id: "u2", name: "Dr. Sarah Johnson", email: "sarah@edu.com", role: "faculty", status: "active", joined: "May 10, 2024" },
  { id: "u3", name: "Prof. Michael Brown", email: "michael@edu.com", role: "faculty", status: "active", joined: "May 8, 2024" },
  { id: "u4", name: "Amit Kumar", email: "amit@edu.com", role: "student", status: "active", joined: "May 5, 2024" },
  { id: "u5", name: "Priya Patel", email: "priya@edu.com", role: "student", status: "inactive", joined: "May 3, 2024" },
];

const COORDINATORS = [
  { id: "c1", name: "Dr. Sarah Johnson", email: "sarah@edu.com", spec: "Computer Science", specCode: "CS", year: 2, sem: 3, active: true, assigned: "Jan 10, 2024" },
  { id: "c2", name: "Prof. Michael Brown", email: "michael@edu.com", spec: "Data Science", specCode: "DS", year: 1, sem: 2, active: true, assigned: "Jan 12, 2024" },
  { id: "c3", name: "Dr. Asha Reddy", email: "asha@edu.com", spec: "Information Technology", specCode: "IT", year: 3, sem: 5, active: false, assigned: "Jul 1, 2023" },
];

const LOGS = [
  { id: "l1", action: "HOD Changed", by: "Admin", detail: "HOD updated to Dr. John Smith", time: "May 20, 2024" },
  { id: "l2", action: "Branch Added", by: "Admin", detail: "Branch 'Data Science' was added to this department", time: "Mar 10, 2024" },
  { id: "l3", action: "Status Updated", by: "Admin", detail: "Department status changed to Active", time: "Jun 1, 2023" },
  { id: "l4", action: "Department Created", by: "System", detail: "Department CSE was created in the system", time: "Jan 15, 2023" },
];

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const initials = (name) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

function Av({ name, size = 36, green = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: green ? "#dcfce7" : "#f1f5f9",
      color: green ? "#16a34a" : "#475569",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.33, letterSpacing: "-0.5px",
    }}>
      {initials(name)}
    </div>
  );
}

function Pill({ label, green, yellow, red, blue }) {
  let bg = "#f1f5f9", color = "#475569";
  if (green) { bg = "#dcfce7"; color = "#16a34a"; }
  if (yellow) { bg = "#fef3c7"; color = "#d97706"; }
  if (red) { bg = "#fee2e2"; color = "#dc2626"; }
  if (blue) { bg = "#dbeafe"; color = "#2563eb"; }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 999,
      fontSize: 12, fontWeight: 600,
      background: bg, color,
    }}>
      {label}
    </span>
  );
}

function InfoRow({ label, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: 14, color: "#94a3b8" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", textAlign: "right" }}>{children}</span>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "22px 24px", ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", margin: "0 0 18px 0" }}>
      {children}
    </p>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", background: "#f8fafc", borderRadius: 10, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>{value}</span>
    </div>
  );
}

// ─── Change HOD Flow ──────────────────────────────────────────────────────────

function ChangeHODDrawer({ currentHod, onClose }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const list = FACULTY.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.employee_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(15,23,42,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: 18, width: 480, maxWidth: "95vw",
        boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden",
      }}>
        {done ? (
          /* ── Success ── */
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle2 size={32} color="#16a34a" />
            </div>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>HOD Updated!</p>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 28px" }}>
              <strong>{selected.name}</strong> is now the Head of Department.
            </p>
            <button onClick={onClose} style={btnStyle("#16a34a")}>Done</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 17, fontWeight: 800, color: "#1e293b", margin: 0 }}>Change Head of Department</p>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Pick a faculty member to assign as HOD</p>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "18px 24px" }}>
              {/* Current HOD banner */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8fafc", borderRadius: 10, marginBottom: 16 }}>
                <Av name={currentHod.name} size={38} green />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>Current: {currentHod.name}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{currentHod.employee_id} · {currentHod.designation}</p>
                </div>
                <Pill label="HOD" green />
              </div>

              {/* Search */}
              <div style={{ position: "relative", marginBottom: 12 }}>
                <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  autoFocus
                  placeholder="Search faculty by name or ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px 10px 36px",
                    border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14,
                    color: "#1e293b", outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Faculty list */}
              <div style={{ maxHeight: 280, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {list.length === 0 && (
                  <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 14, padding: "24px 0" }}>No faculty found</p>
                )}
                {list.map(f => {
                  const sel = selected?.id === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelected(f)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                        border: `2px solid ${sel ? "#16a34a" : "#f1f5f9"}`,
                        background: sel ? "#f0fdf4" : "#f8fafc",
                        transition: "all 0.12s",
                      }}
                    >
                      <Av name={f.name} size={40} green={sel} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>{f.name}</p>
                        <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>{f.designation} · {f.employee_id}</p>
                      </div>
                      {sel && <CheckCircle2 size={20} color="#16a34a" />}
                    </div>
                  );
                })}
              </div>

              {/* Selected preview */}
              {selected && (
                <div style={{ padding: "12px 14px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle2 size={16} color="#16a34a" />
                  <p style={{ fontSize: 13, color: "#166534", margin: 0 }}>
                    <strong>{selected.name}</strong> will be assigned as the new HOD
                  </p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={onClose} style={outlineBtn}>Cancel</button>
                <button
                  disabled={!selected}
                  onClick={() => setDone(true)}
                  style={btnStyle(selected ? "#16a34a" : "#e2e8f0", !selected ? "#94a3b8" : "#fff")}
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const btnStyle = (bg, color = "#fff") => ({
  padding: "10px 24px", borderRadius: 10, border: "none",
  background: bg, color, fontSize: 14, fontWeight: 700,
  cursor: bg === "#e2e8f0" ? "not-allowed" : "pointer",
  fontFamily: "inherit",
});

const outlineBtn = {
  padding: "10px 24px", borderRadius: 10, border: "1.5px solid #e2e8f0",
  background: "#fff", color: "#475569", fontSize: 14, fontWeight: 600,
  cursor: "pointer", fontFamily: "inherit",
};

// ─── TAB: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ onChangeHOD }) {
  const { stats, hod, branches, name, code, is_active, created_at, updated_at } = DEPT;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

        {/* Dept Info */}
        <Card>
          <CardTitle>Department Info</CardTitle>
          <InfoRow label="Name">{name}</InfoRow>
          <InfoRow label="Code"><span style={{ background: "#f1f5f9", padding: "2px 10px", borderRadius: 6, fontFamily: "monospace" }}>{code}</span></InfoRow>
          <InfoRow label="Status"><Pill label={is_active ? "Active" : "Inactive"} green={is_active} red={!is_active} /></InfoRow>
          <InfoRow label="Created">Jan 15, 2023</InfoRow>
          <InfoRow label="Updated">May 20, 2024</InfoRow>
        </Card>

        {/* HOD */}
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <CardTitle>Head of Department</CardTitle>
          <Av name={hod.name} size={60} green />
          <p style={{ fontSize: 17, fontWeight: 800, color: "#1e293b", margin: "14px 0 6px" }}>{hod.name}</p>
          <Pill label="HOD" green />
          <div style={{ width: "100%", marginTop: 16, display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Mail size={14} color="#16a34a" />
              <span style={{ fontSize: 13, color: "#64748b" }}>{hod.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Briefcase size={14} color="#16a34a" />
              <span style={{ fontSize: 13, color: "#64748b" }}>EMP ID: {hod.employee_id}</span>
            </div>
          </div>
          <button onClick={onChangeHOD} style={{
            marginTop: 18, width: "100%", padding: "10px 0",
            border: "1.5px solid #16a34a", borderRadius: 10,
            background: "#fff", color: "#16a34a", fontSize: 14,
            fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>
            Change HOD
          </button>
        </Card>

        {/* Stats */}
        <Card>
          <CardTitle>Department Statistics</CardTitle>
          <StatBox icon={<Building2 size={15} color="#16a34a" />} label="Total Branches" value={stats.totalBranches} />
          <StatBox icon={<GraduationCap size={15} color="#16a34a" />} label="Specializations" value={stats.totalSpecializations} />
          <StatBox icon={<Users size={15} color="#16a34a" />} label="Total Users" value={stats.totalUsers} />
          <StatBox icon={<UserCheck size={15} color="#16a34a" />} label="Coordinators" value={stats.totalCoordinators} />
        </Card>
      </div>

      {/* Branches */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Associated Branches</p>
          <button style={{ fontSize: 13, color: "#16a34a", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>View All</button>
        </div>
        <Table>
          <TableHeader>
            <TableRow style={{ background: "#f8fafc" }}>
              {["Branch Name", "Branch Code", "Specializations", "Status"].map(h => (
                <TableHead key={h} style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map(b => (
              <TableRow key={b.id} style={{ borderColor: "#f1f5f9" }}>
                <TableCell style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{b.name}</TableCell>
                <TableCell><span style={{ fontSize: 13, background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 6, fontFamily: "monospace", fontWeight: 700 }}>{b.code}</span></TableCell>
                <TableCell style={{ fontSize: 14, color: "#475569", fontWeight: 600 }}>{b.specCount}</TableCell>
                <TableCell><Pill label={b.is_active ? "Active" : "Inactive"} green={b.is_active} red={!b.is_active} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ─── TAB: Edit ────────────────────────────────────────────────────────────────

function EditTab() {
  const [name, setName] = useState(DEPT.name);
  const [code, setCode] = useState(DEPT.code);
  const [active, setActive] = useState(DEPT.is_active);

  const inp = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1e293b",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };

  return (
    <Card style={{ maxWidth: 540 }}>
      <CardTitle>Edit Department Details</CardTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {[["Department Name", name, setName], ["Department Code", code, setCode]].map(([label, val, set]) => (
          <div key={label}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7 }}>{label}</label>
            <input value={val} onChange={e => set(e.target.value)} style={inp} />
          </div>
        ))}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>Status</label>
          <div style={{ display: "flex", gap: 10 }}>
            {[true, false].map(v => (
              <button key={String(v)} onClick={() => setActive(v)} style={{
                padding: "9px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s",
                border: `2px solid ${active === v ? "#16a34a" : "#e2e8f0"}`,
                background: active === v ? "#f0fdf4" : "#fff",
                color: active === v ? "#16a34a" : "#94a3b8",
              }}>
                {v ? "Active" : "Inactive"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ paddingTop: 4 }}>
          <button style={btnStyle("#16a34a")}>Save Changes</button>
        </div>
      </div>
    </Card>
  );
}

// ─── TAB: HOD Management ──────────────────────────────────────────────────────

function HODTab({ onChangeHOD }) {
  const { hod } = DEPT;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <CardTitle>Current Head of Department</CardTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12 }}>
          <Av name={hod.name} size={52} green />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", margin: 0 }}>{hod.name}</p>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0" }}>{hod.email}</p>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>EMP ID: {hod.employee_id} · {hod.designation}</p>
          </div>
          <button onClick={onChangeHOD} style={{
            padding: "10px 20px", borderRadius: 10, border: "1.5px solid #16a34a",
            background: "#fff", color: "#16a34a", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Change HOD
          </button>
        </div>
      </Card>

      <Card>
        <CardTitle>All Faculty Members</CardTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[DEPT.hod, ...FACULTY].map(f => (
            <div key={f.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px", border: "1.5px solid #f1f5f9", borderRadius: 10,
              background: f.id === DEPT.hod.id ? "#f0fdf4" : "#fafafa",
            }}>
              <Av name={f.name} size={40} green={f.id === DEPT.hod.id} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>{f.name}</p>
                <p style={{ fontSize: 12, color: "#64748b", margin: "3px 0 0" }}>{f.designation} · {f.employee_id}</p>
              </div>
              {f.id === DEPT.hod.id && <Pill label="Current HOD" green />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── TAB: Branches ────────────────────────────────────────────────────────────

function BranchesTab() {
  return (
    <Card>
      <CardTitle>All Branches</CardTitle>
      <Table>
        <TableHeader>
          <TableRow style={{ background: "#f8fafc" }}>
            {["Branch Name", "Code", "Specializations", "Status"].map(h => (
              <TableHead key={h} style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {DEPT.branches.map(b => (
            <TableRow key={b.id} style={{ borderColor: "#f1f5f9" }}>
              <TableCell style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{b.name}</TableCell>
              <TableCell><span style={{ fontSize: 13, background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 6, fontFamily: "monospace", fontWeight: 700 }}>{b.code}</span></TableCell>
              <TableCell style={{ fontSize: 14, color: "#475569", fontWeight: 600 }}>{b.specCount}</TableCell>
              <TableCell><Pill label={b.is_active ? "Active" : "Inactive"} green={b.is_active} red={!b.is_active} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// ─── TAB: Users ───────────────────────────────────────────────────────────────

function UsersTab() {
  return (
    <Card>
      <CardTitle>Department Users</CardTitle>
      <Table>
        <TableHeader>
          <TableRow style={{ background: "#f8fafc" }}>
            {["User", "Email", "Role", "Status", "Joined"].map(h => (
              <TableHead key={h} style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {USERS.map(u => (
            <TableRow key={u.id} style={{ borderColor: "#f1f5f9" }}>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Av name={u.name} size={34} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{u.name}</span>
                </div>
              </TableCell>
              <TableCell style={{ fontSize: 13, color: "#64748b" }}>{u.email}</TableCell>
              <TableCell>
                <Pill label={u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                  green={u.role === "faculty"} blue={u.role === "student"} />
              </TableCell>
              <TableCell><Pill label={u.status === "active" ? "Active" : "Inactive"} green={u.status === "active"} red={u.status !== "active"} /></TableCell>
              <TableCell style={{ fontSize: 13, color: "#94a3b8" }}>{u.joined}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// ─── TAB: Coordinators ────────────────────────────────────────────────────────

function CoordinatorsTab() {
  return (
    <Card>
      <CardTitle>Coordinator Assignments</CardTitle>
      <Table>
        <TableHeader>
          <TableRow style={{ background: "#f8fafc" }}>
            {["Faculty", "Specialization", "Year / Sem", "Status", "Assigned"].map(h => (
              <TableHead key={h} style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {COORDINATORS.map(c => (
            <TableRow key={c.id} style={{ borderColor: "#f1f5f9" }}>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Av name={c.name} size={34} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0 }}>{c.name}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{c.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, background: "#f0fdf4", color: "#16a34a", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>{c.specCode}</span>
                  <span style={{ fontSize: 13, color: "#475569" }}>{c.spec}</span>
                </div>
              </TableCell>
              <TableCell style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Year {c.year} / Sem {c.sem}</TableCell>
              <TableCell><Pill label={c.active ? "Active" : "Inactive"} green={c.active} red={!c.active} /></TableCell>
              <TableCell style={{ fontSize: 13, color: "#94a3b8" }}>{c.assigned}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// ─── TAB: Activity Log ────────────────────────────────────────────────────────

function LogsTab() {
  return (
    <Card>
      <CardTitle>Activity Log</CardTitle>
      <div>
        {LOGS.map((log, i) => (
          <div key={log.id} style={{ display: "flex", gap: 18, paddingBottom: i < LOGS.length - 1 ? 24 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
              {i < LOGS.length - 1 && <div style={{ width: 2, flex: 1, background: "#e2e8f0", marginTop: 6 }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>{log.action}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8" }}>
                  <Clock size={12} />
                  <span style={{ fontSize: 12 }}>{log.time}</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px" }}>{log.detail}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>By: <strong style={{ color: "#64748b" }}>{log.by}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── MAIN MODAL ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "edit", label: "Edit Department", icon: ScrollText },
  { id: "hod", label: "HOD Management", icon: UserCheck },
  { id: "branches", label: "Branches", icon: BookOpen },
  { id: "users", label: "Users", icon: Users },
  { id: "coordinators", label: "Coordinators", icon: GraduationCap },
  { id: "logs", label: "Activity Log", icon: CalendarDays },
];

export default function DepartmentModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showHOD, setShowHOD] = useState(false);

  return (
    <>
      {showHOD && (
        <ChangeHODDrawer
          currentHod={DEPT.hod}
          onClose={() => setShowHOD(false)}
        />
      )}

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent style={{
          background: "#f8fafc",
          borderRadius: 18,
          maxWidth: 940,
          width: "96vw",
          maxHeight: "92vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
          border: "1px solid #e2e8f0",
          gap: 0,
        }}>

          {/* ── Modal Header ── */}
          <div style={{ background: "#fff", padding: "24px 28px 0", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Building2 size={26} color="#16a34a" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", margin: 0, lineHeight: 1.2 }}>
                    {DEPT.name}
                  </h2>
                  <Pill label="Active" green />
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "5px 0 0" }}>
                  Code: <strong style={{ color: "#64748b" }}>{DEPT.code}</strong>
                  &nbsp;·&nbsp; Created: Jan 15, 2023
                  &nbsp;·&nbsp; Updated: May 20, 2024
                </p>
              </div>
            </div>

            {/* Tab Bar */}
            <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "11px 16px",
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      color: active ? "#16a34a" : "#94a3b8",
                      background: "none", border: "none", cursor: "pointer",
                      borderBottom: `2.5px solid ${active ? "#16a34a" : "transparent"}`,
                      whiteSpace: "nowrap", fontFamily: "inherit",
                      transition: "all 0.12s",
                    }}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div style={{ overflowY: "auto", flex: 1, padding: "24px 28px 32px" }}>
            {activeTab === "overview"     && <OverviewTab onChangeHOD={() => setShowHOD(true)} />}
            {activeTab === "edit"         && <EditTab />}
            {activeTab === "hod"          && <HODTab onChangeHOD={() => setShowHOD(true)} />}
            {activeTab === "branches"     && <BranchesTab />}
            {activeTab === "users"        && <UsersTab />}
            {activeTab === "coordinators" && <CoordinatorsTab />}
            {activeTab === "logs"         && <LogsTab />}
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}