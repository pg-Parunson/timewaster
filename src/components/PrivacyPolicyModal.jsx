import React, { useState } from 'react';
import { X, Shield, Eye, Database, Mail, Calendar } from 'lucide-react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="pokemon-window max-w-4xl max-h-[90vh] mx-4 relative overflow-hidden">
        {/* 헤더 */}
        <div className="pokemon-stats flex justify-between items-center mb-0">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-yellow-300" />
            <h2 className="pokemon-font text-xl font-bold text-white">개인정보처리방침</h2>
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
            
            {/* 기본 정보 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                1. 개인정보 수집 및 이용
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="mb-2"><strong>수집 목적:</strong> 시간낭비 계산기 서비스 제공 및 개선</p>
                <p className="mb-2"><strong>수집 항목:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>IP 주소 (익명화하여 통계 목적)</li>
                  <li>사용자 생성 닉네임 (랭킹 시스템용)</li>
                  <li>채팅 메시지 (실시간 소통용)</li>
                  <li>사이트 이용 시간 (서비스 핵심 기능)</li>
                  <li>쿠키 및 로컬 스토리지 (사용자 환경 설정)</li>
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                  📌 <strong>개인 식별이 불가능한 정보만 수집</strong>하며, 이메일·전화번호 등 민감정보는 수집하지 않습니다.
                </p>
              </div>
            </section>

            {/* 이용 및 보관 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                2. 보관 및 이용 기간
              </h3>
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <ul className="space-y-2">
                  <li><strong>랭킹 데이터:</strong> 서비스 종료 시까지</li>
                  <li><strong>채팅 메시지:</strong> 실시간 표시 후 자동 삭제</li>
                  <li><strong>통계 데이터:</strong> 익명화 후 분석 목적으로 보관</li>
                  <li><strong>쿠키:</strong> 브라우저 설정에 따라 관리</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600">
                  🔄 사용자는 언제든지 브라우저 데이터 삭제를 통해 정보를 제거할 수 있습니다.
                </p>
              </div>
            </section>

            {/* 제3자 제공 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                3. 제3자 제공 및 위탁
              </h3>
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <p className="mb-3"><strong>제3자 서비스 이용:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Google Analytics:</strong> 익명화된 사용 통계 분석</li>
                  <li><strong>Google AdSense:</strong> 광고 서비스 제공</li>
                  <li><strong>Firebase:</strong> 실시간 데이터베이스 서비스</li>
                  <li><strong>쿠팡 파트너스:</strong> 제휴 광고 서비스</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600">
                  🛡️ 모든 제3자 서비스는 해당 업체의 개인정보처리방침을 따릅니다.
                </p>
              </div>
            </section>

            {/* 사용자 권리 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                4. 사용자 권리 및 선택
              </h3>
              <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <ul className="space-y-2">
                  <li><strong>쿠키 거부:</strong> 브라우저 설정에서 쿠키 사용 거부 가능</li>
                  <li><strong>광고 개인화 거부:</strong> Google 광고 설정에서 조정 가능</li>
                  <li><strong>데이터 삭제:</strong> 브라우저 데이터 삭제로 로컬 정보 제거</li>
                  <li><strong>서비스 이용 중단:</strong> 언제든지 사이트 이용 중단 가능</li>
                </ul>
              </div>
            </section>

            {/* 연락처 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-600" />
                5. 문의 및 연락처
              </h3>
              <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                <p className="mb-2"><strong>서비스 운영자:</strong> TimeTrash.net</p>
                <p className="mb-2"><strong>개인정보 문의:</strong> GitHub Issues 또는 사이트 내 피드백 시스템</p>
                <p className="text-sm text-gray-600">
                  📧 개인정보 관련 문의사항이 있으시면 언제든지 연락 주세요.
                </p>
              </div>
            </section>

            {/* 정책 변경 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3">6. 정책 변경 안내</h3>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <p className="mb-2">본 개인정보처리방침은 <strong>2025년 5월 31일</strong>부터 적용됩니다.</p>
                <p className="text-sm text-gray-600">
                  정책 변경 시 사이트 공지를 통해 사전 안내드리겠습니다.
                </p>
              </div>
            </section>

            {/* 푸터 */}
            <div className="text-center mt-8 pt-6 border-t-2 border-gray-200">
              <p className="text-sm text-gray-500">
                🎮 <strong>TimeTrash.net</strong> - 당신의 소중한 시간을 유쾌하게 낭비시켜드립니다
              </p>
              <p className="text-xs text-gray-400 mt-1">
                시간낭비도 책임감 있게! 개인정보도 안전하게! 
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
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;