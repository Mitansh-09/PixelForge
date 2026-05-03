import React, { useState, useRef, useEffect } from 'react'
import { DropZone } from './components/DropZone'
import { ConvertPanel } from './components/ConvertPanel'
import { ResizePanel } from './components/ResizePanel'
import { CompressPanel } from './components/CompressPanel'
import { CropPanel } from './components/CropPanel'
import { FilterPanel } from './components/FilterPanel'
import { WatermarkPanel } from './components/WatermarkPanel'
import { FlipRotatePanel } from './components/FlipRotatePanel'
import { loadImage } from './utils/imageUtils'

const TABS = [
  { id: 'convert',   icon: '🔄', label: 'Convert'   },
  { id: 'resize',    icon: '📐', label: 'Resize'     },
  { id: 'compress',  icon: '💾', label: 'Compress'   },
  { id: 'crop',      icon: '✂️',  label: 'Crop'       },
  { id: 'filter',    icon: '🎨', label: 'Filters'    },
  { id: 'watermark', icon: '🔏', label: 'Watermark'  },
  { id: 'rotate',    icon: '↺',  label: 'Rotate'     },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('convert')
  const [imageState, setImageState] = useState(null)
  const [results, setResults] = useState({})
  const [processing, setProcessing] = useState(false)
  const canvasRef = useRef(document.createElement('canvas'))
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const loadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setResults({})
    const { img, dataUrl } = await loadImage(file)
    setImageState({ file, img, dataUrl, w: img.width, h: img.height, size: file.size })
  }

  const clearFile = () => {
    setImageState(null)
    setResults({})
  }

  const run = async (fn) => {
    if (!imageState) return
    setProcessing(true)
    try {
      const canvas = canvasRef.current
      fn(imageState, canvas, (dataUrl, filename, origSize) => {
        const newSize = Math.round((dataUrl.split(',')[1].length * 3) / 4)
        setResults(prev => ({
          ...prev,
          [activeTab]: { dataUrl, filename, origSize, newSize, w: canvas.width, h: canvas.height }
        }))
        setTimeout(() => {
          document.getElementById('result-scroll-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }, 100)
      })
    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      setProcessing(false)
    }
  }

  const panelProps = { imageState, run, processing, result: results[activeTab] }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(120,80,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(120,80,255,0.035) 1px,transparent 1px)',
        backgroundSize: '44px 44px'
      }} />
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(120,60,255,0.1) 0%,transparent 70%)', top: -150, left: -150, zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(52,211,153,0.07) 0%,transparent 70%)', bottom: -100, right: -100, zIndex: 0, pointerEvents: 'none' }} />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '36px 20px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 999,
              padding: '6px 12px',
              color: 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        <header style={{ textAlign: 'center', marginBottom: 44 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            background: 'linear-gradient(135deg, #a78bfa 0%, #34d399 50%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
            lineHeight: 1.1,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <img src="/favicon.svg" alt="PixelForge logo" style={{ width: 30, height: 30 }} />
              <span>PixelForge</span>
            </span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', letterSpacing: '0.4px' }}>
            Convert · Resize · Compress · Crop · Filter · Watermark — all in your browser
          </p>
          <p style={{ fontSize: 11, color: 'var(--muted-strong)', marginTop: 6 }}>
            🔒 100% client-side — your images never leave your device
          </p>
        </header>

        {/* Drop Zone */}
        <DropZone onFile={loadFile} imageState={imageState} onClear={clearFile} />

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 5,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 5,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          {TABS.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                minWidth: 80,
                padding: '10px 6px',
                border: activeTab === id ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
                background: activeTab === id ? 'rgba(139,92,246,0.13)' : 'transparent',
                color: activeTab === id ? '#a78bfa' : 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.18s',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (activeTab !== id) { e.currentTarget.style.color = '#c4b5fd'; e.currentTarget.style.background = 'rgba(139,92,246,0.06)' } }}
              onMouseLeave={e => { if (activeTab !== id) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' } }}
            >
              <span style={{ display: 'block', fontSize: 18, marginBottom: 3 }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div style={{ animation: 'fadeUp 0.25s ease' }} key={activeTab}>
          {activeTab === 'convert'   && <ConvertPanel   {...panelProps} />}
          {activeTab === 'resize'    && <ResizePanel    {...panelProps} />}
          {activeTab === 'compress'  && <CompressPanel  {...panelProps} />}
          {activeTab === 'crop'      && <CropPanel      {...panelProps} />}
          {activeTab === 'filter'    && <FilterPanel    {...panelProps} />}
          {activeTab === 'watermark' && <WatermarkPanel {...panelProps} />}
          {activeTab === 'rotate'    && <FlipRotatePanel {...panelProps} />}
        </div>

        <div id="result-scroll-anchor" />

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: 60, color: 'var(--muted-strong)', fontSize: 12 }}>
          Built with ❤️ · PixelForge · All processing is done locally in your browser
        </footer>
      </div>
    </div>
  )
}
