// 긴급 Firebase 권한 테스트
import { ref, set } from 'firebase/database';
import { database } from '../config/firebase.js';

export const emergencyPermissionTest = async () => {
  console.log('🚨 긴급 Firebase 권한 테스트 시작...');
  
  // 가장 단순한 경로에서 테스트
  const testPaths = [
    'emergency-test',
    'test',
    'debug',
    'temp'
  ];
  
  const results = [];
  
  for (const path of testPaths) {
    try {
      await set(ref(database, path), {
        test: true,
        timestamp: Date.now(),
        message: 'emergency test'
      });
      results.push({ path, status: '✅ 성공' });
      console.log(`✅ ${path} 경로 쓰기 성공!`);
    } catch (error) {
      results.push({ path, status: `❌ 실패: ${error.code}` });
      console.log(`❌ ${path} 경로 쓰기 실패:`, error.code);
    }
  }
  
  console.log('🚨 긴급 테스트 결과:', results);
  
  // 하나라도 성공하면 권한 문제가 아님
  const hasSuccess = results.some(r => r.status.includes('성공'));
  
  if (hasSuccess) {
    console.log('🎯 일부 경로에서 쓰기 성공 - 특정 경로 권한 문제');
  } else {
    console.log('🚨 모든 경로에서 실패 - 전체 권한 문제');
  }
  
  return results;
};

// 즉시 실행 가능하도록 전역 등록
if (typeof window !== 'undefined') {
  window.emergencyTest = emergencyPermissionTest;
}
