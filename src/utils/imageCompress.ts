/**
 * 压缩图片，减小上传体积
 * 封面图最大宽度 1200px，质量 0.85
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file
  if (file.size < 200 * 1024) return file // 小于 200KB 不压缩

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const { width, height } = img
      const scale = width > maxWidth ? maxWidth / width : 1
      const w = Math.round(width * scale)
      const h = Math.round(height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          resolve(blob ?? file)
        },
        'image/jpeg',
        quality,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }
    img.src = url
  })
}
