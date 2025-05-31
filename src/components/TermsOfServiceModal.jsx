import React from 'react';
import { X, FileText, AlertTriangle, Clock, Users, Zap } from 'lucide-react';

const TermsOfServiceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="pokemon-window max-w-4xl max-h-[90vh] mx-4 relative overflow-hidden">
        {/* 헤더 */}
        <div className="pokemon-stats flex justify-between items-center mb-0">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-yellow-300" />
            <h2 className="pokemon-font text-xl font-bold text-white">서비스 이용약관</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-300 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 스크롤 가능한 본문 */}
        <div className="pokemon-dialog max-h-[70vh] overflow-y-auto">
          <div className="pokemon-font text-sm leading-relaxed space-y-6">
            
            {/* 서비스 소개 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                1. 서비스 소개
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="mb-2"><strong>TimeTrash.net (시간낭비 계산기)</strong>는 사용자의 시간 소비를 유쾌하게 추적하고 재미있는 경험을 제공하는 웹 서비스입니다.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>실시간 시간 추적 및 색상 변화 타이머</li>
                  <li>글로벌 실시간 채팅 시스템</li>
                  <li>TOP 20 랭킹 시스템</li>
                  <li>배경음악 및 축하 이펙트</li>
                  <li>제휴 광고 서비스</li>
                </ul>
              </div>
            </section>

            {/* 이용 규칙 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                2. 이용 규칙
              </h3>
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <p className="mb-3"><strong>허용되는 행위:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
                  <li>서비스의 의도된 방식대로 시간낭비하기</li>
                  <li>건전한 채팅 메시지 작성</li>
                  <li>랭킹 경쟁 참여</li>
                  <li>친구들과 사이트 공유</li>
                </ul>
                
                <p className="mb-3"><strong className="text-red-600">금지되는 행위:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>욕설, 혐오 발언, 성희롱 등 부적절한 채팅</li>
                  <li>광고, 스팸, 도배성 메시지</li>
                  <li>서비스 방해 또는 악용</li>
                  <li>다른 사용자 괴롭히기</li>
                  <li>불법적인 내용 공유</li>
                </ul>
              </div>
            </section>

            {/* 서비스 제한 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                3. 서비스 제한 및 책임
              </h3>
              <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <p className="mb-3"><strong>서비스 제한:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
                  <li>서비스는 무료로 제공되며, 중단될 수 있습니다</li>
                  <li>데이터 손실에 대한 책임을 지지 않습니다</li>
                  <li>서버 점검 등으로 일시적 중단이 있을 수 있습니다</li>
                </ul>
                
                <p className="mb-3"><strong>사용자 책임:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>과도한 시간 사용으로 인한 모든 결과는 사용자 책임</li>
                  <li>채팅 내용에 대한 법적 책임은 작성자에게 있음</li>
                  <li>타인의 권리 침해 시 사용자가 책임짐</li>
                </ul>
              </div>
            </section>

            {/* 광고 및 제휴 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                4. 광고 및 제휴 서비스
              </h3>
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <ul className="space-y-2">
                  <li><strong>Google AdSense:</strong> 개인화된 광고가 표시될 수 있습니다</li>
                  <li><strong>쿠팡 파트너스:</strong> 제휴 링크를 통한 상품 추천</li>
                  <li><strong>광고 수익:</strong> 사이트 운영비로 사용됩니다</li>
                  <li><strong>광고 차단:</strong> 광고 차단기 사용은 허용되나 서비스 품질에 영향을 줄 수 있습니다</li>
                </ul>
              </div>
            </section>

            {/* 지적재산권 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3">5. 지적재산권</h3>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <ul className="space-y-2">
                  <li><strong>서비스 콘텐츠:</strong> TimeTrash.net의 독창적 콘텐츠입니다</li>
                  <li><strong>사용자 콘텐츠:</strong> 채팅 메시지 등은 작성자에게 권리가 있습니다</li>
                  <li><strong>오픈소스:</strong> 일부 기술은 오픈소스 라이선스를 따릅니다</li>
                  <li><strong>폰트:</strong> Galmuri 폰트 등 제3자 리소스는 해당 라이선스를 따릅니다</li>
                </ul>
              </div>
            </section>

            {/* 약관 변경 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3">6. 약관 변경</h3>
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="mb-2">본 이용약관은 <strong>2025년 5월 31일</strong>부터 적용됩니다.</p>
                <p className="mb-2">약관 변경 시 사이트 내 공지를 통해 사전 안내합니다.</p>
                <p className="text-sm text-gray-600">
                  변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하시기 바랍니다.
                </p>
              </div>
            </section>

            {/* 재미있는 면책 조항 */}
            <section className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
              <h3 className="text-lg font-bold text-gray-800 mb-3">⚠️ 특별 면책 조항</h3>
              <div className="text-sm space-y-2">
                <p><strong>🕒 시간 낭비 관련:</strong> 본 사이트에서 낭비한 시간에 대해 책임지지 않습니다. 애초에 시간낭비가 목적인 사이트입니다.</p>
                <p><strong>🤦‍♂️ 생산성 저하:</strong> 본 사이트 이용 후 발생하는 생산성 저하, 업무 지연, 학습 방해 등에 대해 책임지지 않습니다.</p>
                <p><strong>😅 중독성:</strong> 본 사이트의 중독성에 대해 경고드리며, 적당한 이용을 권장합니다.</p>
                <p><strong>🤔 실존적 고민:</strong> "내가 지금 뭘 하고 있는 거지?"라는 생각이 드는 것은 정상입니다.</p>
              </div>
            </section>

            {/* 푸터 */}
            <div className="text-center mt-8 pt-6 border-t-2 border-gray-200">
              <p className="text-sm text-gray-500">
                🎮 <strong>TimeTrash.net</strong> - 시간낭비의 새로운 패러다임
              </p>
              <p className="text-xs text-gray-400 mt-1">
                "시간은 금이다. 그런데 우리는 파산 전문가다." 
              </p>
            </div>
          </div>
        </div>

        {/* 확인 버튼 */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="pokemon-button"
          >
            동의하고 계속 시간낭비하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;