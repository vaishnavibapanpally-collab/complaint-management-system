import { useState, useEffect } from "react";

const mockComplaints = [
  { id: 1, name: "Arjun Sharma", email: "arjun@college.edu", category: "IT", complaintText: "WiFi not working in Block B lab since Monday.", priority: "High", status: "Pending", createdAt: "2024-03-10T09:30:00" },
  { id: 2, name: "Priya Nair", email: "priya@college.edu", category: "Maintenance", complaintText: "Water leakage in girls hostel bathroom.", priority: "High", status: "In Progress", createdAt: "2024-03-09T14:00:00" },
  { id: 3, name: "Rohit Verma", email: "rohit@college.edu", category: "Cleanliness", complaintText: "Garbage not collected from corridor for 3 days.", priority: "Medium", status: "Resolved", createdAt: "2024-03-08T11:15:00" },
  { id: 4, name: "Sneha Patel", email: "sneha@college.edu", category: "Electrical", complaintText: "Lights flickering in classroom 204.", priority: "Low", status: "Pending", createdAt: "2024-03-11T08:45:00" },
];

const STATUS_COLORS = {
  "Pending": { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400", border: "border-amber-200" },
  "In Progress": { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" },
  "Resolved": { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
};

const PRIORITY_COLORS = {
  "High": "text-red-600 bg-red-50 border border-red-200",
  "Medium": "text-orange-600 bg-orange-50 border border-orange-200",
  "Low": "text-green-600 bg-green-50 border border-green-200",
};

const CATEGORY_ICONS = {
  "IT": "💻", "Maintenance": "🔧", "Cleanliness": "🧹", "Electrical": "⚡", "Other": "📋"
};

export default function App() {
  const [view, setView] = useState("home");
  const [complaints, setComplaints] = useState(mockComplaints);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", category: "IT", priority: "Medium", complaintText: "" });
  const [trackId, setTrackId] = useState("");
  const [trackedComplaint, setTrackedComplaint] = useState(null);
  const [adminTab, setAdminTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState("All");

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.complaintText) return alert("Please fill all fields");
    const newComplaint = { ...form, id: complaints.length + 1, status: "Pending", createdAt: new Date().toISOString() };
    setComplaints([...complaints, newComplaint]);
    setSubmitted(true);
  };

  const handleTrack = () => {
    const found = complaints.find(c => c.id === parseInt(trackId));
    setTrackedComplaint(found || null);
  };

  const updateStatus = (id, newStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const filteredComplaints = filterStatus === "All" ? complaints : complaints.filter(c => c.status === filterStatus);

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "#f8f6f1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Source Sans 3', sans-serif; }
        .playfair { font-family: 'Playfair Display', serif; }
        .nav-link { cursor: pointer; padding: 8px 18px; border-radius: 4px; font-size: 14px; font-weight: 500; transition: all 0.2s; letter-spacing: 0.5px; }
        .nav-link:hover { background: rgba(139,90,43,0.1); }
        .nav-link.active { background: #8B5A2B; color: white; }
        .card { background: white; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #ede8e0; }
        .btn-primary { background: #8B5A2B; color: white; border: none; padding: 12px 28px; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600; letter-spacing: 0.3px; transition: all 0.2s; }
        .btn-primary:hover { background: #6d4522; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(139,90,43,0.3); }
        .btn-outline { background: transparent; color: #8B5A2B; border: 1.5px solid #8B5A2B; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; }
        .btn-outline:hover { background: #8B5A2B; color: white; }
        .input { width: 100%; padding: 12px 16px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 15px; font-family: 'Source Sans 3', sans-serif; background: #fdfcfa; transition: border 0.2s; outline: none; }
        .input:focus { border-color: #8B5A2B; box-shadow: 0 0 0 3px rgba(139,90,43,0.1); }
        .select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238B5A2B' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; }
        .stat-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #ede8e0; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .complaint-row { background: white; border: 1px solid #ede8e0; border-radius: 10px; padding: 18px 22px; margin-bottom: 12px; display: flex; align-items: flex-start; gap: 16px; transition: box-shadow 0.2s; }
        .complaint-row:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
        .tab { padding: 8px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; border: none; background: transparent; }
        .tab.active { background: #8B5A2B; color: white; }
        .tab:not(.active):hover { background: #f0ebe3; }
        .hero-decoration { position: absolute; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(139,90,43,0.08) 0%, transparent 70%); pointer-events: none; }
        .step-circle { width: 44px; height: 44px; border-radius: 50%; background: #8B5A2B; color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; flex-shrink: 0; }
        select.input { cursor: pointer; }
        textarea.input { resize: vertical; min-height: 100px; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin: 32px 0; }
        .priority-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: "white", borderBottom: "1px solid #ede8e0", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "66px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "#8B5A2B", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📋</div>
          <span className="playfair" style={{ fontSize: 20, fontWeight: 700, color: "#2c1810" }}>ComplainEase</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["home","submit","track","admin"].map(v => (
            <button key={v} className={`nav-link ${view === v ? "active" : ""}`} style={{ color: view === v ? "white" : "#555" }} onClick={() => { setView(v); setSubmitted(false); setTrackedComplaint(null); }}>
              {v === "home" ? "🏠 Home" : v === "submit" ? "📝 Submit" : v === "track" ? "🔍 Track" : "👨‍💼 Admin"}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* HOME */}
        {view === "home" && (
          <div>
            <div style={{ position: "relative", background: "linear-gradient(135deg, #3d1f0e 0%, #8B5A2B 60%, #c4813f 100%)", borderRadius: 20, padding: "64px 60px", color: "white", marginBottom: 40, overflow: "hidden" }}>
              <div className="hero-decoration" style={{ top: -80, right: -80 }} />
              <div className="hero-decoration" style={{ bottom: -120, left: -60 }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", padding: "6px 18px", borderRadius: 20, fontSize: 13, marginBottom: 20, letterSpacing: 1, fontWeight: 600 }}>COMPLAINT MANAGEMENT SYSTEM</div>
                <h1 className="playfair" style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.15, marginBottom: 20, maxWidth: 560 }}>
                  Your Voice,<br />Our Priority.
                </h1>
                <p style={{ fontSize: 18, opacity: 0.85, maxWidth: 480, lineHeight: 1.7, marginBottom: 36, fontWeight: 300 }}>
                  Submit complaints, track resolutions, and ensure every issue gets the attention it deserves. Built for colleges, apartments & offices.
                </p>
                <div style={{ display: "flex", gap: 16 }}>
                  <button className="btn-primary" style={{ background: "white", color: "#8B5A2B" }} onClick={() => setView("submit")}>Submit a Complaint →</button>
                  <button className="btn-outline" style={{ borderColor: "rgba(255,255,255,0.6)", color: "white" }} onClick={() => setView("track")}>Track Status</button>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
              {[
                { label: "Total Filed", value: stats.total, icon: "📋", color: "#8B5A2B" },
                { label: "Pending", value: stats.pending, icon: "⏳", color: "#d97706" },
                { label: "In Progress", value: stats.inProgress, icon: "🔄", color: "#3b82f6" },
                { label: "Resolved", value: stats.resolved, icon: "✅", color: "#10b981" },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                  <div className="playfair" style={{ fontSize: 36, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 14, color: "#888", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              {[
                { icon: "📝", title: "Submit Complaint", desc: "Fill out a simple form with details about your issue. It takes less than 2 minutes.", action: () => setView("submit") },
                { icon: "🔍", title: "Track Status", desc: "Enter your complaint ID to see real-time updates on resolution progress.", action: () => setView("track") },
                { icon: "⚡", title: "Fast Resolution", desc: "Admins get instant notifications and can update status directly from dashboard.", action: () => setView("admin") },
              ].map(f => (
                <div key={f.title} className="card" style={{ padding: "28px 24px", cursor: "pointer" }} onClick={f.action}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                  <h3 className="playfair" style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: "#2c1810" }}>{f.title}</h3>
                  <p style={{ color: "#777", lineHeight: 1.7, fontSize: 14 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMIT COMPLAINT */}
        {view === "submit" && (
          <div style={{ maxWidth: 660, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <h2 className="playfair" style={{ fontSize: 36, fontWeight: 800, color: "#2c1810", marginBottom: 8 }}>Submit a Complaint</h2>
              <p style={{ color: "#888", fontSize: 15 }}>Fill in the details below. You'll receive a tracking ID instantly.</p>
            </div>

            {!submitted ? (
              <div className="card" style={{ padding: 36 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#444" }}>Full Name *</label>
                    <input className="input" placeholder="e.g. Arjun Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#444" }}>Email Address *</label>
                    <input className="input" placeholder="you@college.edu" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#444" }}>Category *</label>
                    <select className="input select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      {["IT", "Maintenance", "Cleanliness", "Electrical", "Other"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#444" }}>Priority *</label>
                    <select className="input select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                      {["Low", "Medium", "High"].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#444" }}>Describe Your Complaint *</label>
                  <textarea className="input" placeholder="Please describe your issue in detail..." value={form.complaintText} onChange={e => setForm({...form, complaintText: e.target.value})} style={{ minHeight: 120 }} />
                </div>

                <button className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 16 }} onClick={handleSubmit}>
                  Submit Complaint →
                </button>
              </div>
            ) : (
              <div className="card" style={{ padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                <h3 className="playfair" style={{ fontSize: 28, fontWeight: 700, color: "#2c1810", marginBottom: 12 }}>Complaint Submitted!</h3>
                <p style={{ color: "#666", marginBottom: 8 }}>Your complaint has been received successfully.</p>
                <div style={{ background: "#f0ebe3", border: "1px solid #ddd6c8", borderRadius: 10, padding: "16px 24px", display: "inline-block", margin: "20px 0" }}>
                  <p style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Your Tracking ID</p>
                  <p className="playfair" style={{ fontSize: 28, fontWeight: 800, color: "#8B5A2B" }}>#{complaints.length}</p>
                </div>
                <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Save this ID to track your complaint status</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <button className="btn-primary" onClick={() => { setView("track"); setTrackId(String(complaints.length)); }}>Track My Complaint</button>
                  <button className="btn-outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", category: "IT", priority: "Medium", complaintText: "" }); }}>Submit Another</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRACK */}
        {view === "track" && (
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <h2 className="playfair" style={{ fontSize: 36, fontWeight: 800, color: "#2c1810", marginBottom: 8 }}>Track Your Complaint</h2>
              <p style={{ color: "#888", fontSize: 15 }}>Enter your complaint ID to see its current status.</p>
            </div>

            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <input className="input" placeholder="Enter your complaint ID (e.g. 1, 2, 3...)" value={trackId} onChange={e => setTrackId(e.target.value)} style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && handleTrack()} />
                <button className="btn-primary" onClick={handleTrack} style={{ whiteSpace: "nowrap" }}>Search →</button>
              </div>
            </div>

            {trackedComplaint && (
              <div className="card" style={{ padding: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <p style={{ color: "#999", fontSize: 13, marginBottom: 4 }}>Complaint #{trackedComplaint.id}</p>
                    <h3 className="playfair" style={{ fontSize: 22, fontWeight: 700, color: "#2c1810" }}>{trackedComplaint.name}</h3>
                    <p style={{ color: "#888", fontSize: 14 }}>{trackedComplaint.email}</p>
                  </div>
                  <div>
                    {(() => { const s = STATUS_COLORS[trackedComplaint.status]; return (
                      <span className="status-badge" style={{ background: s.bg.replace("bg-",""), color: s.text.replace("text-",""), border: `1px solid`, borderColor: s.border.replace("border-","") }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot.replace("bg-",""), display: "inline-block" }}></span>
                        {trackedComplaint.status}
                      </span>
                    ); })()}
                  </div>
                </div>
                <div className="divider" style={{ margin: "20px 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div style={{ background: "#faf8f5", borderRadius: 8, padding: "12px 16px" }}>
                    <p style={{ color: "#999", fontSize: 12, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>CATEGORY</p>
                    <p style={{ fontWeight: 600, color: "#444" }}>{CATEGORY_ICONS[trackedComplaint.category]} {trackedComplaint.category}</p>
                  </div>
                  <div style={{ background: "#faf8f5", borderRadius: 8, padding: "12px 16px" }}>
                    <p style={{ color: "#999", fontSize: 12, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>PRIORITY</p>
                    <p style={{ fontWeight: 600, color: "#444" }}>{trackedComplaint.priority}</p>
                  </div>
                </div>
                <div style={{ background: "#faf8f5", borderRadius: 8, padding: "16px", marginBottom: 20 }}>
                  <p style={{ color: "#999", fontSize: 12, marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>COMPLAINT DETAILS</p>
                  <p style={{ color: "#444", lineHeight: 1.7 }}>{trackedComplaint.complaintText}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Pending","In Progress","Resolved"].map((s,i) => (
                    <div key={s} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ height: 4, borderRadius: 2, background: ["Pending","In Progress","Resolved"].indexOf(trackedComplaint.status) >= i ? "#8B5A2B" : "#e5e0d8", marginBottom: 6 }} />
                      <p style={{ fontSize: 11, color: ["Pending","In Progress","Resolved"].indexOf(trackedComplaint.status) >= i ? "#8B5A2B" : "#bbb", fontWeight: 600 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {trackedComplaint === null && trackId && (
              <div className="card" style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <p style={{ color: "#888" }}>No complaint found with ID #{trackId}</p>
              </div>
            )}
          </div>
        )}

        {/* ADMIN */}
        {view === "admin" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
              <div>
                <h2 className="playfair" style={{ fontSize: 36, fontWeight: 800, color: "#2c1810", marginBottom: 6 }}>Admin Dashboard</h2>
                <p style={{ color: "#888", fontSize: 15 }}>Manage and resolve all complaints from one place.</p>
              </div>
              <div style={{ display: "flex", gap: 8, background: "white", padding: 6, borderRadius: 10, border: "1px solid #ede8e0" }}>
                {["All", "Pending", "In Progress", "Resolved"].map(s => (
                  <button key={s} className={`tab ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>{s} {s !== "All" && `(${s === "Pending" ? stats.pending : s === "In Progress" ? stats.inProgress : stats.resolved})`}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Total", value: stats.total, color: "#8B5A2B", bg: "#fdf6ef" },
                { label: "Pending", value: stats.pending, color: "#d97706", bg: "#fffbeb" },
                { label: "In Progress", value: stats.inProgress, color: "#3b82f6", bg: "#eff6ff" },
                { label: "Resolved", value: stats.resolved, color: "#10b981", bg: "#ecfdf5" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "20px 24px", border: "1px solid", borderColor: s.color + "33" }}>
                  <p style={{ color: s.color, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>{s.label.toUpperCase()}</p>
                  <p className="playfair" style={{ fontSize: 40, fontWeight: 800, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div>
              {filteredComplaints.map(c => {
                const sc = STATUS_COLORS[c.status];
                return (
                  <div key={c.id} className="complaint-row">
                    <div style={{ fontSize: 28, marginTop: 2 }}>{CATEGORY_ICONS[c.category] || "📋"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <span style={{ fontWeight: 700, color: "#2c1810", marginRight: 10 }}>{c.name}</span>
                          <span style={{ background: "#f0ebe3", color: "#8B5A2B", fontSize: 12, padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>#{c.id}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${PRIORITY_COLORS[c.priority]}`} style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{c.priority}</span>
                          <span style={{ fontSize: 12, color: "#aaa" }}>{c.createdAt?.slice(0,10)}</span>
                        </div>
                      </div>
                      <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{c.complaintText}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, color: "#999" }}>📧 {c.email}</span>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                            style={{ padding: "6px 12px", borderRadius: 6, border: "1.5px solid #ddd", fontSize: 13, background: "white", cursor: "pointer", fontFamily: "Source Sans 3, sans-serif" }}>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredComplaints.length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                  <p>No complaints in this category</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
