import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { getRecommendedProduct, getRandomCoupangProduct } from '../data/coupangProducts'; // 🎯 랜덤 쿠팡 링크 import

// 포켓몬 스타일 광고 영역 컴포넌트 - 🐛 쿨다운 지원 추가
const AdSection = React.memo(({ showAd, adMessage, extremeMode, elapsedTime, onProductClick, adCooldownInfo = { cooldown: 0, canGetToken: true } }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const product = getRecommendedProduct(elapsedTime);

  // 광고 반짝거림 주기 관리 (10초 on → 1분 off)
  useEffect(() => {
    if (!showAd) return;
    
    const startBlinking = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 10000); // 10초 반짝거림
    };
    
    // 처음 시작
    startBlinking();
    
    // 1분 10초마다 반복 (10초 반짝 + 60초 휴식)
    const interval = setInterval(startBlinking, 70000);
    
    return () => clearInterval(interval);
  }, [showAd]);

  return (
    <div className="w-full">
      {showAd ? (
        <div className={`pokemon-dialog pokemon-hover ${isBlinking ? 'pokemon-ad-blink' : ''}`}>
          {/* 포켓몬 스타일 광고 메시지 */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />
            <span className="pokemon-font text-lg text-gray-800 text-center font-bold">
              {adMessage}
            </span>
            <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />
          </div>
          
          {/* 포켓몬 스타일 상품 버튼 - 🐛 쿨다운 지원 */}
          <div className="text-center">
            <button
              onClick={onProductClick}
              disabled={!adCooldownInfo.canGetToken} // 🐛 쿨다운 중일 때 비활성화
              className={`pokemon-button w-full transition-all duration-300 ${
                !adCooldownInfo.canGetToken ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                background: !adCooldownInfo.canGetToken 
                  ? 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)' // 쿨다운 중 회색
                  : `linear-gradient(135deg, ${product.color.includes('purple') ? '#9C27B0, #E91E63' : 
                                                      product.color.includes('blue') ? '#2196F3, #03DAC6' :
                                                      product.color.includes('green') ? '#4CAF50, #8BC34A' :
                                                      'var(--pokemon-gold), var(--pokemon-orange)'})`,
                minHeight: '80px'
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl">{adCooldownInfo.canGetToken ? product.icon : '⏰'}</div> {/* 🐛 쿨다운 중이면 시계 아이콘 */}
                <div className="pokemon-font font-bold text-black">
                  {adCooldownInfo.canGetToken ? product.name : '광고 쿨다운 중'}
                </div>
                <div className="pokemon-font text-sm text-black/80 leading-tight">
                  {adCooldownInfo.canGetToken 
                    ? product.description 
                    : `${Math.ceil(adCooldownInfo.cooldown / 1000)}초 후 다시 시도하세요`
                  }
                </div>
              </div>
            </button>
          </div>

          {/* 포켓몬 스타일 안내 메시지 - 🐛 쿨다운 정보 추가 */}
          <div className="mt-4 p-3 bg-blue-100 border-2 border-blue-400 rounded-lg">
            <div className="pokemon-font text-sm text-blue-800 text-center">
              {adCooldownInfo.canGetToken 
                ? '💡 시간을 낭비한 만큼 쇼핑도 해보세요!' 
                : `🕰️ 채팅 권한 쿨다운 중! ${Math.ceil(adCooldownInfo.cooldown / 1000)}초 후 다시 시도하세요`
              }
            </div>
          </div>
        </div>
      ) : (
        <div className="pokemon-dialog text-center">
          <div className="pokemon-font text-xl mb-4 text-red-800 font-bold">
            😤 아직 광고 볼 자격도 없어 돌아가! 😤
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <Clock className="w-12 h-12 text-red-400 animate-spin" style={{
              animationDuration: '3s'
            }} />
            <div className="pokemon-font text-red-600 font-bold">
              1분 더 낭비해야 광고 자격 획득!
            </div>
          </div>

          {/* 빈정거리는 메시지 */}
          <div className="mt-4 p-3 bg-red-100 border-2 border-red-400 rounded-lg animate-pulse">
            <div className="pokemon-font text-sm text-red-700 text-center font-bold">
              🚫 시간낭비 초보자는 광고 금지! 가서 더 낭비해와!
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdSection;