import { useState } from "react";

const mockComplaints = [
  { id: 1, name: "Arjun Sharma", email: "arjun@college.edu", category: "IT", complaintText: "WiFi not working in Block B lab since Monday.", priority: "High", status: "Pending", createdAt: "2024-03-10T09:30:00" },
  { id: 2, name: "Priya Nair", email: "priya@college.edu", category: "Maintenance", complaintText: "Water leakage in girls hostel bathroom.", priority: "High", status: "In Progress", createdAt: "2024-03-09T14:00:00" },
  { id: 3, name: "Rohit Verma", email: "rohit@college.edu", category: "Cleanliness", complaintText: "Garbage not collected from corridor for 3 days.", priority: "Medium", status: "Resolved", createdAt: "2024-03-08T11:15:00" },
  { id: 4, name: "Sneha Patel", email: "sneha@college.edu", category: "Electrical", complaintText: "Lights flickering in classroom 204.", priority: "Low", status: "Pending", createdAt: "2024-03-11T08:45:00" },
];

const STATUS_COLORS = {
  "Pending":     { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", border: "#FDE68A" },
  "In Progress": { bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6", border: "#BFDBFE" },
  "Resolved":    { bg: "#D1FAE5", text: "#065F46", dot: "#10B981", border: "#A7F3D0" },
};

const CATEGORY_ICONS = {
  "Maintenance": "🔧", "Cleanliness": "🧹",
  "Electrical": "⚡", "Safety": "🚨", "Other": "📋"
};

// ── SMART AI ENGINE (keyword-based) ──
function analyzeWithAI(text) {
  const t = text.toLowerCase();

  // Detect Category
  let category = "Other";
  if(/leak|pipe|water|broken|door|window|roof|wall|floor|ceiling|crack|repair|fix|building|toilet|bathroom|tap/.test(t)) category = "Maintenance";
  else if (/garbage|trash|dirty|clean|sweep|dust|waste|smell|cockroach|rat|pest|hygiene|toilet smell/.test(t)) category = "Cleanliness";
  else if (/light|fan|power|electricity|switch|socket|wire|short circuit|blackout|electric|bulb|ac|air conditioner/.test(t)) category = "Electrical";
  else if (/fire|danger|injury|accident|emergency|unsafe|threat|fight|flood/.test(t)) category = "Safety";

  // Detect Priority
  let priority = "Low";
  if (/urgent|emergency|immediately|critical|danger|fire|flood|injury|not working since|days|week|still|not fixed/.test(t)) priority = "Urgent";
  else if (/not working|broken|failed|down|leaking|flickering|no power|no wifi|cannot access|blocked/.test(t)) priority = "High";
  else if (/sometimes|occasionally|slow|minor|small|issue|problem/.test(t)) priority = "Medium";
  else priority = "Low";

  // Detect Sentiment
  let sentiment = "Neutral";
  if (/please|kindly|request|hope/.test(t)) sentiment = "Concerned";
  else if (/urgent|immediately|asap|not fixed|still|again|repeatedly|days|weeks/.test(t)) sentiment = "Frustrated";
  else if (/emergency|danger|fire|flood|injury/.test(t)) sentiment = "Urgent";

  // Generate reason
  const reasons = {
    "Maintenance": "Complaint indicates a structural or plumbing maintenance requirement.",
    "Cleanliness": "Complaint relates to hygiene or sanitation conditions.",
    "Electrical": "Complaint involves electrical systems or power infrastructure.",
    "Safety": "Complaint indicates a safety or emergency situation.",
    "Other": "Complaint does not match a specific predefined category."
  };

  // Generate resolution suggestion
  const suggestions = {
    "Maintenance": "Dispatch the maintenance team immediately to assess and repair the structural or plumbing issue.",
    "Cleanliness": "Schedule the housekeeping team for an immediate cleaning session and review waste collection schedules.",
    "Electrical": "Alert the electrical maintenance team to inspect wiring, switches, and power supply units in the affected area.",
    "Safety": "Treat as high priority — alert security personnel and relevant authorities immediately to assess the situation.",
    "Other": "Assign to the general grievance team to investigate and route to the appropriate department."
  };

  return { category, priority, sentiment, reason: reasons[category], suggestion: suggestions[category] };
}

export default function App() {
  const [view, setView]             = useState("home");
  const [complaints, setComplaints] = useState(mockComplaints);
  const [submitted, setSubmitted]   = useState(false);
  const [form, setForm]             = useState({ name: "", email: "", category: "", priority: "", complaintText: "" });
  const [trackId, setTrackId]       = useState("");
  const [trackedComplaint, setTrackedComplaint] = useState(null);
  const [filterStatus, setFilterStatus]         = useState("All");
  const [aiLoading, setAiLoading]   = useState(false);
  const [aiResult, setAiResult]     = useState(null);

  const stats = {
    total:      complaints.length,
    pending:    complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved:   complaints.filter(c => c.status === "Resolved").length,
  };

  const handleAnalyze = () => {
    if (form.complaintText.trim().length < 10) return;
    setAiLoading(true);
    setAiResult(null);
    // Simulate AI thinking delay
    setTimeout(() => {
      const result = analyzeWithAI(form.complaintText);
      setAiResult(result);
      setForm(f => ({ ...f, category: result.category, priority: result.priority }));
      setAiLoading(false);
    }, 1800);
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.complaintText) return alert("Please fill all fields");
    const newComplaint = { ...form, id: complaints.length + 1, status: "Pending", createdAt: new Date().toISOString() };
    setComplaints([...complaints, newComplaint]);
    setSubmitted(true);
  };

  const handleTrack = () => {
    const found = complaints.find(c => c.id === parseInt(trackId));
    setTrackedComplaint(found !== undefined ? found : null);
  };

  const updateStatus = (id, newStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const filteredComplaints = filterStatus === "All" ? complaints : complaints.filter(c => c.status === filterStatus);

  return (
    <div style={{ fontFamily: "'Georgia',serif", minHeight: "100vh", background: "#f8f6f1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .playfair { font-family: 'Playfair Display', serif; }
        .nav-link { cursor: pointer; padding: 8px 18px; border-radius: 4px; font-size: 14px; font-weight: 500; transition: all 0.2s; border: none; background: transparent; }
        .nav-link:hover { background: rgba(139,90,43,0.1); }
        .nav-link.active { background: #8B5A2B; color: white; }
        .card { background: white; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #ede8e0; }
        .btn-primary { background: #8B5A2B; color: white; border: none; padding: 12px 28px; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600; transition: all 0.2s; }
        .btn-primary:hover { background: #6d4522; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(139,90,43,0.3); }
        .btn-outline { background: transparent; color: #8B5A2B; border: 1.5px solid #8B5A2B; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; }
        .btn-outline:hover { background: #8B5A2B; color: white; }
        .btn-ai { background: linear-gradient(135deg, #1a1a2e, #302b63); color: white; border: none; padding: 11px 22px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-ai:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.3); }
        .btn-ai:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .input { width: 100%; padding: 12px 16px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 15px; font-family: 'Source Sans 3', sans-serif; background: #fdfcfa; transition: border 0.2s; outline: none; }
        .input:focus { border-color: #8B5A2B; box-shadow: 0 0 0 3px rgba(139,90,43,0.1); }
        .tab { padding: 8px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; border: none; background: transparent; }
        .tab.active { background: #8B5A2B; color: white; }
        .tab:not(.active):hover { background: #f0ebe3; }
        .complaint-row { background: white; border: 1px solid #ede8e0; border-radius: 10px; padding: 18px 22px; margin-bottom: 12px; display: flex; align-items: flex-start; gap: 16px; transition: box-shadow 0.2s; }
        .complaint-row:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin: 20px 0; }
        .ai-card { background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); border-radius: 12px; padding: 22px 24px; color: white; margin: 16px 0; border: 1px solid rgba(255,255,255,0.1); }
        .ai-grid-item { background: rgba(255,255,255,0.09); border-radius: 8px; padding: 12px 14px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { display: inline-block; animation: spin 1s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease; }
        .hero-bg { background: linear-gradient(135deg, #3d1f0e 0%, #8B5A2B 60%, #c4813f 100%); border-radius: 20px; padding: 64px 60px; color: white; margin-bottom: 40px; position: relative; overflow: hidden; }
        .hero-circle { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%); pointer-events: none; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: "white", borderBottom: "1px solid #ede8e0", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 66, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "#8B5A2B", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📋</div>
          <span className="playfair" style={{ fontSize: 20, fontWeight: 700, color: "#2c1810" }}>ComplainEase</span>
          <span style={{ background: "linear-gradient(135deg,#1a1a2e,#302b63)", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5 }}>✨ AI Powered</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["home","🏠 Home"],["submit","📝 Submit"],["track","🔍 Track"],["admin","👨‍💼 Admin"]].map(([v, label]) => (
            <button key={v} className={`nav-link ${view === v ? "active" : ""}`} style={{ color: view === v ? "white" : "#555" }}
              onClick={() => { setView(v); setSubmitted(false); setTrackedComplaint(null); setAiResult(null); }}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── HOME ── */}
        {view === "home" && (
          <div>
            <div className="hero-bg">
              <div className="hero-circle" style={{ width: 300, height: 300, top: -80, right: -80 }} />
              <div className="hero-circle" style={{ width: 400, height: 400, bottom: -150, left: -80 }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", padding: "6px 18px", borderRadius: 20, fontSize: 13, marginBottom: 20, letterSpacing: 1, fontWeight: 600 }}>COMPLAINT MANAGEMENT SYSTEM</div>
                <h1 className="playfair" style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.15, marginBottom: 20, maxWidth: 560 }}>Your Voice,<br />Our Priority.</h1>
                <p style={{ fontSize: 17, opacity: 0.85, maxWidth: 480, lineHeight: 1.7, marginBottom: 16, fontWeight: 300 }}>Submit complaints, track resolutions, and ensure every issue gets the attention it deserves.</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 30, padding: "8px 18px", marginBottom: 32, fontSize: 13 }}>
                  ✨ <span>Now with <strong>AI Auto-Analysis</strong> — instant category & priority detection!</span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <button className="btn-primary" style={{ background: "white", color: "#8B5A2B" }} onClick={() => setView("submit")}>Submit a Complaint →</button>
                  <button className="btn-outline" style={{ borderColor: "rgba(255,255,255,0.6)", color: "white" }} onClick={() => setView("track")}>Track Status</button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 36 }}>
              {[{ label: "Total Filed", value: stats.total, icon: "📋", color: "#8B5A2B" }, { label: "Pending", value: stats.pending, icon: "⏳", color: "#d97706" }, { label: "In Progress", value: stats.inProgress, icon: "🔄", color: "#3b82f6" }, { label: "Resolved", value: stats.resolved, icon: "✅", color: "#10b981" }].map(s => (
                <div key={s.label} style={{ background: "white", borderRadius: 12, padding: 24, border: "1px solid #ede8e0", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                  <div className="playfair" style={{ fontSize: 36, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 14, color: "#888", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* AI Feature Banner */}
            <div className="ai-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <span style={{ fontSize: 36 }}>🤖</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>AI-Powered Complaint Analysis</div>
                  <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>Smart keyword detection — instantly classifies your complaint</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[["🏷️", "Auto Category", "Detects IT, Maintenance, Electrical & more"], ["⚡", "Smart Priority", "Low / Medium / High / Urgent"], ["💡", "Resolution Tip", "Suggests next steps for admin"], ["😊", "Sentiment", "Understands user urgency & emotion"]].map(([icon, title, desc]) => (
                  <div key={title} className="ai-grid-item">
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12, opacity: 0.65, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SUBMIT ── */}
        {view === "submit" && (
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <h2 className="playfair" style={{ fontSize: 36, fontWeight: 800, color: "#2c1810", marginBottom: 8 }}>Submit a Complaint</h2>
              <p style={{ color: "#888", fontSize: 15 }}>Describe your issue — our AI will auto-detect the category and priority!</p>
            </div>

            {!submitted ? (
              <div className="card" style={{ padding: 36 }}>
                {/* Name & Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#444" }}>Full Name *</label>
                    <input className="input" placeholder="e.g. Arjun Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#444" }}>Email Address *</label>
                    <input className="input" placeholder="you@college.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>

                {/* Complaint text + AI button */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#444" }}>Describe Your Complaint *</label>
                  <textarea className="input" placeholder="e.g. WiFi has not been working in Block B lab since Monday morning..." value={form.complaintText}
                    onChange={e => { setForm({ ...form, complaintText: e.target.value }); setAiResult(null); }}
                    style={{ minHeight: 120, resize: "vertical" }} />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <button className="btn-ai" onClick={handleAnalyze} disabled={aiLoading || form.complaintText.trim().length < 10}>
                      {aiLoading
                        ? <><span className="spin">⚙️</span> Analyzing...</>
                        : <><span>✨</span> Analyze with AI</>}
                    </button>
                  </div>
                </div>

                {/* AI Loading */}
                {aiLoading && (
                  <div className="ai-card" style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="spin" style={{ fontSize: 24 }}>⚙️</span>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>AI is analyzing your complaint...</div>
                        <div style={{ fontSize: 13, opacity: 0.6 }}>Detecting category, priority, and sentiment</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Result */}
                {aiResult && !aiLoading && (
                  <div className="ai-card fade-in" style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: 22 }}>🤖</span>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>AI Analysis Complete</span>
                      <span style={{ background: "rgba(255,255,255,0.2)", fontSize: 11, padding: "2px 10px", borderRadius: 20, marginLeft: 4 }}>✓ Auto-filled below</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                      <div className="ai-grid-item">
                        <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>DETECTED CATEGORY</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{CATEGORY_ICONS[aiResult.category]} {aiResult.category}</div>
                      </div>
                      <div className="ai-grid-item">
                        <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>PRIORITY LEVEL</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{aiResult.priority === "Urgent" ? "🚨" : aiResult.priority === "High" ? "🔴" : aiResult.priority === "Medium" ? "🟡" : "🟢"} {aiResult.priority}</div>
                      </div>
                      <div className="ai-grid-item">
                        <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>USER SENTIMENT</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{aiResult.sentiment === "Frustrated" ? "😤" : aiResult.sentiment === "Urgent" ? "😰" : aiResult.sentiment === "Concerned" ? "😟" : "😐"} {aiResult.sentiment}</div>
                      </div>
                      <div className="ai-grid-item">
                        <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>AI REASONING</div>
                        <div style={{ fontSize: 12, lineHeight: 1.5 }}>{aiResult.reason}</div>
                      </div>
                    </div>
                    <div className="ai-grid-item">
                      <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>💡 SUGGESTED RESOLUTION FOR ADMIN</div>
                      <div style={{ fontSize: 13, lineHeight: 1.6 }}>{aiResult.suggestion}</div>
                    </div>
                  </div>
                )}

                {/* Category & Priority dropdowns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#444" }}>
                      Category {aiResult && <span style={{ color: "#8B5A2B", fontSize: 12, fontWeight: 600 }}>✨ AI filled</span>}
                    </label>
                    <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      style={{ appearance: "none", background: aiResult ? "#fdf6ef" : "#fdfcfa", borderColor: aiResult ? "#8B5A2B" : "#ddd" }}>
                      <option value="">Select category...</option>
                      {["IT", "Maintenance", "Cleanliness", "Electrical", "Safety", "Other"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#444" }}>
                      Priority {aiResult && <span style={{ color: "#8B5A2B", fontSize: 12, fontWeight: 600 }}>✨ AI filled</span>}
                    </label>
                    <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                      style={{ appearance: "none", background: aiResult ? "#fdf6ef" : "#fdfcfa", borderColor: aiResult ? "#8B5A2B" : "#ddd" }}>
                      <option value="">Select priority...</option>
                      {["Low", "Medium", "High", "Urgent"].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <button className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 16 }} onClick={handleSubmit}>
                  Submit Complaint →
                </button>
              </div>
            ) : (
              <div className="card" style={{ padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                <h3 className="playfair" style={{ fontSize: 28, fontWeight: 700, color: "#2c1810", marginBottom: 12 }}>Complaint Submitted!</h3>
                <div style={{ background: "#f0ebe3", border: "1px solid #ddd6c8", borderRadius: 10, padding: "16px 24px", display: "inline-block", margin: "20px 0" }}>
                  <p style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Your Tracking ID</p>
                  <p className="playfair" style={{ fontSize: 28, fontWeight: 800, color: "#8B5A2B" }}>#{complaints.length}</p>
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <button className="btn-primary" onClick={() => { setView("track"); setTrackId(String(complaints.length)); }}>Track My Complaint</button>
                  <button className="btn-outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", category: "", priority: "", complaintText: "" }); setAiResult(null); }}>Submit Another</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TRACK ── */}
        {view === "track" && (
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <h2 className="playfair" style={{ fontSize: 36, fontWeight: 800, color: "#2c1810", marginBottom: 8 }}>Track Your Complaint</h2>
              <p style={{ color: "#888", fontSize: 15 }}>Enter your complaint ID to see real-time status.</p>
            </div>
            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <input className="input" placeholder="Enter complaint ID (e.g. 1, 2, 3...)" value={trackId}
                  onChange={e => setTrackId(e.target.value)} style={{ flex: 1 }}
                  onKeyDown={e => e.key === "Enter" && handleTrack()} />
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
                  {(() => { const s = STATUS_COLORS[trackedComplaint.status]; return (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
                      {trackedComplaint.status}
                    </span>
                  ); })()}
                </div>
                <div className="divider" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: "#faf8f5", borderRadius: 8, padding: "12px 16px" }}>
                    <p style={{ color: "#999", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>CATEGORY</p>
                    <p style={{ fontWeight: 600, color: "#444" }}>{CATEGORY_ICONS[trackedComplaint.category]} {trackedComplaint.category}</p>
                  </div>
                  <div style={{ background: "#faf8f5", borderRadius: 8, padding: "12px 16px" }}>
                    <p style={{ color: "#999", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>PRIORITY</p>
                    <p style={{ fontWeight: 600, color: "#444" }}>{trackedComplaint.priority}</p>
                  </div>
                </div>
                <div style={{ background: "#faf8f5", borderRadius: 8, padding: "16px", marginBottom: 20 }}>
                  <p style={{ color: "#999", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>COMPLAINT</p>
                  <p style={{ color: "#444", lineHeight: 1.7 }}>{trackedComplaint.complaintText}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Pending", "In Progress", "Resolved"].map((s, i) => (
                    <div key={s} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ height: 4, borderRadius: 2, marginBottom: 6, background: ["Pending","In Progress","Resolved"].indexOf(trackedComplaint.status) >= i ? "#8B5A2B" : "#e5e0d8" }} />
                      <p style={{ fontSize: 11, fontWeight: 600, color: ["Pending","In Progress","Resolved"].indexOf(trackedComplaint.status) >= i ? "#8B5A2B" : "#bbb" }}>{s}</p>
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

        {/* ── ADMIN ── */}
        {view === "admin" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
              <div>
                <h2 className="playfair" style={{ fontSize: 36, fontWeight: 800, color: "#2c1810", marginBottom: 6 }}>Admin Dashboard</h2>
                <p style={{ color: "#888", fontSize: 15 }}>Manage and resolve all complaints from one place.</p>
              </div>
              <div style={{ display: "flex", gap: 8, background: "white", padding: 6, borderRadius: 10, border: "1px solid #ede8e0" }}>
                {["All", "Pending", "In Progress", "Resolved"].map(s => (
                  <button key={s} className={`tab ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>
                    {s} {s !== "All" && `(${s === "Pending" ? stats.pending : s === "In Progress" ? stats.inProgress : stats.resolved})`}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
              {[{ label: "Total", value: stats.total, color: "#8B5A2B", bg: "#fdf6ef" }, { label: "Pending", value: stats.pending, color: "#d97706", bg: "#fffbeb" }, { label: "In Progress", value: stats.inProgress, color: "#3b82f6", bg: "#eff6ff" }, { label: "Resolved", value: stats.resolved, color: "#10b981", bg: "#ecfdf5" }].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "20px 24px", border: `1px solid ${s.color}33` }}>
                  <p style={{ color: s.color, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>{s.label.toUpperCase()}</p>
                  <p className="playfair" style={{ fontSize: 40, fontWeight: 800, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {filteredComplaints.map(c => (
              <div key={c.id} className="complaint-row">
                <div style={{ fontSize: 28, marginTop: 2 }}>{CATEGORY_ICONS[c.category] || "📋"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontWeight: 700, color: "#2c1810", marginRight: 10 }}>{c.name}</span>
                      <span style={{ background: "#f0ebe3", color: "#8B5A2B", fontSize: 12, padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>#{c.id}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {c.priority && <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: c.priority === "Urgent" ? "#FEE2E2" : c.priority === "High" ? "#FFEDD5" : c.priority === "Medium" ? "#FEF3C7" : "#D1FAE5", color: c.priority === "Urgent" ? "#991B1B" : c.priority === "High" ? "#C2410C" : c.priority === "Medium" ? "#92400E" : "#065F46" }}>{c.priority}</span>}
                      <span style={{ fontSize: 12, color: "#aaa" }}>{c.createdAt?.slice(0, 10)}</span>
                    </div>
                  </div>
                  <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{c.complaintText}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#999" }}>📧 {c.email}</span>
                    <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                      style={{ padding: "6px 12px", borderRadius: 6, border: "1.5px solid #ddd", fontSize: 13, background: "white", cursor: "pointer", fontFamily: "Source Sans 3,sans-serif" }}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {filteredComplaints.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <p>No complaints in this category</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
