import OSS from 'ali-oss'
import { OSS_CONFIG, getOssFileUrl } from '@/config/oss'
import { compressImage } from './imageCompress'

let client: OSS | null = null

function getClient(): OSS {
  if (!client) {
    if (!OSS_CONFIG.accessKeyId || !OSS_CONFIG.accessKeySecret) {
      throw new Error('OSS 未配置，请在 .env.local 中设置 VITE_OSS_ACCESS_KEY_ID 和 VITE_OSS_ACCESS_KEY_SECRET')
    }
    client = new OSS({
      region: OSS_CONFIG.region,
      accessKeyId: OSS_CONFIG.accessKeyId,
      accessKeySecret: OSS_CONFIG.accessKeySecret,
      bucket: OSS_CONFIG.bucket,
      secure: true,
    })
  }
  return client
}

/**
 * 生成唯一文件名
 */
function genFileName(originalName: string, prefix: string): string {
  const ext = originalName.includes('.') ? originalName.split('.').pop() ?? '' : ''
  const base = `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  return ext ? `${base}.${ext}` : base
}

export type UploadProgress = (percent: number) => void

/**
 * 上传视频到 OSS vedios/ 目录
 * @returns 公网可访问的完整 URL
 */
export async function uploadVideo(
  file: File,
  onProgress?: UploadProgress,
): Promise<string> {
  const client = getClient()
  const objectName = genFileName(file.name, OSS_CONFIG.videoPrefix)
  const fileSize = file.size
  if (fileSize > 20 * 1024 * 1024) {
    await client.multipartUpload(objectName, file, {
      progress: (p: number) => onProgress?.(Math.round(p * 100)),
    })
    // 使用纯净 URL，避免 multipartUpload 返回的 URL 带 uploadId 等查询参数
    return getOssFileUrl(objectName)
  }
  await client.put(objectName, file)
  onProgress?.(100)
  return getOssFileUrl(objectName)
}

/**
 * 上传图片到 OSS pics/ 目录
 * 上传前自动压缩以加快速度
 * @returns 公网可访问的完整 URL
 */
export async function uploadImage(
  file: File,
  onProgress?: UploadProgress,
): Promise<string> {
  const client = getClient()
  onProgress?.(0)
  const compressed = await compressImage(file)
  onProgress?.(30)
  const objectName = genFileName(file.name, OSS_CONFIG.picPrefix)
  await client.put(objectName, compressed)
  onProgress?.(100)
  return getOssFileUrl(objectName)
}

/**
 * 上传头像到 OSS pics/avatar/ 目录
 * 不压缩，保持原图质量
 * @returns 公网可访问的完整 URL
 */
export async function uploadAvatar(file: File): Promise<string> {
  const client = getClient()
  const objectName = genFileName(file.name, OSS_CONFIG.avatarPrefix)
  await client.put(objectName, file)
  return getOssFileUrl(objectName)
}
