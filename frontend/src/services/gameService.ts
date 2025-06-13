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

// 특정 사용자의 게임 결과 조회
export const getUserGameResults = async (medicalRecordNumber: string) => {
  try {
    // 신뢰 게임 결과 조회
    const trustGameQuery = query(
      collection(db, COLLECTIONS.TRUST_GAME),
      where('medicalRecordNumber', '==', medicalRecordNumber),
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
      where('medicalRecordNumber', '==', medicalRecordNumber),
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
        percentage: Math.round((trustGameRounds / expectedTrustRounds) * 100)
      },
      publicGoods: {
        completed: publicGoodsRounds,
        total: expectedPublicGoodsRounds,
        percentage: Math.round((publicGoodsRounds / expectedPublicGoodsRounds) * 100)
      },
      overall: {
        completed: trustGameRounds + publicGoodsRounds,
        total: expectedTrustRounds + expectedPublicGoodsRounds,
        percentage: Math.round(((trustGameRounds + publicGoodsRounds) / (expectedTrustRounds + expectedPublicGoodsRounds)) * 100)
      }
    };
  } catch (error) {
    console.error('게임 진행률 계산 오류:', error);
    return {
      trustGame: { completed: 0, total: 10, percentage: 0 },
      publicGoods: { completed: 0, total: 10, percentage: 0 },
      overall: { completed: 0, total: 20, percentage: 0 }
    };
  }
}; 