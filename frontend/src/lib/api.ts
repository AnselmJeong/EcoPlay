const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API 호출을 위한 기본 함수
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Firebase Auth 토큰 가져오기 (실제 구현에서는 Firebase Auth 사용)
  // const token = await getAuthToken();
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
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