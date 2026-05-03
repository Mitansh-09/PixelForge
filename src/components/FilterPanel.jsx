import React, { useState, useEffect, useRef } from 'react'
import { Card, CardTitle, Slider, ActionButton, ChipButton, ResultPanel } from './UI'
import { buildCSSFilter, FILTER_PRESETS, drawToCanvas } from '../utils/imageUtils'

const DEFAULT = FILTER_PRESETS.original

export function FilterPanel({ imageState, run, processing, result }) {
  const [vals, setVals] = useState({ ...DEFAULT })
  const [preview, setPreview] = useState(null)
  const previewCanvas = useRef(document.createElement('canvas'))

  useEffect(() => {
    if (!imageState) return
    const canvas = previewCanvas.current
    const filter = buildCSSFilter(vals)
    drawToCanvas(canvas, imageState.img, imageState.w, imageState.h, filter)
    setPreview(canvas.toDataURL('image/jpeg', 0.6))
  }, [vals, imageState])

  const set = (key, val) => setVals(v => ({ ...v, [key]: val }))

  const applyPreset = (name) => setVals({ ...FILTER_PRESETS[name] })

  const handleApply = () => {
    run((state, canvas, push) => {
      const filter = buildCSSFilter(vals)
      drawToCanvas(canvas, state.img, state.w, state.h, filter)
      const dataUrl = canvas.toDataURL('image/png')
      const baseName = state.file.name.replace(/\.[^.]+$/, '')
      push(dataUrl, `${baseName}_filtered.png`, state.size)
    })
  }

  return (
    <div>
      <Card>
        <CardTitle>Presets</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
          {Object.keys(FILTER_PRESETS).map(name => (
            <ChipButton key={name} selected={false} onClick={() => applyPreset(name)}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </ChipButton>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Manual Adjustments</CardTitle>
        <Slider label="Brightness" min={0} max={200} value={vals.brightness} onChange={v => set('brightness', v)} display={vals.brightness} />
        <Slider label="Contrast" min={0} max={200} value={vals.contrast} onChange={v => set('contrast', v)} display={vals.contrast} />
        <Slider label="Saturation" min={0} max={200} value={vals.saturation} onChange={v => set('saturation', v)} display={vals.saturation} />
        <Slider label="Hue Rotate" min={0} max={360} value={vals.hue} onChange={v => set('hue', v)} display={`${vals.hue}°`} />
        <Slider label="Blur" min={0} max={20} value={vals.blur} onChange={v => set('blur', v)} display={`${vals.blur}px`} />
      </Card>

      {preview && imageState && (
        <Card>
          <CardTitle>Live Preview</CardTitle>
          <img
            src={preview}
            alt="filtered preview"
            style={{ maxWidth: '100%', borderRadius: 8, maxHeight: 280, objectFit: 'contain', display: 'block' }}
          />
        </Card>
      )}

      <ActionButton onClick={handleApply} disabled={!imageState || processing}>
        🎨 Apply Filters & Download
      </ActionButton>
      <ResultPanel result={result} />
    </div>
  )
}
