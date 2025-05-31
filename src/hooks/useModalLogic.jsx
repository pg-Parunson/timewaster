import { useState } from 'react';
import { storage } from '../utils/storage';
import { analytics } from '../utils/analytics';
import { getRecommendedProduct, getRandomCoupangProduct } from '../data/coupangProducts'; // 🎯 랜덤 쿠팡 링크 import
import { rankingService } from '../services/rankingService.jsx';

// 모달 및 사용자 액션 관리 훅
export const useModalLogic = ({
  elapsedTime,
  adClicks,
  setAdClicks,
  totalTimeWasted,
  visits,
  isRankingInitialized,
  currentUser,
  // 🎆 채팅 권한 시스템 연동
  premiumTokens,
  setPremiumTokens,
  // 🔰 광고 쿨다운 시스템 연동
  adCooldownInfo,
  setAdCooldownInfo
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [showRankingModal, setShowRankingModal] = useState(false);

  // 세련된 모달 표시 함수
  const showModernModal = (title, message, type = 'info', showCancel = false) => {
    setModalConfig({ title, message, type, showCancel });
    setShowModal(true);
  };

  // 활동 선택 핸들러
  const handleActivitySelect = (activity) => {
    console.log('🎯 사용자가 활동을 선택했습니다:', activity);
    
    if (activity === 'start_activity') {
      showModernModal(
        '🚀 대단해요!',
        '드디어 생산적인 일을 시작하시는군요! 이 의지를 계속 유지해보세요. 아니면... 조금 더 여기 있어도 괜찮아요 😏',
        'success'
      );
    } else {
      showModernModal(
        '✨ 훌륭한 선택!',
        `"${activity}" 정말 좋은 아이디어네요! 지금 당장 시작해보세요. 더 늦기 전에 말이에요...`,
        'info'
      );
      
      analytics.trackActivitySelect(activity, elapsedTime);
    }
  };

  // 쿠팡 상품 클릭
  const handleProductClick = () => {
    // 🔰 쿨다운 체크 - 쿨다운 중이면 권한 지급 안함
    if (!adCooldownInfo.canGetToken) {
      showModernModal(
        "🕰️ 쿨다운 중!", 
        `아직 ${Math.ceil(adCooldownInfo.cooldown / 1000)}초 남았어요! 조금만 기다리세요`, 
        'warning'
      );
      return;
    }
    
    const product = getRecommendedProduct(elapsedTime); // 🎯 표시된 상품과 동일한 상품 선택
    
    analytics.trackCoupangClick(product.name, product.category, elapsedTime, adClicks + 1);
    
    window.open(product.url, '_blank');
    
    // 🎆 프리미엄 채팅 권한 지급!
    if (setPremiumTokens) {
      setPremiumTokens(prev => prev + 1);
    }
    
    // 🔰 30초 쿨다운 설정
    if (setAdCooldownInfo) {
      setAdCooldownInfo({
        cooldown: 30000, // 30초 (30,000ms)
        canGetToken: false
      });
    }
    
    const responses = [
      `${product.icon} ${product.name} 좋은 선택이에요! 🎆 프리미엄 채팅 권한 지급!`,
      `훌륭해요! ${product.category} 분야 투자는 언제나 옳습니다!`,
      `${product.name}로 시간낭비를 생산적으로 만드셨네요!`,
      `감사합니다! ${product.category} 상품 클릭으로 사이트를 후원해주셨어요!`,
      `완벽한 선택! ${product.name}은 정말 추천하는 아이템이에요!`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    showModernModal("쿠팡 파트너스 클릭!", randomResponse, 'success');
    
    const newAdClicks = storage.incrementAdClicks();
    setAdClicks(newAdClicks);
  };

  // 종료 확인
  const handleExit = () => {
    setShowRankingModal(true);
  };

  const handleRankingModalClose = () => {
    // 더 시간을 낭비하고 싶어요 버튼을 눌렀을 때는 바로 돌아가기
    setShowRankingModal(false);
    // 추가 확인 모달 없이 바로 게임으로 복귀
  };

  const handleRankingModalExit = () => {
    // ESC나 실제 종료 버튼을 눌렀을 때만 확인 모달 표시
    setShowRankingModal(false);
    showModernModal(
      "현실로 돌아가시겠습니까?",
      "정말로 이 환상적인 시간낭비를 끝내시겠습니까? 지금까지의 모든 노력이 물거품이 될 수 있어요!",
      'exit',
      true
    );
  };

  const confirmExit = () => {
    analytics.trackExit(elapsedTime);
    storage.updateTotalTimeWasted(elapsedTime);
    
    setShowModal(false);
    setShowRankingModal(false);
    
    if (isRankingInitialized) {
      rankingService.endSession();
    }
    
    setTimeout(() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.reload();
      }
    }, 100);
  };

  return {
    // 상태들
    showModal,
    modalConfig,
    showRankingModal,
    
    // 함수들
    showModernModal,
    handleActivitySelect,
    handleProductClick,
    handleExit,
    handleRankingModalClose,
    handleRankingModalExit,
    confirmExit,
    
    // 세터들
    setShowModal,
    setShowRankingModal
  };
};
