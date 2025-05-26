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
  const [chatCooldown, setChatCooldown] = useState(0);
  const [messageIdCounter, setMessageIdCounter] = useState(0);

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
        addFlyingChatMessage("여기 정말 중독성 있네요 ㅠㅠ");
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

  const addFlyingChatMessage = (message) => {
    const id = Date.now() + Math.random();
    setFlyingChatMessages(prev => [...prev, { id, message }]);
  };

  const removeFlyingMessage = (id, type) => {
    if (type === 'ranking') {
      setFlyingRankingMessages(prev => prev.filter(msg => msg.id !== id));
    } else if (type === 'chat') {
      setFlyingChatMessages(prev => prev.filter(msg => msg.id !== id));
    }
  };

  const handleSendChatMessage = (message) => {
    if (!database) {
      // Firebase가 없을 때 로컬로 테스트
      setTimeout(() => {
        addFlyingChatMessage(message);
      }, 1000);
      setChatCooldown(300000); // 5분 쿨다운
      return;
    }
    
    const chatRef = ref(database, 'live-feed/global-chat');
    push(chatRef, { 
      message, 
      timestamp: Date.now()
    });
    setChatCooldown(300000); // 5분 쿨다운
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
          onComplete={(id) => removeFlyingMessage(id, 'chat')}
        />
      ))}

      {/* 채팅 버튼 */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setChatModal(true)}
          disabled={!canChat}
          className={`pokemon-button ${!canChat ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={canChat ? "글로벌 메시지 보내기" : `${Math.ceil(chatCooldown / 1000)}초 후 사용 가능`}
        >
          💬 {canChat ? '메시지 보내기' : `${Math.ceil(chatCooldown / 60000)}분`}
        </button>
      </div>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={chatModal}
        onClose={() => setChatModal(false)}
        onSendMessage={handleSendChatMessage}
        remainingTime={chatCooldown}
      />
    </>
  );
};

export default FlyingMessageManager;