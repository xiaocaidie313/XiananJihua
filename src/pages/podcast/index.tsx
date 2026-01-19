import { useEffect, useRef, useState } from 'react';
import {
  DownOutlined,
  ShareAltOutlined,
  RightOutlined,
  LikeOutlined,
  MessageOutlined,
  MoreOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
  UndoOutlined,
  RedoOutlined,
  OrderedListOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import coverImage from '@/assets/images/carousel/01.jpg';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { getFirstPodcast } from '@/features/podcast/podcastSlice';

function Podcast() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const podcast = useAppSelector(getFirstPodcast);

  const sections = podcast?.sections || [
    { time: '00:56', title: '部分 A 简介内容' },
    { time: '02:31', title: '部分 B 核心话题' },
    { time: '04:41', title: '部分 C 精彩探讨' },
    { time: '09:53', title: '部分 D 总结建议' },
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  const formatTime = (value: number) => {
    if (!Number.isFinite(value)) return '00:00';
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #2B5292 0%, #1A2A4D 100%)',
        color: 'white',
        padding: '20px 16px 140px',
        boxSizing: 'border-box',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        zIndex: 100,
      }}
    >
      {/* 顶部状态栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <DownOutlined onClick={() => navigate(-1)} style={{ fontSize: '20px' }} />
        <ShareAltOutlined style={{ fontSize: '20px' }} />
      </div>

      {/* 头部信息区 */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '30px' }}>
        <img
          src={podcast?.cover || coverImage}
          alt="封面"
          style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.4' }}>
            {podcast?.title || '播客节目'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              {podcast?.author || '播客频道'} <RightOutlined style={{ fontSize: '10px' }} />
            </div>
            <div
              style={{
                backgroundColor: 'white',
                color: '#1A2A4D',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              + 订阅播客
            </div>
          </div>
        </div>
      </div>

      {/* 简介卡片 */}
      <div style={{ ...cardStyle, position: 'relative' }}>
        <div style={{ fontSize: '15px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', paddingRight: '20px' }}>
          {podcast?.description || '这是一段示例介绍文字。'}
        </div>
        <RightOutlined style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
      </div>

      {/* 分段列表 */}
      <div style={{ marginBottom: '30px' }}>
        {sections.map((item, index) => (
          <div key={index} style={{ ...cardStyle, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', minWidth: '40px' }}>{item.time}</span>
            <span style={{ fontSize: '15px' }}>{item.title}</span>
          </div>
        ))}
      </div>

      {/* 底部交互与控制 (Fixed) */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 16px 40px',
          background: 'linear-gradient(180deg, transparent 0%, #1A2A4D 40%)',
          zIndex: 101,
        }}
      >
        {/* 点赞评论行 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginBottom: '20px', paddingRight: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <LikeOutlined style={{ fontSize: '24px' }} />
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>177</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <MessageOutlined style={{ fontSize: '24px' }} />
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>31</div>
          </div>
          <MoreOutlined style={{ fontSize: '24px' }} />
        </div>

      {/* 进度条 */}
        <div style={{ marginBottom: '24px' }}>
        <div
          ref={progressRef}
          onClick={handleSeek}
          style={{ width: '100%', height: '2px', backgroundColor: 'rgba(255,255,255,0.2)', position: 'relative', cursor: 'pointer' }}
        >
          <div style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%`, height: '100%', backgroundColor: 'white' }}></div>
          <div
            style={{
              position: 'absolute',
              left: `${duration ? (currentTime / duration) * 100 : 0}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '6px',
              height: '6px',
              backgroundColor: 'white',
              borderRadius: '50%',
            }}
          ></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 播放按钮行 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <RetweetOutlined style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            {/* 后退 15s */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <UndoOutlined style={{ fontSize: '28px' }} />
              <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 'bold', transform: 'translateY(2px)' }}>15</span>
            </div>
            {/* 播放/暂停 */}
            <div onClick={() => setIsPlaying(!isPlaying)} style={{ cursor: 'pointer' }}>
              {isPlaying ? <PauseCircleFilled style={{ fontSize: '56px' }} /> : <PlayCircleFilled style={{ fontSize: '56px' }} />}
            </div>
            {/* 前进 30s */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <RedoOutlined style={{ fontSize: '28px' }} />
              <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 'bold', transform: 'translateY(2px)' }}>30</span>
            </div>
          </div>
          <OrderedListOutlined style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)' }} />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={podcast?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}

export default Podcast;
