import React, { useState } from 'react'
import { Card, CardTitle, Row, Label, Slider, Select, ActionButton, ResultPanel, Tip } from './UI'

const POSITIONS = ['Bottom Right', 'Bottom Left', 'Top Right', 'Top Left', 'Center', 'Tile']

export function WatermarkPanel({ imageState, run, processing, result }) {
  const [text, setText] = useState('© My Brand')
  const [color, setColor] = useState('#ffffff')
  const [opacity, setOpacity] = useState(60)
  const [size, setSize] = useState(36)
  const [position, setPosition] = useState('Bottom Right')
  const [angle, setAngle] = useState(-30)

  const handleApply = () => {
    run((state, canvas, push) => {
      const ctx = canvas.getContext('2d')
      canvas.width = state.w
      canvas.height = state.h
      ctx.drawImage(state.img, 0, 0)

      ctx.save()
      ctx.globalAlpha = opacity / 100
      ctx.fillStyle = color
      ctx.font = `bold ${size}px sans-serif`
      ctx.textBaseline = 'middle'

      const pad = 24
      const tw = ctx.measureText(text).width
      const rad = angle * Math.PI / 180

      const posMap = {
        'Bottom Right': [state.w - tw - pad, state.h - size - pad],
        'Bottom Left': [pad, state.h - size - pad],
        'Top Right': [state.w - tw - pad, size + pad],
        'Top Left': [pad, size + pad],
        'Center': [(state.w - tw) / 2, state.h / 2],
      }

      if (position === 'Tile') {
        for (let row = size; row < state.h; row += size * 4) {
          for (let col = 0; col < state.w; col += tw + 60) {
            ctx.save()
            ctx.translate(col + tw / 2, row)
            ctx.rotate(rad)
            ctx.fillText(text, -tw / 2, 0)
            ctx.restore()
          }
        }
      } else {
        const [px, py] = posMap[position] || posMap['Bottom Right']
        ctx.translate(px + tw / 2, py + size / 2)
        ctx.rotate(rad)
        ctx.fillText(text, -tw / 2, 0)
      }

      ctx.restore()
      const dataUrl = canvas.toDataURL('image/png')
      const baseName = state.file.name.replace(/\.[^.]+$/, '')
      push(dataUrl, `${baseName}_watermarked.png`, state.size)
    })
  }

  return (
    <div>
      <Card>
        <CardTitle>Watermark Text</CardTitle>
        <Row>
          <Label>Text</Label>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Your watermark text"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: 'var(--text-primary)',
              padding: '7px 12px',
              fontSize: 13,
              fontFamily: 'var(--font-body)',
              outline: 'none',
            }}
          />
        </Row>
        <Row>
          <Label>Color</Label>
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            style={{ width: 44, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', padding: 2, background: 'transparent' }}
          />
        </Row>
      </Card>

      <Card>
        <CardTitle>Appearance</CardTitle>
        <Slider label="Opacity" min={10} max={100} value={opacity} onChange={setOpacity} display={`${opacity}%`} />
        <Slider label="Font Size" min={12} max={150} value={size} onChange={setSize} display={`${size}px`} />
        <Slider label="Angle" min={-90} max={90} value={angle} onChange={setAngle} display={`${angle}°`} />
      </Card>

      <Card>
        <CardTitle>Position</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
          {POSITIONS.map(p => (
            <button
              key={p}
              onClick={() => setPosition(p)}
              style={{
                padding: '9px 8px',
                background: position === p ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${position === p ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 10,
                color: position === p ? '#a78bfa' : '#9ca3af',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.15s',
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <Tip style={{ marginTop: 10 }}>💡 "Tile" repeats the watermark across the entire image.</Tip>
      </Card>

      <ActionButton onClick={handleApply} disabled={!imageState || processing}>
        🔏 Apply Watermark
      </ActionButton>
      <ResultPanel result={result} />
    </div>
  )
}
