// Firebase 권한 테스트 및 디버깅 도구
import { ref, set, get, push } from 'firebase/database';
import { database } from '../config/firebase.js';

export const firebasePermissionTest = {
  // 🔥 권한 테스트 - 다양한 경로에서 시도
  async testAllPermissions() {
    const testResults = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    // 1. 루트 경로 테스트
    try {
      await set(ref(database, 'test-write'), { test: true, time: Date.now() });
      testResults.tests.push({ path: 'test-write', result: '✅ 성공' });
    } catch (error) {
      testResults.tests.push({ path: 'test-write', result: `❌ 실패: ${error.code}` });
    }

    // 2. sessions 경로 테스트  
    try {
      const testSessionRef = ref(database, 'sessions/test-session');
      await set(testSessionRef, {
        sessionId: 'test-123',
        anonymousName: '테스트사용자',
        startTime: Date.now()
      });
      testResults.tests.push({ path: 'sessions/test-session', result: '✅ 성공' });
    } catch (error) {
      testResults.tests.push({ path: 'sessions/test-session', result: `❌ 실패: ${error.code}` });
    }

    // 3. global-stats 경로 테스트
    try {
      await set(ref(database, 'global-stats/test'), { value: 1 });
      testResults.tests.push({ path: 'global-stats/test', result: '✅ 성공' });
    } catch (error) {
      testResults.tests.push({ path: 'global-stats/test', result: `❌ 실패: ${error.code}` });
    }

    // 4. live-feed 경로 테스트
    try {
      const feedRef = ref(database, 'live-feed');
      const newFeedRef = push(feedRef);
      await set(newFeedRef, {
        type: 'test',
        message: '권한 테스트',
        timestamp: Date.now()
      });
      testResults.tests.push({ path: 'live-feed', result: '✅ 성공' });
    } catch (error) {
      testResults.tests.push({ path: 'live-feed', result: `❌ 실패: ${error.code}` });
    }

    console.log('🔥 Firebase 권한 테스트 결과:', testResults);
    return testResults;
  },

  // 🔍 현재 규칙 확인 (읽기 전용)
  async checkCurrentRules() {
    try {
      // 규칙은 직접 읽을 수 없지만, 다양한 경로 읽기로 구조 파악
      const paths = [
        'sessions',
        'global-stats', 
        'live-feed',
        'rankings'
      ];

      const results = {};
      
      for (const path of paths) {
        try {
          const snapshot = await get(ref(database, path));
          results[path] = {
            exists: snapshot.exists(),
            hasData: snapshot.exists() && snapshot.val() !== null,
            readable: true
          };
        } catch (error) {
          results[path] = {
            exists: false,
            hasData: false,
            readable: false,
            error: error.code
          };
        }
      }

      console.log('🔍 Firebase 경로별 읽기 권한 체크:', results);
      return results;
    } catch (error) {
      console.error('❌ 규칙 확인 실패:', error);
      return null;
    }
  }
};

// 전역에서 테스트 실행 가능하도록 등록
if (typeof window !== 'undefined') {
  window.firebaseTest = firebasePermissionTest;
}
