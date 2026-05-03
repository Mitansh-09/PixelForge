import React, { useState } from 'react'
import { Card, CardTitle, Row, Label, NumberInput, Select, Slider, ActionButton, ResultPanel, Tip } from './UI'
import { mimeOf } from '../utils/imageUtils'

export function CompressPanel({ imageState, run, processing, result }) {
  const [quality, setQuality] = useState(75)
  const [fmt, setFmt] = useState('webp')
  const [maxW, setMaxW] = useState('')
  const [maxH, setMaxH] = useState('')

  const handleCompress = () => {
    run((state, canvas, push) => {
      const mw = parseInt(maxW) || state.w
      const mh = parseInt(maxH) || state.h
      const scale = Math.min(mw / state.w, mh / state.h, 1)
      const w = Math.round(state.w * scale)
      const h = Math.round(state.h * scale)
      const ctx = canvas.getContext('2d')
      canvas.width = w; canvas.height = h
      ctx.drawImage(state.img, 0, 0, w, h)
      const mime = mimeOf(fmt)
      const dataUrl = canvas.toDataURL(mime, quality / 100)
      const ext = fmt === 'jpeg' ? 'jpg' : fmt
      const baseName = state.file.name.replace(/\.[^.]+$/, '')
      push(dataUrl, `${baseName}_compressed.${ext}`, state.size)
    })
  }

  return (
    <div>
      <Card>
        <CardTitle>Compression Settings</CardTitle>
        <Slider label="Quality" min={1} max={100} value={quality} onChange={setQuality} display={`${quality}%`} />
        <Row>
          <Label>Format</Label>
          <Select value={fmt} onChange={setFmt}>
            <option value="webp">WebP — modern & smallest</option>
            <option value="jpeg">JPEG — best compatibility</option>
            <option value="png">PNG — lossless</option>
          </Select>
        </Row>
        <Tip>💡 WebP produces ~30–50% smaller files than JPEG at the same quality.</Tip>
      </Card>

      <Card>
        <CardTitle>Max Dimensions (optional)</CardTitle>
        <Row>
          <Label>Max Width</Label>
          <NumberInput value={maxW} onChange={setMaxW} placeholder="None" />
          <Label style={{ minWidth: 70 }}>Max Height</Label>
          <NumberInput value={maxH} onChange={setMaxH} placeholder="None" />
        </Row>
        <Tip>💡 Image will scale down proportionally if it exceeds these limits.</Tip>
      </Card>

      <ActionButton onClick={handleCompress} disabled={!imageState || processing}>
        💾 Compress Image
      </ActionButton>
      <ResultPanel result={result} />
    </div>
  )
}
