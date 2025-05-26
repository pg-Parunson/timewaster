import React from 'react';
import { Clock, Zap } from 'lucide-react';
import { getRecommendedProduct } from '../data/coupangProducts';

// 포켓몬 스타일 광고 영역 컴포넌트
const AdSection = React.memo(({ showAd, adMessage, extremeMode, elapsedTime, onProductClick }) => {
  const product = getRecommendedProduct(elapsedTime);

  return (
    <div className="w-full">
      {showAd ? (
        <div className={`pokemon-dialog pokemon-hover ${extremeMode ? 'pokemon-danger' : ''}`}>
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
          <div className="pokemon-font text-lg mb-4 text-gray-800">
            잠시만 기다려주세요...
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <Clock className="w-12 h-12 text-gray-400 animate-spin" style={{
              animationDuration: '3s'
            }} />
            <div className="pokemon-font text-gray-600">
              1분 후 특별한 상품이 나타납니다
            </div>
          </div>

          {/* 포켓몬 스타일 대기 메시지 */}
          <div className="mt-4 p-3 bg-gray-100 border-2 border-gray-400 rounded-lg">
            <div className="pokemon-font text-sm text-gray-700 text-center">
              ⏰ 시간을 더 낭비할수록 더 좋은 상품이 나와요!
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdSection;