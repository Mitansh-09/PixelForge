import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { fmtBytes } from '../utils/imageUtils'

export function DropZone({ onFile, imageState, onClear }) {
  const onDrop = useCallback(files => {
    if (files[0]) onFile(files[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  if (imageState) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        marginBottom: 24,
        flexWrap: 'wrap',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 16,
        animation: 'fadeUp 0.3s ease',
      }}>
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 10,
          flexShrink: 0
        }}>
          <img
            src={imageState.dataUrl}
            alt="preview"
            style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8, objectFit: 'contain', display: 'block' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 10,
            color: 'var(--text-primary)',
            wordBreak: 'break-all'
          }}>
            {imageState.file.name}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {[
              ['📏', `${imageState.w} × ${imageState.h}px`],
              ['💾', fmtBytes(imageState.size)],
              ['🖼️', imageState.file.type.split('/')[1]?.toUpperCase()],
            ].map(([icon, text]) => (
              <span key={text} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 12,
                color: 'var(--text-secondary)',
              }}>
                {icon} <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{text}</strong>
              </span>
            ))}
          </div>
          <button
            onClick={onClear}
            style={{
              background: 'var(--red-dim)',
              border: '1px solid var(--red-border)',
              borderRadius: 8,
              color: 'var(--red)',
              padding: '6px 14px',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            ✕ Remove image
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.3)'}`,
        borderRadius: 'var(--radius-xl)',
        background: isDragActive ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.02)',
        padding: '52px 32px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        marginBottom: 24,
        position: 'relative',
      }}
    >
      <input {...getInputProps()} />
      <div style={{ fontSize: 52, marginBottom: 14 }}>📁</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 8
      }}>
        {isDragActive ? 'Drop it!' : 'Drop your image here'}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        or click to browse · PNG, JPG, JPEG, WebP, GIF, BMP supported
      </div>
    </div>
  )
}
