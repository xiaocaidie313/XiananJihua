import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  PlayCircleFilled,
  PauseCircleFilled,
  StepBackwardOutlined,
  StepForwardOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { getNewPodcastsList, getPodcastContent } from '@/api/content';
import type { PodcastSummary, PodcastInfo, PodcastHighlight } from '@/constants/content';
import { getFirstPodcast } from '@/features/podcast/podcastSlice';
import { useAppSelector } from '@/store/hooks';
import { timestampToMs } from '@/utils/appState';
import './index.css';


function formatPodcastDate(publishedAt: number): string {
  if (!publishedAt) return '';
  const d = new Date(timestampToMs(publishedAt));
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return '今日';
  if (diff < 172800000) return '昨日';
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 将 mock 数据转为 PodcastSummary 格式 */
function mockToSummary(m: { id: number; title: string; url: string; author: string; cover?: string; description?: string }): PodcastSummary {
  return {
    podcast_id: m.id,
    name: m.title,
    url: m.url,
    description: m.description ?? '',
    cover: m.cover ?? '',
    author: m.author,
    channel: '',
    status: 0,
    published_at: 0,
    created_at: 0,
    updated_at: 0,
    like_count: 0,
    view_count: 0,
    collect_count: 0,
    comment_count: 0,
    last_modified_by: 0,
    relation_status: 0,
  };
}

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) return '00:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatTimestamp = (seconds: number) => formatTime(seconds);

const parseTimestamp = (s: string): number => {
  const parts = s.split(':').map(Number);
  if (parts.length >= 2) return parts[0] * 60 + parts[1];
  return 0;
};

function Podcast() {
  const [podcasts, setPodcasts] = useState<PodcastSummary[]>([]);
  const [currentPodcast, setCurrentPodcast] = useState<PodcastInfo | PodcastSummary | null>(null);
  const [highlights, setHighlights] = useState<PodcastHighlight[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const currentIndex = podcasts.findIndex((p) => p.podcast_id === currentPodcast?.podcast_id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < podcasts.length - 1;

  const mockPodcast = useAppSelector(getFirstPodcast);

  useEffect(() => {
    getNewPodcastsList({ page_size: 20, cursor: 0 })
      .then((res) => {
        if (res?.data?.podcasts?.length) {
          setPodcasts(res.data.podcasts);
          const first = res.data.podcasts[0];
          setCurrentPodcast(first);
          getPodcastContent(first.podcast_id)
            .then((detail) => {
              if (detail?.data?.podcast) {
                setCurrentPodcast(detail.data.podcast);
                setHighlights(detail.data.podcast.highlights ?? []);
              }
            })
            .catch(() => setHighlights([]));
        } else if (mockPodcast) {
          const fallback = mockToSummary(mockPodcast);
          setPodcasts([fallback]);
          setCurrentPodcast(fallback);
          setHighlights(
            (mockPodcast.sections ?? []).map((s) => ({
              second: parseTimestamp(s.time),
              highlight: s.title,
            })),
          );
        }
      })
      .catch(() => {
        if (mockPodcast) {
          const fallback = mockToSummary(mockPodcast);
          setPodcasts([fallback]);
          setCurrentPodcast(fallback);
          setHighlights(
            (mockPodcast.sections ?? []).map((s) => ({
              second: parseTimestamp(s.time),
              highlight: s.title,
            })),
          );
        } else {
          setPodcasts([]);
        }
      })
      .finally(() => setLoading(false));
  }, [mockPodcast]);

  const selectPodcast = (p: PodcastSummary) => {
    setCurrentPodcast(p);
    setHighlights([]);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    getPodcastContent(p.podcast_id)
      .then((detail) => {
        if (detail?.data?.podcast) {
          setCurrentPodcast(detail.data.podcast);
          setHighlights(detail.data.podcast.highlights ?? []);
        }
      })
      .catch(() => setHighlights([]));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) void audio.play();
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (!currentPodcast?.url) return;
    const audio = audioRef.current;
    if (audio) {
      audio.src = currentPodcast.url;
      audio.load();
    }
  }, [currentPodcast?.url]);

  const playPrev = () => {
    if (hasPrev) selectPodcast(podcasts[currentIndex - 1]);
  };

  const playNext = () => {
    if (hasNext) selectPodcast(podcasts[currentIndex + 1]);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration || 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (hasNext) {
      selectPodcast(podcasts[currentIndex + 1]);
      setTimeout(() => setIsPlaying(true), 150);
    }
  };

  const handleEpisodeAction = (p: PodcastSummary, fromPlayBtn = false) => {
    const isActive = currentPodcast?.podcast_id === p.podcast_id;
    if (fromPlayBtn && isActive) {
      setIsPlaying((prev) => !prev);
      return;
    }
    selectPodcast(p);
    if (!isActive) setTimeout(() => setIsPlaying(true), 100);
  };

  const handleEpisodeClick = (p: PodcastSummary, e: React.MouseEvent) => {
    const playBtn = (e.target as HTMLElement).closest('.episode-play-btn');
    if (playBtn) e.stopPropagation();
    handleEpisodeAction(p, !!playBtn);
  };

  const handleSeek = (event: MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  const jumpToHighlight = (second: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = second;
      setCurrentTime(second);
      setIsPlaying(true);
    }
  };

  const skipBack = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
      setCurrentTime(audio.currentTime);
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (audio && duration) {
      audio.currentTime = Math.min(duration, audio.currentTime + 30);
      setCurrentTime(audio.currentTime);
    }
  };

  const sections = highlights.length
    ? highlights.map((h) => ({ time: formatTimestamp(h.second), title: h.highlight }))
    : [];

  return (
    <div className="page-shell podcast-page podcast-spotify">
      {/* Spotify 风格头部 */}
      <header className="podcast-hero-spotify">
        <div className="podcast-hero-gradient" />
        <div className="podcast-hero-inner">
          {currentPodcast ? (
            <>
              <div className="podcast-hero-cover-wrap">
                <img src={currentPodcast.cover} alt={currentPodcast.name} className="podcast-hero-cover" loading="lazy" />
              </div>
              <div className="podcast-hero-info">
                <span className="podcast-hero-label">播客</span>
                <h1 className="podcast-hero-title">{currentPodcast.name}</h1>
                <p className="podcast-hero-author">{currentPodcast.author}</p>
                {(currentPodcast.view_count ?? 0) > 0 || currentPodcast.published_at ? (
                  <div className="podcast-hero-stats">
                    {(currentPodcast.view_count ?? 0) > 0 && (
                      <span>{currentPodcast.view_count} 次播放</span>
                    )}
                    {currentPodcast.published_at && (
                      <span>{formatPodcastDate(currentPodcast.published_at)}</span>
                    )}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="podcast-hero-placeholder">
              {loading ? (
                <div className="podcast-hero-skeleton">
                  <div className="skeleton-cover" />
                  <div className="skeleton-text" />
                  <div className="skeleton-text short" />
                </div>
              ) : (
                '暂无播客内容'
              )}
            </div>
          )}
        </div>
      </header>

      {/* 播放控制区 */}
      {currentPodcast && (
      <div className="podcast-now-playing">
        <div className="podcast-now-playing__cover">
          <img src={currentPodcast.cover} alt={currentPodcast.name} className={isPlaying ? 'is-playing' : ''} />
        </div>
        <div className="podcast-now-playing__controls">
          <div className="podcast-now-playing__info">
            <span className="podcast-now-playing__title">{currentPodcast.name}</span>
            <span className="podcast-now-playing__author">{currentPodcast.author}</span>
          </div>
          <div className="podcast-controls">
            <button
              className="podcast-control-btn"
              type="button"
              onClick={playPrev}
              disabled={!hasPrev}
              title="上一期"
            >
              <StepBackwardOutlined />
            </button>
            <button
              className="podcast-control-btn podcast-control-btn--play"
              onClick={() => setIsPlaying(!isPlaying)}
              type="button"
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? <PauseCircleFilled /> : <PlayCircleFilled />}
            </button>
            <button className="podcast-control-btn" type="button" onClick={skipBack} title="后退 15 秒">
              <UndoOutlined />
            </button>
            <button className="podcast-control-btn" type="button" onClick={playNext} disabled={!hasNext} title="下一期">
              <StepForwardOutlined />
            </button>
            <button className="podcast-control-btn" type="button" onClick={skipForward} title="前进 30 秒">
              <RedoOutlined />
            </button>
          </div>
          <div className="podcast-progress-wrap">
            <span className="podcast-progress-time">{formatTime(currentTime)}</span>
            <div
              ref={progressRef}
              onClick={handleSeek}
              className="podcast-progress__track"
            >
              <div
                className="podcast-progress__fill"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="podcast-progress-time">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      )}

      {/* 节目列表 */}
      <section className="podcast-content">
        <h2 className="podcast-content-title">节目列表</h2>
        {currentPodcast?.description && (
          <div className="podcast-about">
            <h3>简介</h3>
            <p
              className={descExpanded ? 'expanded' : ''}
              onClick={() => currentPodcast.description!.length > 100 && setDescExpanded(!descExpanded)}
              onKeyDown={(e) => e.key === 'Enter' && currentPodcast.description!.length > 100 && setDescExpanded(!descExpanded)}
              role="button"
              tabIndex={0}
            >
              {currentPodcast.description}
              {currentPodcast.description.length > 100 && (
                <span className="podcast-desc-more">{descExpanded ? ' 收起' : ' 展开'}</span>
              )}
            </p>
          </div>
        )}

        <div className="podcast-episodes">
          {podcasts.length > 0 && (
            <div className="podcast-episodes-header">
              <span className="col-num">#</span>
              <span className="col-cover" />
              <span className="col-title">标题</span>
              <span className="col-date">日期</span>
            </div>
          )}
          {podcasts.length > 0 ? (
            podcasts.map((p, idx) => {
              const isActive = currentPodcast?.podcast_id === p.podcast_id;
              return (
              <div
                key={p.podcast_id}
                role="button"
                tabIndex={0}
                className={`podcast-episode ${isActive ? 'is-active' : ''}`}
                onClick={(e) => handleEpisodeClick(p, e)}
                onKeyDown={(e) => e.key === 'Enter' && handleEpisodeAction(p, false)}
              >
                <span className="col-num">
                  {isActive && isPlaying ? (
                    <span className="episode-playing-icon" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <div className="col-cover">
                  <img src={p.cover} alt={p.name} loading="lazy" />
                  <button
                    type="button"
                    className="episode-play-btn"
                    aria-label={isActive && isPlaying ? '暂停' : '播放'}
                  >
                    {isActive && isPlaying ? <PauseCircleFilled /> : <PlayCircleFilled />}
                  </button>
                </div>
                <div className="col-title">
                  <span className="episode-title">{p.name}</span>
                  <span className="episode-author">{p.author}</span>
                </div>
                <span className="col-date">{p.published_at ? formatPodcastDate(p.published_at) : '—'}</span>
              </div>
            );
            })
          ) : !loading ? (
            <div className="podcast-empty">
              <span className="podcast-empty__icon" />
              <p>暂无节目</p>
            </div>
          ) : null}
        </div>

        {sections.length > 0 && (
          <div className="podcast-chapters">
            <h3>节目章节</h3>
            <div className="podcast-episodes podcast-episodes--chapters">
              {sections.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="podcast-episode podcast-episode--chapter"
                  onClick={() => jumpToHighlight(highlights[index]?.second ?? 0)}
                >
                  <span className="col-num">{item.time}</span>
                  <span className="col-title">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}

export default Podcast;
