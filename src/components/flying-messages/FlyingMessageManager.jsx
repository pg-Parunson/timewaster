import React, { useState, useEffect } from 'react';
import { database } from '../../config/firebase';
import { ref, onValue, push, off } from 'firebase/database';
import { formatTime } from '../../utils/helpers';
import ConnectionNotification from './ConnectionNotification';
import FlyingRankingMessage from './FlyingRankingMessage';
import FlyingChatMessage from './FlyingChatMessage';
import ChatModal from './ChatModal';

const FlyingMessageManager = () => {
  const [connectionNotification, setConnectionNotification] = useState(null);
  const [flyingRankingMessages, setFlyingRankingMessages] = useState([]);
  const [flyingChatMessages, setFlyingChatMessages] = useState([]);
  const [chatModal, setChatModal] = useState(false);
  const [chatCooldown, setChatCooldown] = useState(0); // 기본적으로 권한 없음
  const [adChatCooldown, setAdChatCooldown] = useState(0); // 광고 클릭 쿨다운 (30초)
  const [chatTokens, setChatTokens] = useState(0); // 채팅 권한 토큰
  const [messageIdCounter, setMessageIdCounter] = useState(0);
  const [totalTimeWasted, setTotalTimeWasted] = useState(0); // 총 체류 시간 추적
  const [lastProcessedMessage, setLastProcessedMessage] = useState(null); // 중복 방지

  // 체류 시간 추적 및 1분마다 채팅 권한 자동 지급
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimeWasted(prev => {
        const newTime = prev + 1;
        
        // 1분(60초)마다 채팅 권한 자동 지급
        if (newTime > 0 && newTime % 60 === 0) {
          console.log('⏰ 1분 경과! 채팅 권한 1개 자동 지급!');
          setChatTokens(prevTokens => prevTokens + 1);
          addFlyingChatMessage('🎁 1분 체류 보상! 채팅 권한 1개 획득!', false);
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // 광고 쿨다운 처리
  useEffect(() => {
    if (adChatCooldown > 0) {
      const timer = setInterval(() => {
        setAdChatCooldown(prev => Math.max(0, prev - 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [adChatCooldown]);

  // Firebase 실시간 리스너들
  useEffect(() => {
    if (!database) {
      // Firebase가 없을 때 테스트용 더미 데이터
      setTimeout(() => {
        setConnectionNotification({
          totalUsers: Math.floor(Math.random() * 50) + 10,
          timestamp: Date.now()
        });
      }, 5000);
      
      setTimeout(() => {
        addFlyingRankingMessage("테스터님이 25분34초로 3위를 기록했습니다!");
      }, 10000);
      
      setTimeout(() => {
        addFlyingChatMessage("여기 정말 중독성 있네요 ㅠㅠ", false); // 다른 사람 메시지
      }, 15000);
      
      return;
    }

    const connectionsRef = ref(database, 'live-feed/connections');
    const rankingRef = ref(database, 'live-feed/ranking-updates');
    const chatRef = ref(database, 'live-feed/global-chat');

    console.log('🔥 Firebase 리스너 설정 중...');

    // 새 접속자 알림
    const unsubscribeConnection = onValue(connectionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const latestConnection = Object.values(data).sort((a, b) => b.timestamp - a.timestamp)[0];
        if (latestConnection && Date.now() - latestConnection.timestamp < 5000) {
          setConnectionNotification({
            totalUsers: latestConnection.totalUsers || 1,
            timestamp: latestConnection.timestamp
          });
        }
      }
    });

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
      const data = snapshot.val();
      console.log('📨 Firebase 채팅 데이터 수신:', data);
      
      if (data) {
        const messages = Object.entries(data)
          .map(([key, value]) => ({ ...value, key }))
          .sort((a, b) => b.timestamp - a.timestamp);
        
        const latestChat = messages[0];
        console.log('📨 최신 채팅 메시지:', latestChat);
        
        // 새로운 메시지이고, 10초 이내에 작성된 경우만 표시
        if (latestChat && 
            Date.now() - latestChat.timestamp < 10000 && 
            lastProcessedMessage !== latestChat.key) {
          
          console.log('🎉 새 글로벌 메시지 표시:', latestChat.message);
          addFlyingChatMessage(latestChat.message, false); // 다른 사람 메시지
          setLastProcessedMessage(latestChat.key);
        }
      }
    });

    return () => {
      console.log('🔥 Firebase 리스너 정리 중...');
      off(connectionsRef);
      off(rankingRef);
      off(chatRef);
    };
  }, [lastProcessedMessage]);

  const addFlyingRankingMessage = (message) => {
    const id = Date.now() + Math.random();
    console.log('🏆 랭킹 메시지 추가:', message);
    setFlyingRankingMessages(prev => [...prev, { id, message }]);
  };

  const addFlyingChatMessage = (message, isMyMessage = false) => {
    const id = Date.now() + Math.random();
    console.log('💬 채팅 메시지 추가:', message, '내 메시지:', isMyMessage);
    setFlyingChatMessages(prev => [...prev, { id, message, isMyMessage }]);
  };

  const removeFlyingMessage = (id, type) => {
    if (type === 'ranking') {
      setFlyingRankingMessages(prev => prev.filter(msg => msg.id !== id));
    } else if (type === 'chat') {
      setFlyingChatMessages(prev => prev.filter(msg => msg.id !== id));
    }
  };

  // 광고 클릭으로 채팅 권한 득기
  const handleAdClick = () => {
    if (adChatCooldown === 0) {
      console.log('🎆 광고 클릭! 채팅 권한 획득!');
      setChatTokens(prev => prev + 1); // 채팅 토큰 1개 지급
      setAdChatCooldown(30000); // 30초 쿨다운
      
      // 성공 메시지 표시
      addFlyingChatMessage('💬 채팅 권한 1개 획득! 이제 메시지를 보낼 수 있어요!', false);
    }
  };
  const handleSendChatMessage = (message) => {
    console.log('💬 메시지 전송 시작:', message);
    
    // 채팅 토큰 소모
    if (chatTokens > 0) {
      setChatTokens(prev => prev - 1); // 토큰 1개 소모
    }
    
    // 🚀 내 메시지를 즉시 화면에 표시!
    console.log('✨ 내 메시지 즉시 화면에 표시:', message);
    addFlyingChatMessage(message, true); // isMyMessage = true, 즉시!
    
    if (!database) {
      console.log('💻 로컬 모드: Firebase 없이 테스트');
      return; // 쿨다운 제거
    }
    
    // Firebase에 전송 (다른 사용자들에게도 보이게)
    console.log('🔥 Firebase에 메시지 전송 시도');
    const chatRef = ref(database, 'live-feed/global-chat');
    push(chatRef, { 
      message, 
      timestamp: Date.now(),
      userAgent: navigator.userAgent.substring(0, 50),
      isMyMessage: false // 다른 사용자들에게는 내 메시지가 아님
    })
    .then(() => {
      console.log('✅ Firebase 전송 성공!');
    })
    .catch((error) => {
      console.error('❌ Firebase 전송 실패:', error);
      console.error('❌ 에러 상세:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // 에러 상황에서도 피드백
      addFlyingChatMessage('😅 메시지 전송에 실패했지만 로컬에서는 보여요!', false);
    });
    
    // 쿨다운 제거! 토큰 방식으로 변경
  };

  const canChat = chatTokens > 0; // 토큰이 있으면 채팅 가능
  const canGetTokenFromAd = adChatCooldown === 0; // 광고 쿨다운이 아니면 토큰 획득 가능

  return (
    <>
      {/* 접속 알림 */}
      <ConnectionNotification
        user={connectionNotification}
        isVisible={!!connectionNotification}
        onClose={() => setConnectionNotification(null)}
      />

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
          onComplete={(id) => removeFlyingMessage(id, 'chat')}
        />
      ))}

      {/* 채팅 버튼 - 중앙 하단으로 이동! */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
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
          💬 {canChat ? `메시지 보내기 (권한: ${chatTokens}개)` : '메시지 보내기 (권한없음)'}
        </button>
      </div>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={chatModal}
        onClose={() => setChatModal(false)}
        onSendMessage={handleSendChatMessage}
        remainingTime={adChatCooldown}
        canChat={canChat}
        chatTokens={chatTokens}
        onAdClick={handleAdClick}
        canGetTokenFromAd={canGetTokenFromAd}
      />
    </>
  );
};

export default FlyingMessageManager;