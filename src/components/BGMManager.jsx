import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const BGMManager = ({ elapsedTime, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);
  const fadeTimeoutRef = useRef(null);
  
  // BGM 트랙 정의
  const bgmTracks = {
    // 테마송 (랜덤 재생)
    themes: [
      { name: 'themesong1', file: './bgm/themesong1.mp3', title: '시간낭비 테마 1' },
      { name: 'themesong2', file: './bgm/themesong2.mp3', title: '시간낭비 테마 2' }
    ],
    // 단계별 BGM
    phases: [
      { phase: 1, minTime: 0, maxTime: 300, file: './bgm/phase1.mp3', title: '초보자의 시간낭비' },
      { phase: 2, minTime: 300, maxTime: 900, file: './bgm/phase2.mp3', title: '중급자의 시간낭비' },
      { phase: 3, minTime: 900, maxTime: 1800, file: './bgm/phase3.mp3', title: '고급자의 시간낭비' },
      { phase: 4, minTime: 1800, maxTime: Infinity, file: './bgm/phase4.mp3', title: '마스터의 시간낭비' }
    ]
  };
  
  // 현재 단계에 맞는 BGM 찾기
  const getCurrentPhaseBGM = () => {
    return bgmTracks.phases.find(track => 
      elapsedTime >= track.minTime && elapsedTime < track.maxTime
    );
  };
  
  // 랜덤 테마 선택
  const getRandomTheme = () => {
    return bgmTracks.themes[Math.floor(Math.random() * bgmTracks.themes.length)];
  };
  
  // BGM 변경
  const changeTrack = (newTrack) => {
    if (!newTrack || newTrack.file === currentTrack?.file) return;
    
    // 페이드 아웃
    if (audioRef.current && isPlaying) {
      const fadeOut = () => {
        const audio = audioRef.current;
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.1);
          setTimeout(fadeOut, 50);
        } else {
          audio.pause();
          loadAndPlayTrack(newTrack);
        }
      };
      fadeOut();
    } else {
      loadAndPlayTrack(newTrack);
    }
  };
  
  // 트랙 로드 및 재생
  const loadAndPlayTrack = (track) => {
    if (!audioRef.current) return;
    
    audioRef.current.src = track.file;
    audioRef.current.volume = 0;
    setCurrentTrack(track);
    
    // 로드 완료 후 재생 시도
    const handleCanPlay = () => {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            // 페이드 인
            const fadeIn = () => {
              const audio = audioRef.current;
              if (!audio) return;
              const targetVolume = isMuted ? 0 : volume;
              if (audio.volume < targetVolume - 0.05) {
                audio.volume = Math.min(targetVolume, audio.volume + 0.05);
                setTimeout(fadeIn, 50);
              }
            };
            fadeIn();
          })
          .catch(error => {
            // 자동재생 실패 (사용자 상호작용 필요)
            setIsPlaying(false);
          });
      }
      audioRef.current.removeEventListener('canplay', handleCanPlay);
    };
    
    audioRef.current.addEventListener('canplay', handleCanPlay);
    audioRef.current.load(); // 강제 로드
  };
  
  // 초기 테마송 재생 - 컴포넌트 마운트 후 약간의 지연
  useEffect(() => {
    if (elapsedTime === 0) {
      // 약간의 지연 후 재생 시도 (DOM 완전 로드 대기)
      const timer = setTimeout(() => {
        const randomTheme = getRandomTheme();
        changeTrack(randomTheme);
      }, 1000); // 1초 지연
      
      return () => clearTimeout(timer);
    }
  }, []); // 컴포넌트 마운트 시 한 번만
  
  // 단계별 BGM 변경
  useEffect(() => {
    if (elapsedTime > 0) {
      const phaseBGM = getCurrentPhaseBGM();
      if (phaseBGM && (!currentTrack || currentTrack.file !== phaseBGM.file)) {
        changeTrack(phaseBGM);
      }
    }
  }, [Math.floor(elapsedTime / 60)]); // 1분마다 체크
  
  // 재생/일시정지 토글
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            // 재생 실패 (사용자 상호작용 필요)
          });
      }
    }
  };
  
  // 볼륨 변경
  const handleVolumeChange = (newVolume) => {
    // 최대 볼륨을 50%로 제한
    const limitedVolume = Math.min(newVolume, 0.5);
    setVolume(limitedVolume);
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = limitedVolume;
    }
  };
  
  // 음소거 토글
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
  };
  
  return (
    <div className={compact ? "" : "fixed top-4 right-4 z-40"}>
      <div className={`${compact ? 'bg-white/80 backdrop-blur-sm p-2 rounded-lg border-2 border-gray-300' : 'pokemon-dialog p-3 bg-white/90 backdrop-blur-sm'}`}>
        {/* 현재 재생중인 트랙 - compact 모드에서는 숨김 */}
        {!compact && (
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-4 h-4 text-purple-600" />
            <span className="pokemon-font text-xs text-gray-700">
              {currentTrack ? currentTrack.title : 'BGM 로딩 중...'}
            </span>
          </div>
        )}
        
        {/* 컨트롤 버튼들 */}
        <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'}`}>
          {/* 재생/일시정지 */} 
          <button
            onClick={togglePlay}
            className={`${compact ? 'p-1 min-h-6 text-xs' : 'p-2 min-h-8'} pokemon-button`}
            title={isPlaying ? '일시정지' : '재생'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          {/* 음소거 */}
          <button
            onClick={toggleMute}
            className={`${compact ? 'p-1 min-h-6 text-xs' : 'p-2 min-h-8'} pokemon-button`}
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? <VolumeX className={compact ? "w-3 h-3" : "w-4 h-4"} /> : <Volume2 className={compact ? "w-3 h-3" : "w-4 h-4"} />}
          </button>
          
          {/* 볼륨 슬라이더 - compact 모드에서는 숨김 */}
          {!compact && (
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              title="볼륨 조절 (최대 50%)"
            />
          )}
        </div>
      </div>
      
      {/* 오디오 엘리먼트 */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onLoadStart={() => {}}
        onCanPlay={() => {}}
        onError={() => {}}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default BGMManager;