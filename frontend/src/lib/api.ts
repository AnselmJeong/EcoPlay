import { auth } from '@/lib/firebase';

function getApiBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }

  throw new Error('NEXT_PUBLIC_API_URL is required for a production build.');
}

const API_BASE_URL = getApiBaseUrl();

export interface SessionState {
  session_id: string;
  phase: 'trial' | 'awaiting_post_block' | 'comprehension' | 'completed' | string;
  config_version?: string | null;
  total_trials?: number | null;
  total_blocks?: number | null;
  trials_per_block?: number | null;
  completed_trials_count: number;
  cumulative_payoff?: number | null;
  current_balance?: number | null;
  current_partner_balance?: number | null;
  current_trial_index?: number | null;
  current_block_index?: number | null;
  current_trial_within_block?: number | null;
  overall_trial_index?: number | null;
  current_partner_label?: string | null;
  endowment?: number | null;
  multiplier?: number | null;
  awaiting_post_block?: boolean | null;
  tutorial_completed?: boolean | null;
  comprehension_check_passed?: boolean | null;
  prompt?: {
    trial_index: number;
    sender_investment: number;
    amount_received: number;
    multiplier: number;
    max_return_amount: number;
  } | null;
  block_plan?: Array<{
    block_index: number;
    partner_id: string;
    public_label: string;
  }> | null;
}

export interface SessionStartResponse {
  session: SessionState;
}

export interface StartSessionOptions {
  replaceCompleted?: boolean;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface TutorialSubmitResponse {
  session: SessionState;
  trial: {
    trial_index: number;
    endowment: number;
    sender_investment: number;
    amount_received: number;
    return_amount: number;
    amount_kept: number;
  };
  completed: boolean;
}

export interface TutorialComprehensionResponse {
  session: SessionState;
  passed: boolean;
  feedback: Array<{
    question_key: 'multiplier' | 'return_basis' | 'repeated_interaction';
    prompt: string;
    is_correct: boolean;
    correct_answer: string;
    explanation: string;
  }>;
}

export interface RTGSubmitTrialResponse {
  session: SessionState;
  trial: {
    rtg_trial_index: number;
    rtg_block_index: number;
    partner_public_label: string;
    trial_within_partner: number;
    amount_sent: number;
    amount_kept: number;
    amount_received_by_partner: number;
    partner_return_amount: number;
    partner_return_ratio: number | null;
    participant_total_payoff_this_trial: number;
    cumulative_payoff: number;
    participant_balance_after_trial?: number;
    partner_balance_after_trial?: number;
  };
  block_complete: boolean;
  completed: boolean;
}

export interface RTGPostBlockResponse {
  session: SessionState;
  post_block: {
    rtg_block_index: number;
    partner_public_label: string;
    partner_classification_response: 'high_return' | 'low_return' | 'unpredictable';
    partner_classification_correct: boolean;
    classification_confidence: number;
    willingness_to_play_again: number;
  };
  completed: boolean;
}

export interface AllGameReportResponse {
  overall_summary: {
    games_played: {
      rtg_tutorial: number;
      trust_game: number;
    };
    expected_rounds_by_game: {
      rtg_tutorial: number;
      trust_game: number;
    };
    sessions_completed: {
      rtg_tutorial: boolean;
      trust_game: boolean;
    };
    questionnaire_ready: boolean;
    completed_rounds: number;
    expected_rounds: number;
    overall_percentage: number;
  };
}

// Firebase Auth 토큰 가져오기 함수
async function getAuthToken(): Promise<string | null> {
  try {
    const user = auth?.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
}

function formatApiErrorDetail(payload: unknown, fallback: string): string {
  if (typeof payload !== 'object' || payload === null || !('detail' in payload)) {
    return fallback;
  }

  const detail = payload.detail;
  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail.flatMap((item) => {
      if (typeof item !== 'object' || item === null) return [];

      const message = 'msg' in item ? String(item.msg) : '';
      const location =
        'loc' in item && Array.isArray(item.loc)
          ? item.loc.filter((part: unknown) => part !== 'body').join('.')
          : '';

      if (!message) return [];
      return [location ? `${location}: ${message}` : message];
    });

    return messages.length > 0 ? messages.join('\n') : fallback;
  }

  if (typeof detail === 'object' && detail !== null && 'message' in detail) {
    return String(detail.message);
  }

  return fallback;
}

function getApiErrorCode(payload: unknown): string | undefined {
  if (typeof payload !== 'object' || payload === null || !('detail' in payload)) {
    return undefined;
  }

  const detail = payload.detail;
  if (typeof detail !== 'object' || detail === null || !('code' in detail)) {
    return undefined;
  }

  return String(detail.code);
}

async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = await getAuthToken();

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    let code: string | undefined;
    try {
      const payload: unknown = await response.json();
      detail = formatApiErrorDetail(payload, detail);
      code = getApiErrorCode(payload);
    } catch {
      // ignore json parse failure
    }
    throw new ApiError(response.status, detail, code);
  }

  return response.json() as Promise<T>;
}

export const rtgTutorialAPI = {
  startSession: async (options: StartSessionOptions = {}) =>
    apiCall<SessionStartResponse>('/game/rtg/tutorial/start', {
      method: 'POST',
      body: JSON.stringify({ replace_completed: options.replaceCompleted ?? false }),
    }),
  getSession: async (sessionId: string) => apiCall<SessionStartResponse>(`/game/rtg/tutorial/session/${sessionId}`),
  submitTrial: async (data: {
    session_id: string;
    return_amount: number;
    response_time_ms: number;
  }) =>
    apiCall<TutorialSubmitResponse>('/game/rtg/tutorial/submit-trial', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submitComprehensionCheck: async (data: {
    session_id: string;
    multiplier_answer: number;
    return_basis_answer: 'tripled_amount' | 'original_amount' | 'fixed_bonus';
    repeated_interaction_answer: boolean;
  }) =>
    apiCall<TutorialComprehensionResponse>('/game/rtg/tutorial/comprehension-check', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const rtgAPI = {
  getAccess: async () => apiCall<{ allowed: boolean }>('/game/rtg/access', { cache: 'no-store' }),
  startSession: async (options: StartSessionOptions = {}) =>
    apiCall<SessionStartResponse>('/game/rtg/start-session', {
      method: 'POST',
      body: JSON.stringify({ replace_completed: options.replaceCompleted ?? false }),
    }),
  getSession: async (sessionId: string) => apiCall<SessionStartResponse>(`/game/rtg/session/${sessionId}`),
  submitTrial: async (data: {
    session_id: string;
    amount_sent: number;
    response_time_ms: number;
  }) =>
    apiCall<RTGSubmitTrialResponse>('/game/rtg/submit-trial', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submitPostBlock: async (data: {
    session_id: string;
    partner_classification_response: 'high_return' | 'low_return' | 'unpredictable';
    classification_confidence: number;
    willingness_to_play_again: number;
  }) =>
    apiCall<RTGPostBlockResponse>('/game/rtg/post-block', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Message API
export const messageAPI = {
  generateMessage: async (data: {
    game_type: string;
    round: number;
    performance_data?: unknown;
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

export const reportAPI = {
  getGameReport: async () => apiCall('/report/games'),
  getAllGamesReport: async () => apiCall<AllGameReportResponse>('/report/all'),
  getRTGTutorialReport: async () => apiCall('/report/rtg-tutorial'),
  getTrustGameReport: async () => apiCall('/report/trust-game'),
};

// Questionnaire API
export const questionnaireAPI = {
  submitAnswers: async (data: {
    medicalRecordNumber: string;
    answers: Record<string, unknown>;
    questionnaireName?: string;
    completed?: boolean;
  }) => {
    return apiCall('/questionnaire/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  checkStatus: async (medicalRecordNumber: string) => {
    return apiCall(`/questionnaire/check/${medicalRecordNumber}`);
  },

  getDetail: async (medicalRecordNumber: string) => {
    return apiCall(`/questionnaire/detail/${medicalRecordNumber}`);
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

  updateConsent: async (
    documentId: string,
    data: {
      medicalRecordNumber: string;
      consentGiven: boolean;
      consentDetails: {
        researchParticipation: boolean;
        dataCollection: boolean;
        dataSharing: boolean;
        contactPermission: boolean;
      };
    }
  ) => {
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
