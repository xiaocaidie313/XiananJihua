import { useLocation, useNavigate } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';
import type { VideoItem } from '@/api/content/types';

function VedioCardOutLine({ vedio }: { vedio: VideoItem }) {
  const { video_id, name, author, cover, published_at } = vedio;
  const navigate = useNavigate();
  const location = useLocation();
  const d = published_at ? new Date(published_at * 1000) : new Date();
  const publishedText = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return (
    <article
      className="hover-rise"
      onClick={() => navigate(`/vedios/${video_id}`, { state: { from: location.pathname } })}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: '14px',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        <img
          src={cover}
          alt={name ?? ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 'auto 14px 14px auto',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.58)',
            color: 'white',
            fontSize: '24px',
          }}
        >
          <PlayCircleOutlined />
        </div>
      </div>

      <div
        style={{
          padding: '12px 2px 0',
          display: 'flex',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#f2f2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '14px',
            fontWeight: 700,
            color: '#0f0f0f',
          }}
        >
          {(author ?? '').slice(0, 1)}
        </div>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#0f0f0f',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {name ?? ''}
          </div>
          <div style={{ fontSize: '13px', color: '#606060' }}>{author ?? ''}</div>
          <div style={{ fontSize: '13px', color: '#606060' }}>12万次观看 · {publishedText}</div>
        </div>
      </div>
    </article>
  );
}

export default VedioCardOutLine;