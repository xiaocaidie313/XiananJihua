function ossPathPrefix(envKey: string, fallback: string): string {
  const raw = import.meta.env[envKey] as string | undefined
  const base = (raw?.trim() || fallback).replace(/\/+$/, '') || fallback
  return `${base}/`
}

/**
 * 阿里云 OSS 配置
 * 生产环境建议使用 STS 临时凭证或后端代理上传，避免 AccessKey 暴露
 * 路径前缀可通过 .env.local 覆盖：VITE_OSS_VOICE_PREFIX、VITE_OSS_PIC_PREFIX 等
 */
export const OSS_CONFIG = {
  region: import.meta.env.VITE_OSS_REGION ?? 'oss-cn-beijing',
  accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID ?? '',
  accessKeySecret: import.meta.env.VITE_OSS_ACCESS_KEY_SECRET ?? '',
  bucket: import.meta.env.VITE_OSS_BUCKET ?? 'xiaoanv',
  /** 视频存储路径前缀 */
  videoPrefix: ossPathPrefix('VITE_OSS_VIDEO_PREFIX', 'vedios'),
  /** 播客音频（与视频同一 Bucket，默认 voic/） */
  voicePrefix: ossPathPrefix('VITE_OSS_VOICE_PREFIX', 'voic'),
  /** 封面等图片（默认 pics/） */
  picPrefix: ossPathPrefix('VITE_OSS_PIC_PREFIX', 'pics'),
  /** 头像（默认 pics/avatar/，基于图片目录） */
  avatarPrefix: `${ossPathPrefix('VITE_OSS_PIC_PREFIX', 'pics').replace(/\/$/, '')}/avatar/`,
  /** 公网访问域名 */
  publicUrl: 'https://xiaoanv.oss-cn-beijing.aliyuncs.com',
} as const

export function getOssFileUrl(path: string): string {
  return `${OSS_CONFIG.publicUrl}/${path}`
}
