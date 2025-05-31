// StatsService 권한 문제 전용 디버깅
import { ref, set, get, increment } from 'firebase/database';
import { database } from '../config/firebase.js';

export const statsServiceDebugger = {
  // global-stats 경로 권한 테스트
  async testGlobalStatsPermissions() {
    console.log('🔍 global-stats 경로 권한 테스트 시작...');
    
    const tests = [
      {
        name: 'global-stats 읽기',
        test: async () => {
          const statsRef = ref(database, 'global-stats');
          const snapshot = await get(statsRef);
          return { success: true, data: snapshot.val() };
        }
      },
      {
        name: 'global-stats/totalVisits 쓰기',
        test: async () => {
          const visitsRef = ref(database, 'global-stats/totalVisits');
          await set(visitsRef, 999);
          return { success: true };
        }
      },
      {
        name: 'global-stats/totalTimeWasted increment',
        test: async () => {
          const timeRef = ref(database, 'global-stats/totalTimeWasted');
          await set(timeRef, increment(1));
          return { success: true };
        }
      },
      {
        name: 'global-stats 전체 객체 쓰기',
        test: async () => {
          const statsRef = ref(database, 'global-stats');
          await set(statsRef, {
            totalVisits: 100,
            totalTimeWasted: 500,
            lastUpdated: Date.now()
          });
          return { success: true };
        }
      }
    ];

    const results = [];
    
    for (const { name, test } of tests) {
      try {
        const result = await test();
        results.push({ name, status: '✅ 성공', data: result });
        console.log(`✅ ${name}: 성공`);
      } catch (error) {
        results.push({ name, status: `❌ 실패: ${error.code}`, error: error.message });
        console.log(`❌ ${name}: ${error.code}`);
      }
    }

    console.log('📊 global-stats 권한 테스트 결과:', results);
    return results;
  },

  // 실제 statsService 메소드들 직접 테스트
  async testStatsServiceMethods() {
    console.log('🧪 StatsService 메소드 직접 테스트...');
    
    // statsService import
    const { statsService } = await import('../services/statsService.jsx');
    
    const tests = [
      {
        name: 'incrementVisits()',
        test: async () => {
          const result = await statsService.incrementVisits();
          return { visits: result };
        }
      },
      {
        name: 'addTimeWasted(60)',
        test: async () => {
          const result = await statsService.addTimeWasted(60);
          return { totalTime: result };
        }
      },
      {
        name: 'getGlobalStats()',
        test: async () => {
          const result = await statsService.getGlobalStats();
          return result;
        }
      },
      {
        name: 'getActiveSessions()',
        test: async () => {
          const result = await statsService.getActiveSessions();
          return { activeSessions: result };
        }
      }
    ];

    const results = [];
    
    for (const { name, test } of tests) {
      try {
        const result = await test();
        results.push({ name, status: '✅ 성공', data: result });
        console.log(`✅ ${name}:`, result);
      } catch (error) {
        results.push({ name, status: `❌ 실패: ${error.code}`, error: error.message });
        console.log(`❌ ${name}: ${error.code} - ${error.message}`);
      }
    }

    console.log('🔧 StatsService 메소드 테스트 결과:', results);
    return results;
  }
};

// 전역 접근
if (typeof window !== 'undefined') {
  window.debugStats = statsServiceDebugger;
}
