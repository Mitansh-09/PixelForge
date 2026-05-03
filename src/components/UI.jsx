import React from 'react'
import { fmtBytes } from '../utils/imageUtils'

/* ── Card ─────────────────────────────────────────────── */
export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      marginBottom: '14px',
      ...style
    }}>
      {children}
    </div>
  )
}

/* ── CardTitle ────────────────────────────────────────── */
export function CardTitle({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-display)',
      fontSize: '11px',
      fontWeight: 700,
      color: 'var(--accent)',
      textTransform: 'uppercase',
      letterSpacing: '1.2px',
      marginBottom: '16px'
    }}>
      {children}
    </div>
  )
}

/* ── Row ──────────────────────────────────────────────── */
export function Row({ children, style }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '14px',
      flexWrap: 'wrap',
      ...style
    }}>
      {children}
    </div>
  )
}

/* ── Label ────────────────────────────────────────────── */
export function Label({ children, style }) {
  return (
    <label style={{
      fontSize: '13px',
      color: 'var(--text-secondary)',
      minWidth: '100px',
      ...style
    }}>
      {children}
    </label>
  )
}

/* ── Slider ───────────────────────────────────────────── */
export function Slider({ label, min, max, step = 1, value, onChange, display }) {
  return (
    <Row>
      <Label>{label}</Label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, minWidth: 120, accentColor: 'var(--accent)', cursor: 'pointer' }}
      />
      <div style={{
        background: 'rgba(139,92,246,0.15)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: 6,
        padding: '3px 10px',
        fontSize: 13,
        fontWeight: 600,
        color: '#a78bfa',
        minWidth: 60,
        textAlign: 'center'
      }}>
        {display !== undefined ? display : value}
      </div>
    </Row>
  )
}

/* ── NumberInput ──────────────────────────────────────── */
export function NumberInput({ value, onChange, placeholder, style }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border-mid)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-primary)',
        padding: '7px 10px',
        fontSize: 13,
        width: 100,
        outline: 'none',
        ...style
      }}
    />
  )
}

/* ── Select ───────────────────────────────────────────── */
export function Select({ value, onChange, children, style }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-mid)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-primary)',
        padding: '7px 10px',
        fontSize: 13,
        cursor: 'pointer',
        outline: 'none',
        ...style
      }}
    >
      {children}
    </select>
  )
}

/* ── ActionButton ─────────────────────────────────────── */
export function ActionButton({ children, onClick, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '14px',
        background: disabled
          ? 'rgba(139,92,246,0.2)'
          : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
  color: disabled ? 'var(--text-muted)' : '#fff',
        fontFamily: 'var(--font-display)',
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        letterSpacing: '0.5px',
        marginTop: 8,
        transition: 'all 0.2s',
        ...style
      }}
      onMouseEnter={e => { if (!disabled) e.target.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.target.style.transform = 'translateY(0)' }}
    >
      {disabled ? '⏳ Processing…' : children}
    </button>
  )
}

/* ── ChipButton ───────────────────────────────────────── */
export function ChipButton({ children, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '9px 6px',
        background: selected ? 'var(--accent-dim)' : 'var(--surface-1)',
        border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--chip-border)'}`,
        borderRadius: 10,
        color: selected ? 'var(--accent)' : 'var(--text-secondary)',
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

/* ── Tip ──────────────────────────────────────────────── */
export function Tip({ children, style }) {
  return (
    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic', ...style }}>
      {children}
    </p>
  )
}

/* ── ResultPanel ──────────────────────────────────────── */
export function ResultPanel({ result }) {
  if (!result) return null
  const { dataUrl, filename, origSize, newSize, w, h } = result
  const saved = origSize ? Math.round((1 - newSize / origSize) * 100) : null
  const ext = filename.split('.').pop().toUpperCase()

  return (
    <div style={{
      marginTop: 20,
      background: 'var(--green-dim)',
      border: '1px solid var(--green-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      animation: 'fadeUp 0.3s ease'
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 14 }}>
        ✅ Done!
      </div>
      <img
        src={dataUrl}
        alt="result"
        style={{ maxWidth: '100%', borderRadius: 8, maxHeight: 280, objectFit: 'contain', display: 'block', marginBottom: 14 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          ['Est. file size', fmtBytes(newSize)],
          ['Size change', saved !== null ? (saved > 0 ? `-${saved}%` : '~same') : '—'],
          ['Dimensions', `${w} × ${h}px`],
          ['Format', ext],
        ].map(([label, val], i) => (
          <div key={i} style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '10px 14px'
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 17,
              fontWeight: 700,
              color: label === 'Size change' && saved > 0 ? 'var(--green)' : 'var(--text-primary)'
            }}>{val}</div>
          </div>
        ))}
      </div>
      <a
        href={dataUrl}
        download={filename}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 20px',
          background: 'rgba(52,211,153,0.12)',
          border: '1px solid var(--green-border)',
          borderRadius: 10,
          color: 'var(--green)',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'background 0.2s',
        }}
      >
        ⬇ Download {filename}
      </a>
    </div>
  )
}

/* ── CheckboxRow ──────────────────────────────────────── */
export function CheckboxRow({ checked, onChange, children }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 12 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ accentColor: 'var(--accent)', width: 16, height: 16, cursor: 'pointer' }}
      />
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{children}</span>
    </label>
  )
}
