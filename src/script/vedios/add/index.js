/**
 * 独立脚本：添加视频到后端，不依赖项目 api 模块
 * 运行: node src/script/vedios/add/index.js
 */

const BASE_URL = 'https://xiaoanjihua.cc'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX3JvbGUiOiJzdXBlcmFkbWluIiwidXNlcl9zdGF0dXMiOjEsImV4cCI6MTc3MzY1MDM1MX0.E-KkHB-kouzY9gw1rQ_ALxF7c6Z6DOvbjTA8yVBCvHc'

async function addVideo(params) {
  const res = await fetch(`${BASE_URL}/api/content/add-video`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `${token}`
     },
    body: JSON.stringify(params),
  })
  const data = await res.json()
  const ok = res.ok && (data.code === 0 || data.code === 200 || data.message?.includes('成功'))
  if (!ok) throw new Error(data.message || '请求失败')
  return data
}

const base_pic = 'https://xiaoanv.oss-cn-beijing.aliyuncs.com/pics/'
const base_vedio = 'https://xiaoanv.oss-cn-beijing.aliyuncs.com/vedios/'
const curtime = Math.floor(Date.now() / 1000)

addVideo({
  author: '小安',
  cover: base_pic + '07.jpg',
  description: '如何保持心理健康',
  name: '如何保持心理健康',
  published_at: curtime,
  tags: ['心理健康'],
  url: base_vedio + '07.mp4',
})
  .then((r) => console.log('成功:', r))
  .catch((e) => console.log('失败@@:', e))
