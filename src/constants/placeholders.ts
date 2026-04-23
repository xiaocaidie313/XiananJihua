/** 文章卡片无封面或本地兜底时的中性占位（勿用轮播 demo 图，避免与首页「本周精选」轮播混淆） */
export const ARTICLE_CARD_COVER_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="248" viewBox="0 0 440 248"><rect fill="#e8eef5" width="440" height="248"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="15" font-family="system-ui,sans-serif">暂无封面</text></svg>`,
  )
