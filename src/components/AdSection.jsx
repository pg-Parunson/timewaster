import React from 'react';
import { Clock, Zap } from 'lucide-react';
import { getRecommendedProduct } from '../data/coupangProducts';

// 광고 영역 컴포넌트 - React.memo로 최적화
const AdSection = React.memo(({ showAd, adMessage, extremeMode, elapsedTime, onProductClick }) => {
  const product = getRecommendedProduct(elapsedTime);

  return (
    <div className="w-full" style={{ position: 'relative', zIndex: 1, contain: 'layout' }}>
      {showAd ? (
        <div className={`bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur border border-yellow-500/30 rounded-2xl p-4 h-full flex flex-col justify-center ${
          extremeMode ? 'animate-pulse' : ''
        }`} style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
            <span className="text-yellow-200 font-medium text-center text-sm leading-tight">{adMessage}</span>
            <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={onProductClick}
              className={`bg-gradient-to-r ${product.color} hover:opacity-90 text-white font-bold px-4 py-3 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg w-full text-sm`}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="text-lg">{product.icon}</div>
                <div className="font-semibold">{product.name}</div>
                <div className="text-xs opacity-90 leading-tight">{product.description}</div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 h-full flex items-center justify-center" style={{ position: 'relative' }}>
          <div className="text-center text-white/50">
            <Clock className="w-8 h-8 mx-auto mb-2 animate-spin-slow" />
            <p className="text-sm">1분 후 광고가 나타납니다</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdSection;
