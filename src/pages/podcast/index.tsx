import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
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
import { useAppSelector } from '@/store/hooks';
import { getFirstPodcast } from '@/features/podcast/podcastSlice';
import './index.css';

function Podcast() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

  const handleSeek = (event: MouseEvent<HTMLDivElement>) => {
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

  return (
    <div className="page-shell podcast-page">
      <section className="page-hero podcast-hero">
        <span className="soft-tag">播客频道</span>
        <h1 className="page-title" style={{ marginTop: '16px', color: 'white' }}>
          网页化的播客收听体验
        </h1>
      </section>

      <div className="podcast-layout">
        <section className="podcast-player-panel">
          <img
            src={podcast?.cover || coverImage}
            alt="封面"
            className="podcast-cover"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '26px', fontWeight: 700, lineHeight: 1.35 }}>
              {podcast?.title || '播客节目'}
            </div>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)' }}>
              {podcast?.author || '播客频道'}
            </div>
            <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.78)' }}>
              {podcast?.description || '这是一段示例介绍文字。'}
            </div>
          </div>

          <div className="podcast-progress">
            <div ref={progressRef} onClick={handleSeek} className="podcast-progress__track">
              <div className="podcast-progress__fill" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
              <div className="podcast-progress__thumb" style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
            </div>
            <div className="podcast-progress__meta">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="podcast-controls">
            <button className="podcast-control-btn" type="button">
              <RetweetOutlined />
            </button>
            <button className="podcast-control-btn" type="button">
              <UndoOutlined />
              <span>15</span>
            </button>
            <button className="podcast-control-btn is-primary" onClick={() => setIsPlaying(!isPlaying)} type="button">
              {isPlaying ? <PauseCircleFilled /> : <PlayCircleFilled />}
            </button>
            <button className="podcast-control-btn" type="button">
              <RedoOutlined />
              <span>30</span>
            </button>
            <button className="podcast-control-btn" type="button">
              <OrderedListOutlined />
            </button>
          </div>

          <div className="podcast-social">
            <div><LikeOutlined /> 177</div>
            <div><MessageOutlined /> 31</div>
            <div><MoreOutlined /> 更多</div>
          </div>
        </section>

        <section className="surface-card" style={{ padding: '24px' }}>
          <div className="section-head">
            <div>
              <div className="section-title">节目分段</div>
            </div>
            <span className="soft-tag">{sections.length} 个片段</span>
          </div>

          <div className="podcast-sections">
            {sections.map((item, index) => (
              <div key={index} className="podcast-section-card">
                <span className="podcast-section-card__time">{item.time}</span>
                <div>
                  <div className="podcast-section-card__title">{item.title}</div>
                  <div className="podcast-section-card__desc">适合在网页端快速定位收听内容</div>
                </div>
              </div>
            ))}
          </div>
        </section>
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
