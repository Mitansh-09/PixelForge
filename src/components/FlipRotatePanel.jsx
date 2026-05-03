import React, { useState } from 'react'
import { Card, CardTitle, ActionButton, ChipButton, ResultPanel, Tip } from './UI'

export function FlipRotatePanel({ imageState, run, processing, result }) {
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

  const handleApply = () => {
    run((state, canvas, push) => {
      const ctx = canvas.getContext('2d')
      const rad = (rotation * Math.PI) / 180
      const cos = Math.abs(Math.cos(rad))
      const sin = Math.abs(Math.sin(rad))
      canvas.width = Math.round(state.w * cos + state.h * sin)
      canvas.height = Math.round(state.w * sin + state.h * cos)

      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(rad)
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
      ctx.drawImage(state.img, -state.w / 2, -state.h / 2)

      const dataUrl = canvas.toDataURL('image/png')
      const baseName = state.file.name.replace(/\.[^.]+$/, '')
      push(dataUrl, `${baseName}_rotated.png`, state.size)
    })
  }

  const rotations = [0, 90, 180, 270]

  return (
    <div>
      <Card>
        <CardTitle>Rotation</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 }}>
          {rotations.map(r => (
            <ChipButton key={r} selected={rotation === r} onClick={() => setRotation(r)}>
              {r === 0 ? '↺ 0°' : r === 90 ? '↻ 90°' : r === 180 ? '↻ 180°' : '↺ 270°'}
            </ChipButton>
          ))}
        </div>
        <Tip>💡 Canvas auto-resizes for 90° / 270° rotations.</Tip>
      </Card>

      <Card>
        <CardTitle>Flip</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <ChipButton selected={flipH} onClick={() => setFlipH(f => !f)}>
            ↔ Flip Horizontal
          </ChipButton>
          <ChipButton selected={flipV} onClick={() => setFlipV(f => !f)}>
            ↕ Flip Vertical
          </ChipButton>
        </div>
      </Card>

      <ActionButton onClick={handleApply} disabled={!imageState || processing}>
        🔄 Apply Rotation & Flip
      </ActionButton>
      <ResultPanel result={result} />
    </div>
  )
}
