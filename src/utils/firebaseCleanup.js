// 🧹 Firebase 데이터베이스 초기화 스크립트
// 런칭 전 테스트 데이터 정리용

import { ref, set, remove, get } from 'firebase/database';
import { database } from '../config/firebase.js';

export const firebaseCleanup = {
  // 🗑️ 모든 테스트 데이터 삭제
  async clearAllTestData() {
    const confirmation = confirm(
      '⚠️ 경고: 모든 Firebase 데이터가 삭제됩니다!\n\n' +
      '이 작업은 되돌릴 수 없습니다.\n' +
      '- 모든 사용자 세션\n' +
      '- 모든 채팅 메시지\n' +
      '- 모든 랭킹 데이터\n' +
      '- 라이브 피드 이벤트\n\n' +
      '정말로 계속하시겠습니까?'
    );
    
    if (!confirmation) {
      console.log('❌ 데이터 정리가 취소되었습니다.');
      return false;
    }

    const secondConfirmation = confirm(
      '🚨 최종 확인!\n\n' +
      'Firebase의 모든 데이터를 삭제합니다.\n' +
      '이 작업은 되돌릴 수 없습니다!\n\n' +
      '정말 확실하신가요?'
    );

    if (!secondConfirmation) {
      console.log('❌ 데이터 정리가 최종 취소되었습니다.');
      return false;
    }

    try {
      console.log('🧹 Firebase 데이터 정리 시작...');

      // 1. 모든 세션 데이터 삭제
      console.log('1️⃣ 세션 데이터 삭제 중...');
      await remove(ref(database, 'sessions'));

      // 2. 모든 채팅 데이터 삭제  
      console.log('2️⃣ 채팅 데이터 삭제 중...');
      await remove(ref(database, 'chats'));

      // 3. 라이브 피드 데이터 삭제
      console.log('3️⃣ 라이브 피드 데이터 삭제 중...');
      await remove(ref(database, 'live-feed'));

      // 4. 전체 통계 초기화 (삭제하지 말고 0으로 리셋)
      console.log('4️⃣ 전체 통계 초기화 중...');
      await set(ref(database, 'global-stats'), {
        totalVisits: 0,
        totalTimeWasted: 0,
        lastUpdated: Date.now()
      });

      // 5. 기타 테스트 경로들 삭제
      console.log('5️⃣ 기타 테스트 데이터 삭제 중...');
      const testPaths = [
        'emergency-test',
        'test',
        'debug',
        'temp'
      ];

      for (const path of testPaths) {
        try {
          await remove(ref(database, path));
        } catch (error) {
          // 경로가 없어도 무시
        }
      }

      console.log('✅ Firebase 데이터 정리 완료!');
      console.log('🚀 이제 깨끗한 상태에서 런칭할 수 있습니다!');
      
      return true;
    } catch (error) {
      console.error('❌ 데이터 정리 중 오류 발생:', error);
      return false;
    }
  },

  // 📊 현재 데이터 상태 확인 (권한 문제 대응)
  async checkDataStatus() {
    try {
      console.log('📊 현재 Firebase 데이터 상태 확인 중...');
      
      const results = {
        sessions: 0,
        chats: 0, 
        feed: 0,
        stats: null,
        total: 0,
        errors: []
      };

      // 각 경로별로 개별 확인 (권한 오류 개별 처리)
      const pathsToCheck = [
        { name: 'sessions', path: 'sessions' },
        { name: 'chats', path: 'chats' },
        { name: 'feed', path: 'live-feed' },
        { name: 'stats', path: 'global-stats' }
      ];

      for (const { name, path } of pathsToCheck) {
        try {
          const snapshot = await get(ref(database, path));
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (name === 'stats') {
              results.stats = data;
            } else {
              results[name] = typeof data === 'object' ? Object.keys(data).length : 0;
            }
          }
          console.log(`✅ ${name}: 확인 완료`);
        } catch (error) {
          console.log(`❌ ${name}: 권한 없음 (${error.code})`);
          results.errors.push(`${name}: ${error.code}`);
        }
      }

      results.total = results.sessions + results.chats + results.feed;

      console.log('📊 데이터 현황 (확인 가능한 것만):');
      console.log(`- 세션 데이터: ${results.sessions}개`);
      console.log(`- 채팅 메시지: ${results.chats}개`);
      console.log(`- 라이브 피드: ${results.feed}개`);
      console.log('- 전체 통계:', results.stats);
      
      if (results.errors.length > 0) {
        console.log('⚠️ 권한 오류 발생:', results.errors);
        console.log('💡 해결 방법:');
        console.log('1. Firebase 콘솔에서 직접 확인/삭제');
        console.log('2. 보안 규칙 임시 완화 후 정리');
      }

      if (results.total === 0 && results.errors.length === 0) {
        console.log('✨ 데이터베이스가 깨끗합니다! 런칭 준비 완료!');
      } else if (results.total > 0) {
        console.log(`⚠️ 총 ${results.total}개의 테스트 데이터가 있습니다.`);
      }

      return results;
    } catch (error) {
      console.error('❌ 전체 데이터 상태 확인 실패:', error.code || error.message);
      console.log('💡 대안: Firebase 콘솔에서 직접 확인하세요.');
      console.log('🔗 https://console.firebase.google.com');
      return null;
    }
  },

  // 🎯 선택적 데이터 정리 (필요한 경우)
  async clearSpecificData(dataType) {
    const confirmMessage = `'${dataType}' 데이터를 삭제하시겠습니까?`;
    
    if (!confirm(confirmMessage)) {
      console.log('❌ 작업이 취소되었습니다.');
      return false;
    }

    try {
      switch (dataType) {
        case 'sessions':
          await remove(ref(database, 'sessions'));
          console.log('✅ 세션 데이터 삭제 완료');
          break;
        case 'chats':
          await remove(ref(database, 'chats'));
          console.log('✅ 채팅 데이터 삭제 완료');
          break;
        case 'feed':
          await remove(ref(database, 'live-feed'));
          console.log('✅ 라이브 피드 데이터 삭제 완료');
          break;
        case 'stats':
          await set(ref(database, 'global-stats'), {
            totalVisits: 0,
            totalTimeWasted: 0,
            lastUpdated: Date.now()
          });
          console.log('✅ 전체 통계 초기화 완료');
          break;
        default:
          console.log('❌ 알 수 없는 데이터 타입:', dataType);
          return false;
      }
      return true;
    } catch (error) {
      console.error('❌ 데이터 삭제 중 오류:', error);
      return false;
    }
  }
};

// 브라우저 콘솔에서 사용할 수 있도록 전역 등록
if (typeof window !== 'undefined') {
  window.firebaseCleanup = firebaseCleanup;
}

export default firebaseCleanup;
