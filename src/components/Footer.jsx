import React, { useState } from 'react';
import { Shield, FileText, Github, Mail, Heart } from 'lucide-react';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsOfServiceModal from './TermsOfServiceModal';

const Footer = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <>
      {/* 푸터 */}
      <footer className="pokemon-dialog mt-8 text-center">
        <div className="pokemon-font text-sm space-y-4">
          
          {/* 링크들 */}
          <div className="flex flex-wrap justify-center gap-4 text-gray-600">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Shield className="w-4 h-4" />
              개인정보처리방침
            </button>
            
            <button
              onClick={() => setShowTermsModal(true)}
              className="flex items-center gap-1 hover:text-green-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              이용약관
            </button>
            
            <a
              href="https://github.com/pg-Parunson/timewaster"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-purple-600 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* 구분선 */}
          <div className="border-t-2 border-gray-200 pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span>© 2025 TimeTrash.net</span>
                <Heart className="w-3 h-3 text-red-400" />
                <span>시간낭비의 새로운 패러다임</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span>v2.8.0</span>
                <span>•</span>
                <span>React + Firebase</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Contact via GitHub
                </span>
              </div>
            </div>
          </div>

          {/* 재미있는 메시지 */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 text-yellow-800">
            <p className="text-sm">
              🎯 <strong>AdSense 승인 대기 중!</strong> 곧 더 많은 광고로 여러분의 시간낭비를 도와드리겠습니다 😄
            </p>
          </div>
        </div>
      </footer>

      {/* 모달들 */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
      <TermsOfServiceModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
    </>
  );
};

export default Footer;