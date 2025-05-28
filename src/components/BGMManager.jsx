import React, { useState, useEffect, useRef } from 'react';

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
  
  // 볼륨 변경 - 최대 50%로 제한
  const handleVolumeChange = (newVolume) => {
    const limitedVolume = Math.min(newVolume, 0.5); // 최대 50%로 제한
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
  
  // 🎵 유튜브 스타일 심플 UI
  return (
    <div className="flex items-center gap-2 bg-black/70 text-white px-3 py-1 rounded-full backdrop-blur-sm">
      {/* 재생/일시정지 버튼 */}
      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 transition-colors"
        title={isPlaying ? '일시정지' : '재생'}
      >
        {isPlaying ? (
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-white"></div>
            <div className="w-1 h-3 bg-white"></div>
          </div>
        ) : (
          <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5"></div>
        )}
      </button>
      
      {/* 음소거 버튼 */}
      <button
        onClick={toggleMute}
        className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/20 transition-colors"
        title={isMuted ? '음소거 해제' : '음소거'}
      >
        {isMuted ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.817L4.067 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.067l4.316-3.817zm2.617 0a1 1 0 011 1v12a1 1 0 01-1 1 1 1 0 01-.707-.293L9.586 15H7a1 1 0 01-1-1V6a1 1 0 011-1h2.586l1.707-1.707A1 1 0 0112 4z" clipRule="evenodd" />
            <path d="M15.536 6.464a1 1 0 10-1.414 1.414L15.536 9.29 13.12 11.707a1 1 0 101.414 1.414L16.95 10.707 19.36 13.12a1 1 0 001.414-1.414L18.36 9.293l2.414-2.414a1 1 0 00-1.414-1.414L16.95 7.88l-1.414-1.414z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.817L4.067 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.067l4.316-3.817A1 1 0 019.383 3.076zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-1.929 3.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-.995-.102-1.951-.343-2.657a1 1 0 010-1.414zM13.657 8.343a1 1 0 011.414 0A5.98 5.98 0 0116 10a5.98 5.98 0 01-.929 1.657 1 1 0 11-1.414-1.414A3.98 3.98 0 0014 10c0-.229-.027-.453-.086-.657a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {/* 볼륨 슬라이더 */}
      <div className="flex items-center gap-1">
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.05"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer slider"
          title="볼륨 조절 (최대 50%)"
        />
        <span className="text-xs text-white/70 min-w-[30px]">
          {Math.round(volume * 100)}%
        </span>
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
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default BGMManager;