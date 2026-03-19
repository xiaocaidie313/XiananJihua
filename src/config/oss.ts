/**
 * 阿里云 OSS 配置
 * 生产环境建议使用 STS 临时凭证或后端代理上传，避免 AccessKey 暴露
 */
export const OSS_CONFIG = {
  region: import.meta.env.VITE_OSS_REGION ?? 'oss-cn-beijing',
  accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID ?? '',
  accessKeySecret: import.meta.env.VITE_OSS_ACCESS_KEY_SECRET ?? '',
  bucket: import.meta.env.VITE_OSS_BUCKET ?? 'xiaoanv',
  /** 视频存储路径前缀 */
  videoPrefix: 'vedios/',
  /** 图片存储路径前缀 */
  picPrefix: 'pics/',
  /** 头像存储路径前缀 */
  avatarPrefix: 'pics/avatar/',
  /** 公网访问域名 */
  publicUrl: 'https://xiaoanv.oss-cn-beijing.aliyuncs.com',
} as const

export function getOssFileUrl(path: string): string {
  return `${OSS_CONFIG.publicUrl}/${path}`
}
