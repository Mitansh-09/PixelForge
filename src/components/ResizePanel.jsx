import React, { useState, useEffect } from 'react'
import { Card, CardTitle, Row, Label, NumberInput, Select, ActionButton, ChipButton, CheckboxRow, ResultPanel, Tip } from './UI'
import { SIZE_PRESETS } from '../utils/imageUtils'

export function ResizePanel({ imageState, run, processing, result }) {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [lockAspect, setLockAspect] = useState(true)
  const [method, setMethod] = useState('contain')

  useEffect(() => {
    if (imageState) {
      setWidth(String(imageState.w))
      setHeight(String(imageState.h))
    }
  }, [imageState])

  const ratio = imageState ? imageState.w / imageState.h : 1

  const onWidthChange = (v) => {
    setWidth(v)
    if (lockAspect && v) setHeight(String(Math.round(Number(v) / ratio)))
  }
  const onHeightChange = (v) => {
    setHeight(v)
    if (lockAspect && v) setWidth(String(Math.round(Number(v) * ratio)))
  }
  const applyPreset = (w, h) => {
    setWidth(String(w))
    setHeight(String(h))
  }

  const handleResize = () => {
    run((state, canvas, push) => {
      const ctx = canvas.getContext('2d')
      const w = parseInt(width) || state.w
      const h = parseInt(height) || state.h

      if (method === 'contain') {
        const scale = Math.min(w / state.w, h / state.h)
        canvas.width = Math.round(state.w * scale)
        canvas.height = Math.round(state.h * scale)
        ctx.drawImage(state.img, 0, 0, canvas.width, canvas.height)
      } else if (method === 'cover') {
        canvas.width = w; canvas.height = h
        const scale = Math.max(w / state.w, h / state.h)
        const sw = state.w * scale, sh = state.h * scale
        ctx.drawImage(state.img, -(sw - w) / 2, -(sh - h) / 2, sw, sh)
      } else {
        canvas.width = w; canvas.height = h
        ctx.drawImage(state.img, 0, 0, w, h)
      }

      const dataUrl = canvas.toDataURL('image/png')
      const baseName = state.file.name.replace(/\.[^.]+$/, '')
      push(dataUrl, `${baseName}_resized.png`, state.size)
    })
  }

  return (
    <div>
      <Card>
        <CardTitle>Custom Dimensions</CardTitle>
        <Row>
          <Label>Width (px)</Label>
          <NumberInput value={width} onChange={onWidthChange} placeholder="e.g. 1920" />
          <Label style={{ minWidth: 60 }}>Height (px)</Label>
          <NumberInput value={height} onChange={onHeightChange} placeholder="e.g. 1080" />
        </Row>
        <CheckboxRow checked={lockAspect} onChange={setLockAspect}>
          Lock aspect ratio
        </CheckboxRow>
      </Card>

      <Card>
        <CardTitle>Presets</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
          {SIZE_PRESETS.map(({ label, w, h }) => (
            <ChipButton key={label} selected={false} onClick={() => applyPreset(w, h)}>
              {label}
              <div style={{ fontSize: 10, color: '#4b5563', marginTop: 2 }}>{w}×{h}</div>
            </ChipButton>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Resize Method</CardTitle>
        <Row>
          <Label>Method</Label>
          <Select value={method} onChange={setMethod}>
            <option value="stretch">Stretch</option>
            <option value="contain">Contain (fit inside)</option>
            <option value="cover">Cover (crop to fill)</option>
          </Select>
        </Row>
        <Tip>
          💡 Contain preserves full image. Cover fills the target size, cropping edges.
        </Tip>
      </Card>

      <ActionButton onClick={handleResize} disabled={!imageState || processing}>
        📐 Resize Image
      </ActionButton>
      <ResultPanel result={result} />
    </div>
  )
}
