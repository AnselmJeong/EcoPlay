import { auth } from '@/lib/firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Firebase Auth 토큰 가져오기 함수
async function getAuthToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
}

// API 호출을 위한 기본 함수
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Firebase Auth 토큰 가져오기
  const token = await getAuthToken();
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Public Goods Game API
export const publicGoodsAPI = {
  submitRound: async (data: {
    round: number;
    donation: number;
    current_balance: number;
  }) => {
    return apiCall('/game/public-goods/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getHistory: async () => {
    return apiCall('/game/history/public_goods');
  },
};

// Trust Game API
export const trustGameAPI = {
  submitRound: async (data: {
    round: number;
    role: string;
    current_balance: number;
    received_amount?: number;
    return_amount?: number;
    investment?: number;
  }) => {
    return apiCall('/game/trust-game/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getHistory: async (role: string) => {
    return apiCall(`/game/history/trust_game_${role}`);
  },
};

// Matching API
export const matchAPI = {
  matchOpponent: async (data: {
    user_id: string;
    game_type: string;
    personality?: string;
  }) => {
    return apiCall('/match/trust-game', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getPersonalities: async () => {
    return apiCall('/match/trust-game/personalities');
  },
  
  getHistory: async () => {
    return apiCall('/match/history');
  },
};

// Message API
export const messageAPI = {
  generateMessage: async (data: {
    game_type: string;
    round: number;
    performance_data?: any;
  }) => {
    return apiCall('/message/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getHistory: async (gameType?: string) => {
    const query = gameType ? `?game_type=${gameType}` : '';
    return apiCall(`/message/history${query}`);
  },
  
  saveFeedback: async (messageId: string, helpful: boolean) => {
    return apiCall('/message/feedback', {
      method: 'POST',
      body: JSON.stringify({ message_id: messageId, helpful }),
    });
  },
};

// Report API
export const reportAPI = {
  getGameReport: async (gameType?: string) => {
    const query = gameType ? `?game_type=${gameType}` : '';
    return apiCall(`/report/games${query}`);
  },
  
  getPublicGoodsReport: async () => {
    return apiCall('/report/public-goods');
  },
  
  getTrustGameReport: async (role?: string) => {
    const query = role ? `?role=${role}` : '';
    return apiCall(`/report/trust-game${query}`);
  },
  
  getAllGamesReport: async () => {
    return apiCall('/report/all');
  },
};

// Consent API
export const consentAPI = {
  submitConsent: async (data: {
    medicalRecordNumber: string;
    consentGiven: boolean;
    consentDetails: {
      researchParticipation: boolean;
      dataCollection: boolean;
      dataSharing: boolean;
      contactPermission: boolean;
    };
  }) => {
    return apiCall('/consent/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  checkConsent: async (medicalRecordNumber: string) => {
    return apiCall(`/consent/check/${medicalRecordNumber}`);
  },
  
  getConsentList: async () => {
    return apiCall('/consent/list');
  },
  
  updateConsent: async (documentId: string, data: {
    medicalRecordNumber: string;
    consentGiven: boolean;
    consentDetails: {
      researchParticipation: boolean;
      dataCollection: boolean;
      dataSharing: boolean;
      contactPermission: boolean;
    };
  }) => {
    return apiCall(`/consent/update/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  deleteConsent: async (documentId: string) => {
    return apiCall(`/consent/delete/${documentId}`, {
      method: 'DELETE',
    });
  },
}; 