import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function FreshnessBar() {
  const [score, setScore] = useState(100);
  const [running, setRunning] = useState(false);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setHours((h) => {
        const next = h + 1;
        if (next <= 12) setScore(100);
        else if (next <= 36) setScore(Math.max(0, Math.round(100 - (next - 12) * 3)));
        else setScore(Math.max(0, Math.round(28 - (next - 36) * 6)));
        if (next >= 48) { clearInterval(interval); setRunning(false); }
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [running]);

  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
  const label = score >= 75 ? "Good quality" : score >= 50 ? "Quality dropping" : "Critical — value lost";

  return (
    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.5rem", maxWidth: "420px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "Inter, sans-serif" }}>FFB freshness after harvest</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontFamily: "Inter, sans-serif" }}>{hours}h elapsed</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "48px", fontFamily: "Poppins, sans-serif", fontWeight: 700, color, lineHeight: 1, transition: "color 0.5s" }}>{score}</span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontFamily: "Inter, sans-serif", marginBottom: "8px" }}>/ 100</span>
      </div>
      <div style={{ width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: "9999px", height: "8px", marginBottom: "0.75rem" }}>
        <div style={{ width: `${score}%`, height: "8px", borderRadius: "9999px", background: color, transition: "width 0.3s, background 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color }}>{label}</span>
        <button
          onClick={() => { setScore(100); setHours(0); setRunning(true); }}
          style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#40916C", background: "rgba(64,145,108,0.15)", border: "1px solid rgba(64,145,108,0.3)", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}
        >
          {running ? "Running..." : "▶ Simulate"}
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {[["0h", "Harvested"], ["12h", "Safe window"], ["36h", "Rapid decay"], ["48h", "Lost value"]].map(([time, label]) => (
          <div key={time} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "Poppins, sans-serif" }}>{time}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PalmSVG() {
  return (
    <svg viewBox="0 0 200 320" style={{ width: "100%", maxWidth: "280px" }} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="91" y="180" width="18" height="130" rx="9" fill="#7C5C3E" opacity="0.6" />
      <ellipse cx="100" cy="130" rx="9" ry="85" fill="#2D6A4F" transform="rotate(-45 100 180)" opacity="0.9"/>
      <ellipse cx="100" cy="130" rx="9" ry="85" fill="#40916C" transform="rotate(-25 100 180)" opacity="0.9"/>
      <ellipse cx="100" cy="130" rx="9" ry="80" fill="#52B788" transform="rotate(-5 100 180)" opacity="0.9"/>
      <ellipse cx="100" cy="130" rx="9" ry="80" fill="#40916C" transform="rotate(15 100 180)" opacity="0.9"/>
      <ellipse cx="100" cy="130" rx="9" ry="75" fill="#2D6A4F" transform="rotate(35 100 180)" opacity="0.9"/>
      <ellipse cx="100" cy="130" rx="8" ry="70" fill="#52B788" transform="rotate(55 100 180)" opacity="0.85"/>
      <ellipse cx="100" cy="130" rx="8" ry="70" fill="#40916C" transform="rotate(-65 100 180)" opacity="0.85"/>
      <circle cx="80" cy="168" r="11" fill="#D4A017" opacity="0.95"/>
      <circle cx="100" cy="174" r="9" fill="#C8960C" opacity="0.95"/>
      <circle cx="120" cy="168" r="11" fill="#D4A017" opacity="0.95"/>
      <circle cx="90" cy="176" r="7" fill="#B8860B" opacity="0.9"/>
      <circle cx="110" cy="176" r="7" fill="#B8860B" opacity="0.9"/>
    </svg>
  );
}

const FEATURES = [
  { icon: "⚡", title: "Smart Mill Booking", desc: "Urgency-based greedy algorithm assigns your FFB to the nearest available mill slot before quality degrades.", color: "#fef3c7", border: "#fcd34d", text: "#92400e" },
  { icon: "📊", title: "Live Freshness Scoring", desc: "Real-time FFA decay model tracks your batch quality every 30 seconds and alerts you before the spoilage threshold.", color: "#fce7f3", border: "#f9a8d4", text: "#9d174d" },
  { icon: "🌱", title: "Ripeness Prediction", desc: "Harvest window forecasting based on palm age, last harvest date, and seasonal cycles — no guessing needed.", color: "#d1fae5", border: "#6ee7b7", text: "#065f46" },
  { icon: "🌤", title: "Weather Advisory", desc: "Live OpenWeather data drives fertilizer and irrigation recommendations tailored to each plot's soil type and age.", color: "#dbeafe", border: "#93c5fd", text: "#1e3a8a" },
  { icon: "💰", title: "Price Transparency", desc: "See exactly how today's mill price compares to the NMEO-OP government minimum, so you never get underpaid.", color: "#ede9fe", border: "#c4b5fd", text: "#4c1d95" },
  { icon: "📋", title: "Subsidy Tracker", desc: "Track your NMEO-OP claims from application through verification to DBT disbursement — all in one place.", color: "#fee2e2", border: "#fca5a5", text: "#7f1d1d" },
];

const STEPS = [
  { number: "01", title: "Register your farm", desc: "Sign up with your phone number, add your plots with GPS coordinates, planting year, and soil type." },
  { number: "02", title: "Mark harvest & get matched", desc: "When your FFB is ready, mark it harvested. Our engine instantly scores freshness and finds the best mill slot." },
  { number: "03", title: "Deliver, earn, redeem", desc: "Deliver to the assigned slot on time, earn incentive points for good practices, and track your subsidy disbursements." },
];

export default function Landing() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [statsRef, statsInView] = useInView();
  const farmers = useCountUp(12400, 2000, statsInView);
  const mills = useCountUp(340, 2000, statsInView);
  const tonnes = useCountUp(98000, 2000, statsInView);

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatSlow { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.45s ease both; }
        .float-anim { animation: float 4s ease-in-out infinite; }
        .float-slow { animation: floatSlow 6s ease-in-out infinite; }
        .feature-card { transition: transform 0.2s, box-shadow 0.2s; cursor: default; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .nav-link { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .cta-primary { background: #40916C; color: white; border: none; border-radius: 10px; padding: 14px 28px; font-size: 15px; font-weight: 600; font-family: Poppins,sans-serif; cursor: pointer; transition: background 0.2s, transform 0.15s; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .cta-primary:hover { background: #2D6A4F; transform: translateY(-1px); }
        .cta-secondary { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.25); border-radius: 10px; padding: 14px 28px; font-size: 15px; font-weight: 500; font-family: Inter,sans-serif; cursor: pointer; transition: background 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .cta-secondary:hover { background: rgba(255,255,255,0.18); }
        .leaf-bg { position: absolute; border-radius: 50% 0 50% 0; opacity: 0.06; background: #52B788; pointer-events: none; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(27,67,50,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🌴</span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "18px", color: "white" }}>PalmSathi</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
          <a href="#problem" className="nav-link">The problem</a>
          <Link to="/login" style={{ background: "#40916C", color: "white", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, fontFamily: "Poppins,sans-serif", textDecoration: "none" }}>Log in</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0D2818 0%, #1B4332 40%, #2D6A4F 100%)", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "60px" }}>
        {/* Decorative blobs */}
        <div className="leaf-bg" style={{ width: "500px", height: "500px", top: "-100px", right: "-80px", transform: "rotate(20deg)" }} />
        <div className="leaf-bg" style={{ width: "300px", height: "300px", bottom: "50px", left: "-60px", transform: "rotate(-30deg)", opacity: 0.04 }} />
        <div style={{ position: "absolute", top: "20%", right: "8%", width: "2px", height: "120px", background: "linear-gradient(to bottom, transparent, rgba(64,145,108,0.4), transparent)", borderRadius: "1px" }} />
        <div style={{ position: "absolute", top: "60%", right: "18%", width: "2px", height: "80px", background: "linear-gradient(to bottom, transparent, rgba(64,145,108,0.3), transparent)", borderRadius: "1px" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", width: "100%" }}>
          {/* Left */}
          <div>
            <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(64,145,108,0.2)", border: "1px solid rgba(64,145,108,0.4)", borderRadius: "9999px", padding: "6px 14px", marginBottom: "1.5rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#52B788", fontSize: "12px", fontFamily: "Inter,sans-serif", fontWeight: 500 }}>NMEO-OP integrated · Live in Andhra Pradesh</span>
            </div>

            <h1 className="fade-up-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", color: "white", lineHeight: 1.15, margin: "0 0 1.25rem" }}>
              Every hour after harvest,<br />
              <span style={{ color: "#52B788" }}>your oil palm loses value.</span>
            </h1>

            <p className="fade-up-3" style={{ color: "rgba(255,255,255,0.65)", fontSize: "17px", lineHeight: 1.7, margin: "0 0 2rem", maxWidth: "480px" }}>
              PalmSathi predicts your harvest window, books the right mill slot before FFB spoils, and makes every government subsidy trackable — in real time.
            </p>

            <div className="fade-up-4" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/register" className="cta-primary">
                Start for free →
              </Link>
              <Link to="/login" className="cta-secondary">
                Log in
              </Link>
            </div>

            <div className="fade-up-4" style={{ display: "flex", gap: "2rem", marginTop: "2.5rem" }}>
              {[["₹17.8/kg", "Govt minimum price"], ["24-48h", "FFB spoilage window"], ["3 schemes", "NMEO-OP subsidies"]].map(([val, label]) => (
                <div key={val}>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "18px", color: "#52B788" }}>{val}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", fontFamily: "Inter,sans-serif", marginTop: "2px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <div className="float-anim" style={{ width: "200px" }}>
              <PalmSVG />
            </div>
            <FreshnessBar />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.3)" }}>
          <span style={{ fontSize: "11px", fontFamily: "Inter,sans-serif" }}>scroll to explore</span>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" style={{ background: "#0D2818", padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#40916C", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", fontFamily: "Inter,sans-serif", marginBottom: "1rem", textTransform: "uppercase" }}>The core problem</p>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,44px)", color: "white", lineHeight: 1.25, margin: "0 0 1.5rem" }}>
            Oil palm farmers lose crores every year — not from bad farming, but from bad timing.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "16px", lineHeight: 1.8, maxWidth: "680px", margin: "0 auto 3rem", fontFamily: "Inter,sans-serif" }}>
            Once a Fresh Fruit Bunch is cut, free fatty acid buildup begins immediately. After 36 hours, quality drops sharply. Without real-time coordination between farms and mills, this value is silently lost — every harvest cycle.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {[
              { icon: "🕐", title: "0–12 hours", desc: "Peak freshness. Oil extraction is highest. This is the golden window.", color: "#22c55e" },
              { icon: "⚠️", title: "12–36 hours", desc: "FFA accumulates. Quality grades drop. Mill penalties begin.", color: "#eab308" },
              { icon: "🔴", title: "36+ hours", desc: "Rapid decay. Significant value reduction. Often rejected by mills.", color: "#ef4444" },
            ].map((item) => (
              <div key={item.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.75rem", textAlign: "left" }}>
                <span style={{ fontSize: "28px", display: "block", marginBottom: "0.75rem" }}>{item.icon}</span>
                <p style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, fontSize: "15px", color: item.color, margin: "0 0 0.5rem" }}>{item.title}</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0, fontFamily: "Inter,sans-serif" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: "#F8F4F0", padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ color: "#40916C", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", fontFamily: "Inter,sans-serif", marginBottom: "0.75rem", textTransform: "uppercase" }}>What we built</p>
            <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "clamp(26px,3.5vw,40px)", color: "#1B4332", margin: "0 0 1rem" }}>
              Every tool an oil palm farmer needs
            </h2>
            <p style={{ color: "#6b7280", fontSize: "15px", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7, fontFamily: "Inter,sans-serif" }}>
              Built around the unique constraints of oil palm — the 24-48 hour spoilage window, NMEO-OP scheme rules, and the gap between farm and mill.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card" style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", padding: "1.75rem" }}>
                <div style={{ width: "44px", height: "44px", background: f.color, border: `1px solid ${f.border}`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "1rem" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, fontSize: "15px", color: "#1B4332", margin: "0 0 0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.7, margin: 0, fontFamily: "Inter,sans-serif" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: "#1B4332", padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ color: "#52B788", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", fontFamily: "Inter,sans-serif", marginBottom: "0.75rem", textTransform: "uppercase" }}>How it works</p>
            <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "clamp(26px,3.5vw,40px)", color: "white", margin: 0 }}>
              From registration to disbursement in 3 steps
            </h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "28px", top: "32px", bottom: "32px", width: "2px", background: "linear-gradient(to bottom, #40916C, rgba(64,145,108,0.1))" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {STEPS.map((step, i) => (
                <div key={step.number} style={{ display: "flex", gap: "1.75rem", alignItems: "flex-start" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: i === 0 ? "#40916C" : "rgba(64,145,108,0.15)", border: "2px solid #40916C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                    <span style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "14px", color: "white" }}>{step.number}</span>
                  </div>
                  <div style={{ paddingTop: "10px" }}>
                    <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, fontSize: "18px", color: "white", margin: "0 0 0.5rem" }}>{step.title}</h3>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, fontFamily: "Inter,sans-serif" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ background: "#0D2818", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", textAlign: "center" }}>
          {[
            { value: farmers.toLocaleString() + "+", label: "Farmers on platform", sub: "across Andhra Pradesh and Telangana" },
            { value: mills + "+", label: "Mills connected", sub: "with real-time slot availability" },
            { value: (tonnes / 1000).toFixed(0) + "K+", label: "Tonnes FFB tracked", sub: "with full freshness audit trail" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "clamp(32px,5vw,52px)", color: "#52B788", lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, fontSize: "15px", color: "white", margin: "0.5rem 0 0.25rem" }}>{stat.label}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "Inter,sans-serif" }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)", padding: "6rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="leaf-bg" style={{ width: "400px", height: "400px", top: "-100px", right: "-80px", transform: "rotate(15deg)" }} />
        <div className="leaf-bg float-slow" style={{ width: "250px", height: "250px", bottom: "-50px", left: "-40px", transform: "rotate(-20deg)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: "48px", display: "block", marginBottom: "1.25rem" }}>🌴</span>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,44px)", color: "white", margin: "0 0 1rem", lineHeight: 1.25 }}>
            Stop losing value after harvest.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "16px", maxWidth: "480px", margin: "0 auto 2.5rem", lineHeight: 1.7, fontFamily: "Inter,sans-serif" }}>
            Join thousands of oil palm farmers who book mill slots in real time and track every rupee of subsidy they're owed.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="cta-primary" style={{ fontSize: "16px", padding: "16px 36px" }}>
              Create free account →
            </Link>
            <Link to="/admin" className="cta-secondary" style={{ fontSize: "14px", padding: "16px 28px", opacity: 0.7 }}>
              Government officer access
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0D2818", padding: "2.5rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>🌴</span>
            <span style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "16px", color: "white" }}>PalmSathi</span>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", marginLeft: "8px", fontFamily: "Inter,sans-serif" }}>Digital Decision-Support Platform for Oil Palm Farmers</span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link to="/login" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", fontFamily: "Inter,sans-serif" }}>Farmer login</Link>
            <Link to="/register" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", fontFamily: "Inter,sans-serif" }}>Register</Link>
            <Link to="/admin" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", fontFamily: "Inter,sans-serif" }}>Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}