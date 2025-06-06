import React, { useState, useEffect, useRef } from 'react';
import { database } from '../../config/firebase';
import { ref, onValue, push, off } from 'firebase/database';
import { formatTime } from '../../utils/helpers';
import { logger } from '../../utils/logger.js';
import { getRandomCoupangProduct } from '../../data/coupangProducts';
import FlyingRankingMessage from './FlyingRankingMessage';
import FlyingChatMessage from './FlyingChatMessage';
import ChatModal from './ChatModal';

const FlyingMessageManager = ({ 
  elapsedTime = 0, 
  onAdCooldownChange,
  // 🎆 상위에서 전달받은 채팅 권한 상태
  chatTokens: propChatTokens,
  setChatTokens: setPropChatTokens,
  premiumTokens: propPremiumTokens,
  setPremiumTokens: setPropPremiumTokens
}) => {
  const [flyingRankingMessages, setFlyingRankingMessages] = useState([]);
  const [flyingChatMessages, setFlyingChatMessages] = useState([]);
  const [chatModal, setChatModal] = useState(false);
  const [chatCooldown, setChatCooldown] = useState(0); // 기본적으로 권한 없음
  const [adChatCooldown, setAdChatCooldown] = useState(0); // 광고 클릭 쿨다운 (30초)
  // 🎆 상위에서 전달받은 채팅 권한 상태 사용 (로컬 상태 제거)
  // const [chatTokens, setChatTokens] = useState(0); // 제거
  // const [premiumTokens, setPremiumTokens] = useState(0); // 제거
  const chatTokens = propChatTokens || 0;
  const setChatTokens = setPropChatTokens || (() => {});
  const premiumTokens = propPremiumTokens || 0;
  const setPremiumTokens = setPropPremiumTokens || (() => {});
  const [messageIdCounter, setMessageIdCounter] = useState(0);
  const [totalTimeWasted, setTotalTimeWasted] = useState(0); // 총 체류 시간 추적
  const [lastProcessedMessage, setLastProcessedMessage] = useState(null); // 중복 방지
  const mySentMessagesRef = useRef(new Set()); // useRef로 변경 - 실시간 참조 가능
  const [recentlySentMessage, setRecentlySentMessage] = useState(null); // 최근 전송 메시지

  // 🎵 광고 클릭 효과음 재생 함수
  const playAdClickSound = () => {
    try {
      const audio = new Audio('/sounds/ad_click.mp3');
      audio.volume = 0.5; // 광고 보상이므로 크게 (50%)
      audio.play().catch((error) => {
        console.log('광고 클릭 효과음 재생 실패:', error.message);
      });
    } catch (error) {
      console.log('ad_click.mp3 파일을 찾을 수 없습니다.');
    }
  };

  // 🎵 프리미엄 채팅 전송 효과음 재생 함수
  const playPremiumChatSound = () => {
    try {
      const audio = new Audio('/sounds/premium_chat.mp3');
      audio.volume = 0.45; // 프리미엄이므로 조금 크게 (45%)
      audio.play().catch((error) => {
        console.log('프리미엄 채팅 효과음 재생 실패:', error.message);
      });
    } catch (error) {
      console.log('premium_chat.mp3 파일을 찾을 수 없습니다.');
    }
  };

  // 🎵 일반 채팅 전송 효과음 재생 함수
  const playChatSendSound = () => {
    try {
      const audio = new Audio('/sounds/chat_send.mp3');
      audio.volume = 0.35; // 채팅 효과음이므로 적당히 (35%)
      audio.play().catch((error) => {
        console.log('일반 채팅 효과음 재생 실패:', error.message);
      });
    } catch (error) {
      console.log('chat_send.mp3 파일을 찾을 수 없습니다.');
    }
  };

  // 🎵 1분 체류 보상 효과음 재생 함수
  const playOneMinuteRewardSound = () => {
    try {
      const audio = new Audio('/sounds/1min_sound.mp3');
      audio.volume = 0.4; // 보상 효과음이므로 조금 크게 (40%)
      audio.play().catch((error) => {
        console.log('1분 체류 보상 효과음 재생 실패:', error.message);
      });
    } catch (error) {
      console.log('1min_sound.mp3 파일을 찾을 수 없습니다.');
    }
  };

  // 체류 시간 추적 및 1분마다 채팅 권한 자동 지급 (쌓이지 않음)
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimeWasted(prev => {
        const newTime = prev + 1;
        
        // 1분(60초)마다 채팅 권한 자동 지급 (최대 1개만 유지)
        if (newTime > 0 && newTime % 60 === 0) {
          setChatTokens(prevTokens => {
            // 이미 채팅 권한이 있으면 추가하지 않음 (도배 방지)
            if (prevTokens > 0) {
              return prevTokens; // 그대로 유지
            }
            
            // 🎵 1분 체류 보상 효과음 재생!
            playOneMinuteRewardSound();
            
            addFlyingChatMessage('🎁 1분 체류 보상! 일반 채팅 권한 획득!', false);
            return 1; // 정확히 1개만
          });
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // 광고 쿨다운 처리 - 🐛 콜백으로 상태 공유
  useEffect(() => {
    if (adChatCooldown > 0) {
      const timer = setInterval(() => {
        setAdChatCooldown(prev => {
          const newValue = Math.max(0, prev - 1000);
          // 🐛 상위 컴포넌트에 쿨다운 상태 전달
          if (onAdCooldownChange) {
            onAdCooldownChange({
              cooldown: newValue,
              canGetToken: newValue === 0
            });
          }
          return newValue;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // 쿨다운이 0일 때도 콜백 수행
      if (onAdCooldownChange) {
        onAdCooldownChange({
          cooldown: 0,
          canGetToken: true
        });
      }
    }
  }, [adChatCooldown, onAdCooldownChange]);

  // Firebase 실시간 리스너들
  useEffect(() => {
    if (!database) {
      // Firebase가 없을 때 테스트용 더미 데이터
      setTimeout(() => {
        addFlyingRankingMessage("테스터님이 25분34초로 3위를 기록했습니다!");
      }, 10000);
      
      setTimeout(() => {
        addFlyingChatMessage("여기 정말 중독성 있네요 ㅠㅠ", false); // 다른 사람 메시지
      }, 15000);
      
      return;
    }

    const rankingRef = ref(database, 'live-feed/ranking-updates');
    const chatRef = ref(database, 'live-feed/global-chat');

    // 랭킹 변동 알림
    const unsubscribeRanking = onValue(rankingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const latestRanking = Object.values(data).sort((a, b) => b.timestamp - a.timestamp)[0];
        if (latestRanking && Date.now() - latestRanking.timestamp < 10000) {
          const message = `${latestRanking.username}님이 ${formatTime(latestRanking.time)}으로 ${latestRanking.rank}위를 기록했습니다!`;
          addFlyingRankingMessage(message);
        }
      }
    });

    // 🔥 강화된 글로벌 채팅 메시지 리스너
    const unsubscribeChat = onValue(chatRef, (snapshot) => {
      try {
        const data = snapshot.val();
        
        if (data) {
          const messages = Object.entries(data)
            .map(([key, value]) => ({ ...value, key }))
            .sort((a, b) => b.timestamp - a.timestamp);
          
          const latestChat = messages[0];
          
          // 새로운 메시지이고, 10초 이내에 작성된 경우만 표시
          // 그리고 내가 방금 보낸 메시지가 아니어야 함
          if (latestChat && 
              Date.now() - latestChat.timestamp < 10000 && 
              lastProcessedMessage !== latestChat.key &&
              !mySentMessagesRef.current.has(latestChat.messageId)) { // useRef로 변경 - 실시간 참조
            
            addFlyingChatMessage(latestChat.message, false, latestChat.messageType || 'basic'); // 메시지 타입 전달
            setLastProcessedMessage(latestChat.key);
          }
        }
      } catch (error) {
        logger.error('채팅 리스너 오류:', error);
        // 오류가 발생해도 Firebase 리스너를 유지
      }
    });

    return () => {
      off(rankingRef);
      off(chatRef);
    };
  }, [lastProcessedMessage]);

  const addFlyingRankingMessage = (message) => {
    const id = Date.now() + Math.random();
    setFlyingRankingMessages(prev => [...prev, { id, message }]);
  };

  const addFlyingChatMessage = (message, isMyMessage = false, messageType = 'basic') => {
    const id = Date.now() + Math.random();
    setFlyingChatMessages(prev => [...prev, { id, message, isMyMessage, messageType }]);
  };

  const removeFlyingMessage = (id, type) => {
    if (type === 'ranking') {
      setFlyingRankingMessages(prev => prev.filter(msg => msg.id !== id));
    } else if (type === 'chat') {
      setFlyingChatMessages(prev => prev.filter(msg => msg.id !== id));
    }
  };

  // 🎯 광고 클릭으로 채팅 권한 얻기 - 랜덤 쿠팡 링크 연결
  const handleAdClick = () => {
    if (adChatCooldown === 0) {
      // 🎯 랜덤 쿠팡 상품 선택
      // 🎵 광고 클릭 효과음 재생
      playAdClickSound();
      
      const randomProduct = getRandomCoupangProduct();
      
      // 쿠팡 링크 열기
      window.open(randomProduct.url, '_blank');
      
      // 프리미엄 권한 지급
      setPremiumTokens(prev => prev + 1);
      setAdChatCooldown(30000); // 30초 쿨다운
      
      // 성공 메시지 표시
      addFlyingChatMessage(`🎆 ${randomProduct.name} 광고 시청! 프리미엄 채팅 권한 1개 획득!`, false);
    }
  };
  
  const handleSendChatMessage = (message, selectedMessageType = 'auto') => {
    // 최근 전송한 메시지와 같으마 중복 전송 방지
    if (recentlySentMessage === message) {
      return;
    }
    
    // 🎯 사용자가 선택한 메시지 타입에 따른 근한 결정
    let messageType = 'none';
    
    if (selectedMessageType === 'premium' && premiumTokens > 0) {
      // 사용자가 프리미엄 선택 + 권한 있음
      messageType = 'premium';
      setPremiumTokens(prev => prev - 1);
    } else if (selectedMessageType === 'basic' && chatTokens > 0) {
      // 사용자가 일반 선택 + 권한 있음
      messageType = 'basic';
      setChatTokens(prev => prev - 1);
    } else if (selectedMessageType === 'auto') {
      // 자동 선택: 기존 로직 (프리미엄 우선)
      if (premiumTokens > 0) {
        messageType = 'premium';
        setPremiumTokens(prev => prev - 1);
      } else if (chatTokens > 0) {
        messageType = 'basic';
        setChatTokens(prev => prev - 1);
      }
    }
    
    // 권한이 없으면 전송 불가
    if (messageType === 'none') {
      return;
    }
    
    // 🎵 채팅 타입에 따른 효과음 재생
    if (messageType === 'basic') {
      playChatSendSound(); // 일반 채팅 효과음
    } else if (messageType === 'premium') {
      playPremiumChatSound(); // 프리미엄 채팅 효과음
    }
    
    // 최근 전송 메시지 기록
    setRecentlySentMessage(message);
    
    // 고유 메시지 ID 생성
    const messageId = Date.now() + '-' + Math.random();
    
    // 내가 보낸 메시지로 기록 (useRef로 즉시 반영)
    mySentMessagesRef.current.add(messageId);
    
    // 🚀 내 메시지를 즉시 화면에 표시! (메시지 타입 전달)
    addFlyingChatMessage(message, true, messageType); // messageType 추가
    
    // 3초 후 동일 메시지 전송 허용
    setTimeout(() => {
      setRecentlySentMessage(null);
    }, 3000);
    
    if (!database) {
      return;
    }
    
    // Firebase에 전송 (다른 사용자들에게만 보이게)
    const chatRef = ref(database, 'live-feed/global-chat');
    const messageData = { 
      message, 
      timestamp: Date.now(),
      userAgent: navigator.userAgent.substring(0, 50),
      messageId: messageId, // 고유 ID 추가
      messageType: messageType, // 메시지 타입 추가
      isMyMessage: false // 다른 사용자들에게는 내 메시지가 아님
    };
    
    push(chatRef, messageData)
    .then(() => {
      // 성공 시 로그 없음
    })
    .catch((error) => {
      logger.error('채팅 메시지 전송 실패:', error);
      
      // 사용자 친화적 피드백
      if (error.code === 'PERMISSION_DENIED') {
        addFlyingChatMessage('😔 서버 연결 문제로 메시지가 다른 사람들에게 전송되지 않았어요', false);
      } else if (error.code === 'NETWORK_ERROR') {
        addFlyingChatMessage('🌐 네트워크 연결을 확인해 주세요', false);
      } else {
        addFlyingChatMessage('😅 메시지 전송에 실패했지만 로컬에서는 보여요!', false);
      }
    });
  };

  const canChat = chatTokens > 0 || premiumTokens > 0; // 어떤 토큰이라도 있으면 채팅 가능
  const canGetTokenFromAd = adChatCooldown === 0; // 광고 쿨다운이 아니면 토큰 획득 가능
  const totalTokens = chatTokens + premiumTokens; // 총 토큰 개수

  return (
    <>
      {/* 날아가는 랭킹 메시지들 */}
      {flyingRankingMessages.map(msg => (
        <FlyingRankingMessage
          key={msg.id}
          id={msg.id}
          message={msg.message}
          onComplete={(id) => removeFlyingMessage(id, 'ranking')}
        />
      ))}

      {/* 날아가는 채팅 메시지들 */}
      {flyingChatMessages.map(msg => (
        <FlyingChatMessage
          key={msg.id}
          id={msg.id}
          message={msg.message}
          isMyMessage={msg.isMyMessage}
          messageType={msg.messageType} // 메시지 타입 전달
          onComplete={(id) => removeFlyingMessage(id, 'chat')}
        />
      ))}

      {/* 채팅 버튼 - 중앙 하단으로 이동! */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
        <button
          onClick={() => setChatModal(true)}
          disabled={false} // 모달은 항상 열 수 있게 하고, 모달 내에서 제한
          className={`pokemon-button shadow-lg transition-all duration-300 ${
            canChat 
              ? 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600' 
              : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 opacity-70'
          }`}
          title={canChat ? "글로벌 메시지 보내기" : `채팅 권한이 없습니다. 광고를 클릭해 권한을 획득하세요!`}
        >
          💬 {canChat ? `메시지 보내기 (일반:${chatTokens} 프리미엄:${premiumTokens})` : '메시지 보내기 (권한없음)'}
        </button>
        
        {/* 개발 모드 전용 테스트 버튼 */}
        {(import.meta.env.DEV || import.meta.env.MODE === 'development') && (
          <button
            onClick={() => {
              // 🎵 광고 클릭 효과음 테스트
              playAdClickSound();
              
              setChatTokens(prev => prev + 2);
              setPremiumTokens(prev => prev + 3);
              
              // 🎵 1분 체류 보상 효과음 테스트
              playOneMinuteRewardSound();
              
              addFlyingChatMessage('🎁 테스트 토큰 지급! 일반 2개 + 프리미엄 3개', false);
              // 강제 테스트 메시지도 추가
              setTimeout(() => {
                // 🎵 일반 채팅 효과음 테스트
                playChatSendSound();
                addFlyingChatMessage('💬 일반 메시지 테스트!', true, 'basic'); // 일반 메시지
              }, 1000);
              setTimeout(() => {
                // 🎵 프리미엄 채팅 효과음 테스트
                playPremiumChatSound();
                addFlyingChatMessage('🎆 프리미엄 메시지 테스트!', true, 'premium'); // 프리미엄 메시지
              }, 2000);
            }}
            className="pokemon-button bg-yellow-400 hover:bg-yellow-500 text-sm px-3 py-2 border-4 border-black"
            title="개발용 토큰 지급 + 테스트 메시지 + 다양한 효과음"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)',
              boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.5)',
              animation: 'pulse 2s infinite'
            }}
          >
            🚀🎵 테스트!
          </button>
        )}
      </div>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={chatModal}
        onClose={() => setChatModal(false)}
        onSendMessage={handleSendChatMessage}
        remainingTime={adChatCooldown}
        canChat={canChat}
        chatTokens={chatTokens}
        premiumTokens={premiumTokens} // 프리미엄 토큰 전달
        onAdClick={handleAdClick}
        canGetTokenFromAd={canGetTokenFromAd}
        elapsedTime={elapsedTime} // 🕰️ elapsedTime 전달
      />
    </>
  );
};

export default FlyingMessageManager;
