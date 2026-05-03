import React, { useState } from 'react'
import { Card, CardTitle, Row, Label, NumberInput, Select, ActionButton, ResultPanel, Tip } from './UI'
import { CROP_RATIOS } from '../utils/imageUtils'

export function CropPanel({ imageState, run, processing, result }) {
  const [x, setX] = useState('0')
  const [y, setY] = useState('0')
  const [w, setW] = useState('')
  const [h, setH] = useState('')
  const [ratio, setRatio] = useState('free')

  const applyRatio = (val) => {
    setRatio(val)
    if (!imageState || val === 'free') return
    const found = CROP_RATIOS.find(r => r.label === val)
    if (!found || !found.value) return
    const [aw, ah] = found.value
    const r = aw / ah
    let nw = imageState.w
    let nh = Math.round(nw / r)
    if (nh > imageState.h) { nh = imageState.h; nw = Math.round(nh * r) }
    setW(String(nw))
    setH(String(nh))
    setX(String(Math.round((imageState.w - nw) / 2)))
    setY(String(Math.round((imageState.h - nh) / 2)))
  }

  const handleCrop = () => {
    run((state, canvas, push) => {
      const cx = parseInt(x) || 0
      const cy = parseInt(y) || 0
      let cw = parseInt(w) || state.w - cx
      let ch = parseInt(h) || state.h - cy
      cw = Math.min(cw, state.w - cx)
      ch = Math.min(ch, state.h - cy)
      if (cw <= 0 || ch <= 0) throw new Error('Invalid crop dimensions')
      const ctx = canvas.getContext('2d')
      canvas.width = cw; canvas.height = ch
      ctx.drawImage(state.img, cx, cy, cw, ch, 0, 0, cw, ch)
      const dataUrl = canvas.toDataURL('image/png')
      const baseName = state.file.name.replace(/\.[^.]+$/, '')
      push(dataUrl, `${baseName}_cropped.png`, state.size)
    })
  }

  return (
    <div>
      <Card>
        <CardTitle>Aspect Ratio Preset</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
          {CROP_RATIOS.map(({ label }) => (
            <button
              key={label}
              onClick={() => applyRatio(label)}
              style={{
                padding: '9px 6px',
                background: ratio === label ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${ratio === label ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 10,
                color: ratio === label ? '#a78bfa' : '#9ca3af',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Manual Crop (pixels)</CardTitle>
        <Row>
          <Label>X offset</Label>
          <NumberInput value={x} onChange={setX} placeholder="0" />
          <Label style={{ minWidth: 60 }}>Y offset</Label>
          <NumberInput value={y} onChange={setY} placeholder="0" />
        </Row>
        <Row>
          <Label>Width</Label>
          <NumberInput value={w} onChange={setW} placeholder="Full" />
          <Label style={{ minWidth: 60 }}>Height</Label>
          <NumberInput value={h} onChange={setH} placeholder="Full" />
        </Row>
        <Tip>💡 Leave width/height blank to auto-fill from the offset.</Tip>
      </Card>

      <ActionButton onClick={handleCrop} disabled={!imageState || processing}>
        ✂️ Crop Image
      </ActionButton>
      <ResultPanel result={result} />
    </div>
  )
}
