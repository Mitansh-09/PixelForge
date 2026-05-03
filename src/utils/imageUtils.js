export function fmtBytes(b) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(2)} MB`
}

export function mimeOf(fmt) {
  const map = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', bmp: 'image/bmp' }
  return map[fmt] || 'image/png'
}

export function b64ToBytes(b64str) {
  try { return Math.round((b64str.length * 3) / 4) } catch { return 0 }
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve({ img, dataUrl: e.target.result })
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function drawToCanvas(canvas, img, w, h, filter = 'none') {
  const ctx = canvas.getContext('2d')
  canvas.width = w
  canvas.height = h
  ctx.filter = filter
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)
  ctx.filter = 'none'
  return ctx
}

export function buildCSSFilter({ brightness, contrast, saturation, hue, blur }) {
  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px)`
}

export const FILTER_PRESETS = {
  original: { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0 },
  grayscale: { brightness: 100, contrast: 100, saturation: 0, hue: 0, blur: 0 },
  sepia: { brightness: 110, contrast: 100, saturation: 50, hue: 30, blur: 0 },
  vivid: { brightness: 105, contrast: 115, saturation: 180, hue: 0, blur: 0 },
  cool: { brightness: 100, contrast: 100, saturation: 120, hue: 200, blur: 0 },
  warm: { brightness: 108, contrast: 100, saturation: 130, hue: -20, blur: 0 },
  dramatic: { brightness: 85, contrast: 160, saturation: 130, hue: 0, blur: 0 },
  fade: { brightness: 115, contrast: 75, saturation: 70, hue: 0, blur: 0 },
  noir: { brightness: 90, contrast: 150, saturation: 0, hue: 0, blur: 0 },
  dreamy: { brightness: 120, contrast: 85, saturation: 90, hue: 15, blur: 1 },
}

export const SIZE_PRESETS = [
  { label: '4K', w: 3840, h: 2160 },
  { label: '1080p', w: 1920, h: 1080 },
  { label: '720p', w: 1280, h: 720 },
  { label: '800×600', w: 800, h: 600 },
  { label: '512 sq', w: 512, h: 512 },
  { label: '256 sq', w: 256, h: 256 },
  { label: '128 icon', w: 128, h: 128 },
  { label: 'Twitter', w: 1500, h: 500 },
  { label: 'Instagram', w: 1080, h: 1080 },
  { label: 'OG Image', w: 1200, h: 630 },
]

export const CROP_RATIOS = [
  { label: 'Free', value: null },
  { label: '1 : 1', value: [1, 1] },
  { label: '4 : 3', value: [4, 3] },
  { label: '16 : 9', value: [16, 9] },
  { label: '3 : 2', value: [3, 2] },
  { label: '9 : 16', value: [9, 16] },
  { label: '2 : 1', value: [2, 1] },
  { label: '21 : 9', value: [21, 9] },
]
