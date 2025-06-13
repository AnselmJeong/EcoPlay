import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 게임 결과 타입 정의
export interface TrustGameResult {
  medicalRecordNumber: string;
  gameType: 'trust-game';
  role: 'trustor' | 'trustee';
  round: number;
  decision?: number; // trustor의 전송 금액 또는 trustee의 반환 금액
  receivedAmount?: number; // trustee가 받은 금액
  multipliedAmount?: number; // 3배로 증가된 금액
  responseTime: number; // 응답 시간 (밀리초)
  timestamp: Timestamp;
  sessionId: string; // 세션 식별자
  partnerId?: string; // 상대방 식별자 (실제 매칭 시 사용)
}

export interface PublicGoodsResult {
  medicalRecordNumber: string;
  gameType: 'public-goods';
  round: number;
  contribution: number; // 기여 금액
  groupTotal?: number; // 그룹 전체 기여 금액
  personalReturn?: number; // 개인 수익
  responseTime: number;
  timestamp: Timestamp;
  sessionId: string;
  groupId?: string; // 그룹 식별자
}

export interface ConsentData {
  medicalRecordNumber: string;
  consentGiven: boolean;
  consentTimestamp: Timestamp;
  consentDetails: {
    researchParticipation: boolean;
    dataCollection: boolean;
    dataSharing: boolean;
    contactPermission: boolean;
  };
}

// Firestore 컬렉션 이름
const COLLECTIONS = {
  TRUST_GAME: 'trust_game',
  PUBLIC_GOODS: 'public_goods_game',
  CONSENT: 'basic_info',
  QUESTIONNAIRE: 'questionnaire',
  SESSIONS: 'game_sessions'
} as const;

// 동의서 데이터 저장
export const saveConsentData = async (consentData: Omit<ConsentData, 'consentTimestamp'>) => {
  try {
    const basicInfoData = {
      user_id: consentData.medicalRecordNumber,
      user_email: `${consentData.medicalRecordNumber}@eco.play`,
      consent_given: consentData.consentGiven,
      consent_details: consentData.consentDetails,
      consent_timestamp: Timestamp.now(),
      created_at: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.CONSENT), basicInfoData);
    console.log('기본 정보 저장 완료:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('기본 정보 저장 오류:', error);
    throw new Error('기본 정보 저장에 실패했습니다.');
  }
};

// 신뢰 게임 결과 저장
export const saveTrustGameResult = async (gameResult: Omit<TrustGameResult, 'timestamp'>) => {
  try {
    // 라운드별 문서 생성
    const roundData = {
      round: gameResult.round,
      game_name: "trust game",
      game_began_at: Timestamp.now(),
      role: gameResult.role,
      decision: gameResult.decision,
      received_amount: gameResult.receivedAmount || 0,
      multiplied_amount: gameResult.multipliedAmount || 0,
      response_time: gameResult.responseTime,
      user_id: gameResult.medicalRecordNumber,
      user_email: `${gameResult.medicalRecordNumber}@eco.play`,
      session_id: gameResult.sessionId,
      partner_id: gameResult.partnerId || '',
      timestamp: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.TRUST_GAME), roundData);
    console.log('신뢰 게임 라운드 저장 완료:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('신뢰 게임 결과 저장 오류:', error);
    throw new Error('게임 결과 저장에 실패했습니다.');
  }
};

// 공공재 게임 결과 저장
export const savePublicGoodsResult = async (gameResult: Omit<PublicGoodsResult, 'timestamp'> & { otherDonations: number[] }) => {
  try {
    // 세션별 라운드 문서 생성
    const roundDocId = `round_${gameResult.round}`;
    
    // 컴퓨터 기여도 배열 생성 (4개의 봇)
    const computer_contributions = gameResult.otherDonations;
    
    const roundData = {
      round: gameResult.round,
      game_name: "public goods game",
      game_began_at: Timestamp.now(),
      human_contribution: gameResult.contribution,
      human_payoff: (gameResult.personalReturn || 0) - gameResult.contribution,
      computer_contributions: computer_contributions,
      response_time: gameResult.responseTime,
      user_id: gameResult.medicalRecordNumber,
      user_email: `${gameResult.medicalRecordNumber}@eco.play`,
      timestamp: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.PUBLIC_GOODS), roundData);
    console.log('공공재 게임 라운드 저장 완료:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('공공재 게임 결과 저장 오류:', error);
    throw new Error('게임 결과 저장에 실패했습니다.');
  }
};

// 특정 사용자의 공공재 게임 결과 조회 (10라운드)
export const getPublicGoodsHistory = async (medicalRecordNumber: string) => {
  try {
    console.log('공공재 게임 조회 시작, 사용자:', medicalRecordNumber);
    
    const q = query(
      collection(db, COLLECTIONS.PUBLIC_GOODS),
      where('user_id', '==', medicalRecordNumber)
      // orderBy를 제거하여 인덱스 문제 해결
    );
    
    const querySnapshot = await getDocs(q);
    console.log('공공재 게임 쿼리 결과:', querySnapshot.size, '개 문서');
    
    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('공공재 게임 문서 데이터:', data);
      return {
        round: data.round,
        donation: data.human_contribution,
        current_balance: data.human_payoff,
        partner_contribution: data.computer_contributions?.reduce((sum: number, val: number) => sum + val, 0) || 0,
        timestamp: data.timestamp
      };
    });
    
    // 클라이언트에서 정렬
    results.sort((a, b) => a.round - b.round);
    
    console.log('공공재 게임 최종 결과:', results);
    return results;
  } catch (error) {
    console.error('공공재 게임 조회 오류:', error);
    throw new Error('공공재 게임 결과 조회에 실패했습니다.');
  }
};

// 특정 사용자의 신뢰 게임 결과 조회 (역할별)
export const getTrustGameHistory = async (medicalRecordNumber: string, role: 'trustor' | 'trustee') => {
  try {
    console.log('신뢰 게임 조회 시작, 사용자:', medicalRecordNumber, '역할:', role);
    
    const q = query(
      collection(db, COLLECTIONS.TRUST_GAME),
      where('user_id', '==', medicalRecordNumber),
      where('role', '==', role)
      // orderBy를 제거하여 인덱스 문제 해결
    );
    
    const querySnapshot = await getDocs(q);
    console.log('신뢰 게임 쿼리 결과:', querySnapshot.size, '개 문서');
    
    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('신뢰 게임 문서 데이터:', data);
      
      if (role === 'trustor') {
        // trustor는 trustee 역할 (투자하는 사람)
        return {
          round: data.round,
          investment: data.decision,
          received_amount: data.received_amount,
          return_amount: data.decision, // 투자 금액
          current_balance: data.received_amount - data.decision, // 순수익
          timestamp: data.timestamp
        };
      } else {
        // trustee는 receiver 역할 (돌려주는 사람)
        return {
          round: data.round,
          investment: data.received_amount,
          received_amount: data.received_amount,
          return_amount: data.decision,
          current_balance: data.received_amount - data.decision, // 받은 것에서 돌려준 것 뺀 순수익
          timestamp: data.timestamp
        };
      }
    });
    
    // 클라이언트에서 정렬
    results.sort((a, b) => a.round - b.round);
    
    console.log('신뢰 게임 최종 결과:', results);
    return results;
  } catch (error) {
    console.error('신뢰 게임 조회 오류:', error);
    throw new Error('신뢰 게임 결과 조회에 실패했습니다.');
  }
};

// 특정 사용자의 게임 결과 조회
export const getUserGameResults = async (medicalRecordNumber: string) => {
  try {
    // 신뢰 게임 결과 조회
    const trustGameQuery = query(
      collection(db, COLLECTIONS.TRUST_GAME),
      where('user_id', '==', medicalRecordNumber),
      orderBy('timestamp', 'desc')
    );
    const trustGameSnapshot = await getDocs(trustGameQuery);
    const trustGameResults = trustGameSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 공공재 게임 결과 조회
    const publicGoodsQuery = query(
      collection(db, COLLECTIONS.PUBLIC_GOODS),
      where('user_id', '==', medicalRecordNumber),
      orderBy('timestamp', 'desc')
    );
    const publicGoodsSnapshot = await getDocs(publicGoodsQuery);
    const publicGoodsResults = publicGoodsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      trustGame: trustGameResults,
      publicGoods: publicGoodsResults
    };
  } catch (error) {
    console.error('게임 결과 조회 오류:', error);
    throw new Error('게임 결과 조회에 실패했습니다.');
  }
};

// 세션 ID 생성 (고유한 게임 세션 식별용)
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 게임 진행률 계산
export const getGameProgress = async (medicalRecordNumber: string) => {
  try {
    const results = await getUserGameResults(medicalRecordNumber);
    
    // 각 게임의 라운드 수 계산
    const trustGameRounds = results.trustGame.length;
    const publicGoodsRounds = results.publicGoods.length;
    
    // 예상 총 라운드 수 (설정에 따라 조정 가능)
    const expectedTrustRounds = 10;
    const expectedPublicGoodsRounds = 10;
    
    return {
      trustGame: {
        completed: trustGameRounds,
        total: expectedTrustRounds,
        percentage: Math.min((trustGameRounds / expectedTrustRounds) * 100, 100)
      },
      publicGoods: {
        completed: publicGoodsRounds,
        total: expectedPublicGoodsRounds,
        percentage: Math.min((publicGoodsRounds / expectedPublicGoodsRounds) * 100, 100)
      }
    };
  } catch (error) {
    console.error('게임 진행률 계산 오류:', error);
    throw new Error('게임 진행률 계산에 실패했습니다.');
  }
};

// 디버깅: 모든 데이터 구조 확인
export const debugGetAllData = async () => {
  try {
    console.log('=== 모든 데이터 조회 시작 ===');
    
    // Public Goods 전체 데이터 조회
    const pgQuery = query(collection(db, COLLECTIONS.PUBLIC_GOODS));
    const pgSnapshot = await getDocs(pgQuery);
    console.log('Public Goods 전체 문서 수:', pgSnapshot.size);
    
    const pgDocs = pgSnapshot.docs.slice(0, 5); // 최대 5개만 확인
    pgDocs.forEach((doc, index) => {
      console.log(`Public Goods 문서 ${index + 1}:`, doc.data());
    });
    
    // Trust Game 전체 데이터 조회
    const tgQuery = query(collection(db, COLLECTIONS.TRUST_GAME));
    const tgSnapshot = await getDocs(tgQuery);
    console.log('Trust Game 전체 문서 수:', tgSnapshot.size);
    
    const tgDocs = tgSnapshot.docs.slice(0, 5); // 최대 5개만 확인
    tgDocs.forEach((doc, index) => {
      console.log(`Trust Game 문서 ${index + 1}:`, doc.data());
    });
    
    // 모든 user_id 수집
    const allUserIds = new Set();
    pgSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.user_id) allUserIds.add(data.user_id);
    });
    tgSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.user_id) allUserIds.add(data.user_id);
    });
    
    console.log('Firebase에 저장된 모든 user_id:', Array.from(allUserIds));
    console.log('=== 모든 데이터 조회 완료 ===');
    
    return {
      publicGoodsCount: pgSnapshot.size,
      trustGameCount: tgSnapshot.size,
      allUserIds: Array.from(allUserIds)
    };
  } catch (error) {
    console.error('디버깅 데이터 조회 오류:', error);
    return null;
  }
};

// 특정 사용자의 동의서 데이터 확인
export const checkConsentData = async (medicalRecordNumber: string) => {
  try {
    console.log('동의서 데이터 확인 시작, 사용자:', medicalRecordNumber);
    
    const q = query(
      collection(db, COLLECTIONS.CONSENT),
      where('user_id', '==', medicalRecordNumber)
    );
    
    const querySnapshot = await getDocs(q);
    console.log('동의서 쿼리 결과:', querySnapshot.size, '개 문서');
    
    if (querySnapshot.size > 0) {
      const consentData = querySnapshot.docs[0].data();
      console.log('동의서 데이터:', consentData);
      
      return {
        exists: true,
        consentGiven: consentData.consent_given,
        consentTimestamp: consentData.consent_timestamp,
        consentDetails: consentData.consent_details
      };
    }
    
    return {
      exists: false,
      consentGiven: false,
      consentTimestamp: null,
      consentDetails: null
    };
  } catch (error) {
    console.error('동의서 데이터 확인 오류:', error);
    throw new Error('동의서 데이터 확인에 실패했습니다.');
  }
}; 