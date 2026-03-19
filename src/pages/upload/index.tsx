import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, message, Upload, Progress } from 'antd'
import {
  FileTextOutlined,
  PictureOutlined,
  PlaySquareOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { addArticle, addVideo } from '@/api/content'
import { uploadImage, uploadVideo } from '@/utils/oss'
import { getCurrentUserId, getStoredUser } from '@/utils/appState'
import { getErrorMessage } from '@/utils/appState'
import './index.css'

type UploadType = 'video' | 'article'

const VIDEO_ACCEPT = 'video/mp4'
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp'

function UploadPage() {
  const navigate = useNavigate()
  const user = getStoredUser()
  const [uploadType, setUploadType] = useState<UploadType>('video')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [videoUploadPercent, setVideoUploadPercent] = useState<number | null>(null)
  const [coverUploadPercent, setCoverUploadPercent] = useState<number | null>(null)
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('')
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string>('')

  const parseTags = (val: string | string[]) =>
    typeof val === 'string'
      ? val.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
      : val || []

  const handleVideoSubmit = async (values: Record<string, unknown>) => {
    const res = await addVideo({
      name: values.name as string,
      description: (values.description as string) || (values.name as string),
      author: (values.author as string) || user?.name || '用户',
      cover: values.cover as string,
      url: values.url as string,
      published_at: Math.floor(Date.now() / 1000),
      tags: parseTags(values.tags as string),
    }) as { code?: number; message?: string; data?: { video_id?: number } }
    const ok = res?.code === 0 || res?.code === 200
    if (!ok) {
      throw new Error(res?.message ?? '视频发布失败')
    }
    const data = (res?.data ?? res) as { video_id?: number }
    message.success('视频上传成功')
    if (data?.video_id) {
      navigate(`/vedios/${data.video_id}`, { state: { fromUpload: true } })
    } else {
      navigate('/vedios', { state: { fromUpload: true } })
    }
  }

  const handleArticleSubmit = async (values: Record<string, unknown>) => {
    const res = await addArticle({
      name: values.name as string,
      content: (values.content as string) || '',
      description: (values.description as string) || (values.name as string),
      author: (values.author as string) || user?.name || '用户',
      cover: values.cover as string,
      url: String(values.url || ''),
      published_at: Math.floor(Date.now() / 1000),
      tags: parseTags(values.tags as string),
    }) as { code?: number; message?: string; data?: { article_id?: number } }
    const ok = res?.code === 0 || res?.code === 200
    if (!ok) {
      throw new Error(res?.message ?? '文章发布失败')
    }
    const data = (res?.data ?? res) as { article_id?: number }
    message.success('文章发布成功')
    if (data?.article_id) {
      navigate(`/news/${data.article_id}`)
    } else {
      navigate('/article')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const userId = getCurrentUserId()
      if (!userId) {
        message.warning('请先登录后再上传')
        navigate('/login')
        return
      }
      setLoading(true)
      if (uploadType === 'video') {
        await handleVideoSubmit(values)
      } else {
        await handleArticleSubmit(values)
      }
      form.resetFields()
      setVideoUploadPercent(null)
      setCoverUploadPercent(null)
      setUploadedVideoUrl('')
      setUploadedCoverUrl('')
    } catch (e) {
      console.log(e)
      message.error(getErrorMessage(e, '提交失败，请稍后重试'))
    } finally {
      setLoading(false)
    }
  }

  const handleVideoUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    const f = file as File
    setVideoUploadPercent(0)
    try {
      const url = await uploadVideo(f, (p) => setVideoUploadPercent(p))
      form.setFieldValue('url', url)
      setUploadedVideoUrl(url)
      onSuccess?.(url)
      message.success('视频已上传至 OSS')
    } catch (e) {
      message.error(getErrorMessage(e, '视频上传失败'))
      onError?.(e as Error)
    } finally {
      setVideoUploadPercent(null)
    }
  }

  const handleCoverUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    const f = file as File
    setCoverUploadPercent(0)
    try {
      const url = await uploadImage(f, (p) => setCoverUploadPercent(p))
      form.setFieldValue('cover', url)
      setUploadedCoverUrl(url)
      onSuccess?.(url)
      message.success('封面已上传至 OSS')
    } catch (e) {
      message.error(getErrorMessage(e, '封面上传失败'))
      onError?.(e as Error)
    } finally {
      setCoverUploadPercent(null)
    }
  }

  const videoUploadProps: UploadProps = {
    accept: VIDEO_ACCEPT,
    showUploadList: false,
    customRequest: handleVideoUpload,
    beforeUpload: (file) => {
      if (file.type !== 'video/mp4') {
        message.error('请选择 MP4 格式视频，以确保浏览器可正常播放')
        return Upload.LIST_IGNORE
      }
      const isMp4 = file.name.toLowerCase().endsWith('.mp4')
      if (!isMp4) {
        message.error('请选择 .mp4 格式视频文件')
        return Upload.LIST_IGNORE
      }
      const maxSize = 500 * 1024 * 1024
      if (file.size > maxSize) {
        message.error('视频大小不能超过 500MB')
        return Upload.LIST_IGNORE
      }
      return true
    },
  }

  const coverUploadProps: UploadProps = {
    accept: IMAGE_ACCEPT,
    showUploadList: false,
    customRequest: handleCoverUpload,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('请选择图片文件（JPG、PNG、GIF、WebP）')
        return Upload.LIST_IGNORE
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        message.error('封面大小不能超过 5MB')
        return Upload.LIST_IGNORE
      }
      return true
    },
  }

  return (
    <div className="page-shell upload-page">
      <section className="page-hero">
        <span className="soft-tag">内容创作</span>
        <h1 className="page-title" style={{ marginTop: '16px' }}>
          上传内容
        </h1>
        <p className="page-subtitle">
          选择视频或图片文件，将自动上传至阿里云 OSS
        </p>
      </section>

      <div className="page-content-grid">
        <section className="surface-card" style={{ padding: '28px' }}>
          <div className="upload-type-row">
            <button
              type="button"
              className={`yt-filter-chip${uploadType === 'video' ? ' is-active' : ''}`}
              onClick={() => { setUploadType('video'); form.resetFields(); setVideoUploadPercent(null); setCoverUploadPercent(null); setUploadedVideoUrl(''); setUploadedCoverUrl('') }}
            >
              <PlaySquareOutlined style={{ marginRight: '6px' }} />
              视频
            </button>
            <button
              type="button"
              className={`yt-filter-chip${uploadType === 'article' ? ' is-active' : ''}`}
              onClick={() => { setUploadType('article'); form.resetFields(); setVideoUploadPercent(null); setCoverUploadPercent(null); setUploadedVideoUrl(''); setUploadedCoverUrl('') }}
            >
              <FileTextOutlined style={{ marginRight: '6px' }} />
              文章
            </button>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ author: user?.name || '' }}
            style={{ marginTop: '24px' }}
          >
            <Form.Item
              name="name"
              label={uploadType === 'video' ? '视频标题' : '文章标题'}
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder={uploadType === 'video' ? '请输入视频标题' : '请输入文章标题'} size="large" />
            </Form.Item>

            <Form.Item
              name="description"
              label={uploadType === 'video' ? '视频简介' : '文章摘要'}
            >
              <Input.TextArea
                placeholder={uploadType === 'video' ? '请输入视频简介（选填）' : '请输入文章摘要，用于列表展示'}
                rows={3}
              />
            </Form.Item>

            {uploadType === 'article' && (
              <Form.Item
                name="content"
                label="正文内容"
                rules={[{ required: true, message: '请输入正文内容' }]}
              >
                <Input.TextArea
                  placeholder="请输入正文，支持换行。图片可单独一行粘贴图片链接"
                  rows={10}
                  style={{ fontFamily: 'inherit' }}
                />
              </Form.Item>
            )}

            {uploadType === 'video' && (
              <Form.Item
                name="url"
                label="选择视频"
                rules={[{ required: true, message: '请选择并上传视频文件' }]}
              >
                <div className="upload-file-row">
                  <Upload {...videoUploadProps}>
                    <Button icon={<PlaySquareOutlined />} size="large">
                      选择视频文件
                    </Button>
                  </Upload>
                  {uploadedVideoUrl && (
                    <span className="upload-file-done">已上传</span>
                  )}
                  {videoUploadPercent !== null && (
                    <Progress percent={videoUploadPercent} size="small" style={{ width: 120, marginLeft: 12 }} />
                  )}
                </div>
              </Form.Item>
            )}

            <Form.Item
              name="cover"
              label="选择封面"
              rules={[{ required: true, message: '请选择并上传封面图片' }]}
            >
              <div className="upload-file-row">
                <Upload {...coverUploadProps}>
                  <Button icon={<PictureOutlined />} size="large">
                    选择封面图片
                  </Button>
                </Upload>
                {uploadedCoverUrl && (
                  <span className="upload-file-done">已上传</span>
                )}
                {coverUploadPercent !== null && (
                  <Progress percent={coverUploadPercent} size="small" style={{ width: 120, marginLeft: 12 }} />
                )}
              </div>
            </Form.Item>

            <Form.Item name="author" label="作者">
              <Input placeholder="作者名称" size="large" />
            </Form.Item>

            <Form.Item name="tags" label="标签">
              <Input placeholder="多个标签用逗号分隔，如：心理健康,正能量" size="large" />
            </Form.Item>

            {uploadType === 'article' && (
              <Form.Item name="url" label="文章链接">
                <Input placeholder="选填" size="large" />
              </Form.Item>
            )}

            <Form.Item style={{ marginTop: '28px', marginBottom: 0 }}>
              <div className="upload-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<UploadOutlined />}
                  loading={loading}
                  onClick={() => void handleSubmit()}
                >
                  {uploadType === 'video' ? '提交视频' : '发布文章'}
                </Button>
                <Button size="large" onClick={() => navigate(-1)}>
                  取消
                </Button>
              </div>
            </Form.Item>
          </Form>
        </section>

        <aside className="surface-card" style={{ padding: '22px' }}>
          <div className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
            上传说明
          </div>
          <div className="info-stack">
            <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#f8fafc' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>视频上传</div>
              <div style={{ marginTop: '8px', fontSize: '13px', lineHeight: 1.6, color: '#64748b' }}>
                仅支持 MP4 格式（H.264 编码），最大 500MB，确保各浏览器可正常播放
              </div>
            </div>
            <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#f8fafc' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>封面图片</div>
              <div style={{ marginTop: '8px', fontSize: '13px', lineHeight: 1.6, color: '#64748b' }}>
                支持 JPG、PNG、GIF、WebP，最大 5MB。上传前自动压缩，加快传输
              </div>
            </div>
            <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#f8fafc' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>文章发布</div>
              <div style={{ marginTop: '8px', fontSize: '13px', lineHeight: 1.6, color: '#64748b' }}>
                正文中图片可单独一行粘贴图片链接，将自动渲染显示
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default UploadPage
