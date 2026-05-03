import { useState, useRef, useCallback } from 'react'
import { loadImage, b64ToBytes, fmtBytes } from '../utils/imageUtils'

export function useImageProcessor() {
  const [imageState, setImageState] = useState(null) // { file, img, dataUrl, w, h, size }
  const [result, setResult] = useState(null)         // { dataUrl, filename, origSize, newSize, w, h }
  const [processing, setProcessing] = useState(false)
  const canvasRef = useRef(document.createElement('canvas'))

  const loadFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setResult(null)
    const { img, dataUrl } = await loadImage(file)
    setImageState({ file, img, dataUrl, w: img.width, h: img.height, size: file.size })
  }, [])

  const clearFile = useCallback(() => {
    setImageState(null)
    setResult(null)
  }, [])

  const getCanvas = () => canvasRef.current
  const getCtx = () => canvasRef.current.getContext('2d')

  const pushResult = (dataUrl, filename, origSize) => {
    const newSize = b64ToBytes(dataUrl.split(',')[1])
    const canvas = canvasRef.current
    setResult({ dataUrl, filename, origSize, newSize, w: canvas.width, h: canvas.height })
  }

  const run = useCallback(async (fn) => {
    if (!imageState) return
    setProcessing(true)
    try {
      await fn(imageState, canvasRef.current, pushResult)
    } finally {
      setProcessing(false)
    }
  }, [imageState])

  return { imageState, result, processing, loadFile, clearFile, run, getCanvas, getCtx }
}
