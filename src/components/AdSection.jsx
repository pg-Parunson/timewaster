import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { getRecommendedProduct, getRandomCoupangProduct } from '../data/coupangProducts'; // 🎯 랜덤 쿠팡 링크 import

// 포켓몬 스타일 광고 영역 컴포넌트
const AdSection = React.memo(({ showAd, adMessage, extremeMode, elapsedTime, onProductClick }) => {
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
          
          {/* 포켓몬 스타일 상품 버튼 */}
          <div className="text-center">
            <button
              onClick={onProductClick}
              className="pokemon-button w-full"
              style={{
                background: `linear-gradient(135deg, ${product.color.includes('purple') ? '#9C27B0, #E91E63' : 
                                                      product.color.includes('blue') ? '#2196F3, #03DAC6' :
                                                      product.color.includes('green') ? '#4CAF50, #8BC34A' :
                                                      'var(--pokemon-gold), var(--pokemon-orange)'})`,
                minHeight: '80px'
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl">{product.icon}</div>
                <div className="pokemon-font font-bold text-black">{product.name}</div>
                <div className="pokemon-font text-sm text-black/80 leading-tight">
                  {product.description}
                </div>
              </div>
            </button>
          </div>

          {/* 포켓몬 스타일 안내 메시지 */}
          <div className="mt-4 p-3 bg-blue-100 border-2 border-blue-400 rounded-lg">
            <div className="pokemon-font text-sm text-blue-800 text-center">
              💡 시간을 낭비한 만큼 쇼핑도 해보세요!
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