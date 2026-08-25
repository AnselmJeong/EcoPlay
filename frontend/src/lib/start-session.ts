import { ApiError, SessionStartResponse, StartSessionOptions } from '@/lib/api';

type SessionStarter = (options?: StartSessionOptions) => Promise<SessionStartResponse>;

export async function startSessionWithRestartConfirmation(
  startSession: SessionStarter,
  gameLabel: string,
): Promise<SessionStartResponse | null> {
  try {
    return await startSession();
  } catch (error) {
    const requiresConfirmation =
      error instanceof ApiError &&
      error.status === 409 &&
      error.code === 'completed_session_exists';

    if (!requiresConfirmation) {
      throw error;
    }

    const confirmed = window.confirm(
      `이미 완료한 ${gameLabel} 기록이 있습니다.\n\n` +
        '새로 시작하면 기존 완료 기록은 무효 처리되어 결과와 분석에서 제외됩니다.\n' +
        '새 게임을 시작하시겠습니까?',
    );

    if (!confirmed) {
      return null;
    }

    return startSession({ replaceCompleted: true });
  }
}
