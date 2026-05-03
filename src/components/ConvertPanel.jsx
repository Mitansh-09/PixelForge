import React, { useState } from 'react'
import { Card, CardTitle, Slider, ActionButton, ChipButton, ResultPanel } from './UI'
import { drawToCanvas, mimeOf } from '../utils/imageUtils'

const FORMATS = [
  { fmt: 'png', label: 'PNG', sub: 'Lossless' },
  { fmt: 'jpeg', label: 'JPEG', sub: 'Photos' },
  { fmt: 'webp', label: 'WebP', sub: 'Modern' },
  { fmt: 'bmp', label: 'BMP', sub: 'Raw' },
  { fmt: 'gif', label: 'GIF', sub: 'Classic' },
]

export function ConvertPanel({ imageState, run, processing, result }) {
  const [fmt, setFmt] = useState('png')
  const [quality, setQuality] = useState(90)

  const handleConvert = () => {
    run((state, canvas, push) => {
      drawToCanvas(canvas, state.img, state.w, state.h)
      const mime = mimeOf(fmt)
      const q = (fmt === 'jpeg' || fmt === 'webp') ? quality / 100 : undefined
      const dataUrl = canvas.toDataURL(mime, q)
      const ext = fmt === 'jpeg' ? 'jpg' : fmt
      const baseName = state.file.name.replace(/\.[^.]+$/, '')
      push(dataUrl, `${baseName}.${ext}`, state.size)
    })
  }

  return (
    <div>
      <Card>
        <CardTitle>Output Format</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
          {FORMATS.map(({ fmt: f, label, sub }) => (
            <ChipButton key={f} selected={fmt === f} onClick={() => setFmt(f)}>
              {label}
              <div style={{ fontSize: 10, color: fmt === f ? '#7c6abf' : '#4b5563', marginTop: 2 }}>{sub}</div>
            </ChipButton>
          ))}
        </div>
      </Card>

      {(fmt === 'jpeg' || fmt === 'webp') && (
        <Card>
          <CardTitle>Quality</CardTitle>
          <Slider
            label="Quality"
            min={10} max={100} value={quality}
            onChange={setQuality}
            display={`${quality}%`}
          />
        </Card>
      )}

      <ActionButton onClick={handleConvert} disabled={!imageState || processing}>
        🔄 Convert to {fmt.toUpperCase()}
      </ActionButton>
      <ResultPanel result={result} />
    </div>
  )
}
