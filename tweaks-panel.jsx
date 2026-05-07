// Tweaks Panel — React components for the Simplify.AI design tweaks overlay

(function () {
  const { useState, useCallback, useRef, useEffect } = React;

  // ── useTweaks hook ──
  // Returns [state, setTweak] where setTweak(key, value) updates a single key
  function useTweaks(defaults) {
    const [state, setState] = useState({ ...defaults });
    const setTweak = useCallback((key, value) => {
      setState(prev => ({ ...prev, [key]: value }));
    }, []);
    return [state, setTweak];
  }
  window.useTweaks = useTweaks;

  // ── Panel shell with slide-in toggle ──
  function TweaksPanel({ children }) {
    const [open, setOpen] = useState(false);

    return (
      <>
        {/* Toggle button — fixed bottom-left */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            position: 'fixed', bottom: 24, left: 24, zIndex: 9999,
            width: 44, height: 44, borderRadius: '50%',
            background: open ? '#a78bfa' : 'rgba(20,20,24,0.9)',
            border: '1px solid rgba(167,139,250,0.4)',
            backdropFilter: 'blur(12px)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: open ? '0 6px 24px rgba(167,139,250,0.4)' : '0 4px 16px rgba(0,0,0,0.6)',
            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          aria-label="Toggle tweaks panel"
          title="Tweaks"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={open ? '#fff' : '#a78bfa'} strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9" />
          </svg>
        </button>

        {/* Panel */}
        <div
          style={{
            position: 'fixed', bottom: 80, left: 24, zIndex: 9998,
            width: 280,
            background: 'rgba(10,10,14,0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            padding: '20px 20px 16px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
            pointerEvents: open ? 'auto' : 'none',
            transition: 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 18, paddingBottom: 12,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#a78bfa',
            }}>
              Tweaks
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)', padding: 0, lineHeight: 1,
                fontSize: 16,
              }}
            >×</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {children}
          </div>
        </div>
      </>
    );
  }
  window.TweaksPanel = TweaksPanel;

  // ── Section header ──
  function TweakSection({ label }) {
    return (
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 9, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
        paddingTop: 10, paddingBottom: 4,
        marginTop: 4,
      }}>
        {label}
      </div>
    );
  }
  window.TweakSection = TweakSection;

  // ── Slider ──
  function TweakSlider({ label, min, max, step, value, onChange }) {
    return (
      <div style={{ marginBottom: 6 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginBottom: 6,
        }}>
          <span style={{ fontSize: 12, color: '#f5f5f7', fontFamily: 'Inter, sans-serif' }}>{label}</span>
          <span style={{ fontSize: 11, color: '#a78bfa', fontFamily: '"JetBrains Mono", monospace' }}>{value}</span>
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            width: '100%', height: 3,
            appearance: 'none', WebkitAppearance: 'none',
            background: `linear-gradient(to right, #a78bfa ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.12) ${((value - min) / (max - min)) * 100}%)`,
            borderRadius: 2, cursor: 'pointer', outline: 'none', border: 'none',
          }}
        />
      </div>
    );
  }
  window.TweakSlider = TweakSlider;

  // ── Toggle ──
  function TweakToggle({ label, value, onChange }) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 4, marginTop: 2,
      }}>
        <span style={{ fontSize: 12, color: '#f5f5f7', fontFamily: 'Inter, sans-serif' }}>{label}</span>
        <button
          onClick={() => onChange(!value)}
          style={{
            width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
            background: value ? '#8b5cf6' : 'rgba(255,255,255,0.12)',
            position: 'relative', transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <span style={{
            position: 'absolute', top: 3, left: value ? 18 : 3,
            width: 14, height: 14, borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s',
          }} />
        </button>
      </div>
    );
  }
  window.TweakToggle = TweakToggle;
})();
