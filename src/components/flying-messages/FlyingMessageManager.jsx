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
  const [chatCooldown, setChatCooldown] = useState(60000); // 처음에는 1분 쿨다운으로 시작
  const [messageIdCounter, setMessageIdCounter] = useState(0);
  const [totalTimeWasted, setTotalTimeWasted] = useState(0); // 총 체류 시간 추적

  // 체류 시간 추적 (1초마다 업데이트)
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimeWasted(prev => prev + 1);
      
      // 1분(60초)마다 채팅 권한 부여
      if (totalTimeWasted > 0 && totalTimeWasted % 60 === 0 && chatCooldown > 0) {
        setChatCooldown(0); // 채팅 권한 부여!
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [totalTimeWasted, chatCooldown]);

  // 5분마다 채팅 권한 복구
  useEffect(() => {
    if (chatCooldown > 0) {
      const timer = setInterval(() => {
        setChatCooldown(prev => Math.max(0, prev - 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [chatCooldown]);

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

    // 글로벌 채팅 메시지
    const unsubscribeChat = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const latestChat = Object.values(data).sort((a, b) => b.timestamp - a.timestamp)[0];
        if (latestChat && Date.now() - latestChat.timestamp < 5000) {
          addFlyingChatMessage(latestChat.message);
        }
      }
    });

    return () => {
      off(connectionsRef);
      off(rankingRef);
      off(chatRef);
    };
  }, []);

  const addFlyingRankingMessage = (message) => {
    const id = Date.now() + Math.random();
    setFlyingRankingMessages(prev => [...prev, { id, message }]);
  };

  const addFlyingChatMessage = (message, isMyMessage = false) => {
    const id = Date.now() + Math.random();
    setFlyingChatMessages(prev => [...prev, { id, message, isMyMessage }]);
  };

  const removeFlyingMessage = (id, type) => {
    if (type === 'ranking') {
      setFlyingRankingMessages(prev => prev.filter(msg => msg.id !== id));
    } else if (type === 'chat') {
      setFlyingChatMessages(prev => prev.filter(msg => msg.id !== id));
    }
  };

  const handleSendChatMessage = (message) => {
    // 내 메시지를 화면에 날아가게 표시 (내 메시지 표시)
    setTimeout(() => {
      addFlyingChatMessage(message, true); // isMyMessage = true
    }, 500); // 0.5초 후 날아가게
    
    if (!database) {
      // Firebase가 없을 때는 로컬로만 테스트
      setChatCooldown(60000); // 1분 쿨다운
      return;
    }
    
    // Firebase에 전송 (다른 사용자들에게도 보이게)
    const chatRef = ref(database, 'live-feed/global-chat');
    push(chatRef, { 
      message, 
      timestamp: Date.now()
    });
    setChatCooldown(60000); // 1분 쿨다운
  };

  const canChat = chatCooldown === 0;

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

      {/* 채팅 버튼 */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setChatModal(true)}
          disabled={false} // 모달은 항상 열 수 있게 하고, 모달 내에서 제한
          className="pokemon-button"
          title={canChat ? "글로벌 메시지 보내기" : `메시지 권한은 1분 체류 후 부여됩니다`}
        >
          💬 {canChat ? '메시지 보내기' : `메시지 (권한대기중)`}
        </button>
      </div>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={chatModal}
        onClose={() => setChatModal(false)}
        onSendMessage={handleSendChatMessage}
        remainingTime={chatCooldown}
        canChat={canChat}
      />
    </>
  );
};

export default FlyingMessageManager;