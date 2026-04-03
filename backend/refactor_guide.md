# YAML-Driven Game Logic 리팩토링 가이드

> **목적:** 이 문서는 Claude Code에게 지시할 프롬프트와 작업 계획을 정리한 것이다. 현재 `game.py`, `match.py`에 하드코딩된 게임 로직을 YAML 설정 파일로 분리하여, 설정만 바꾸면 다양한 실험 조건을 구현할 수 있는 구조로 리팩토링한다.

---

## 1. 현재 코드의 문제점

현재 `game.py`와 `match.py`에는 다음 값들이 Python 상수나 리터럴로 하드코딩되어 있다.

- PGG: `TOTAL_ROUNDS=10`, `INITIAL_POINTS=100`, `NUM_PLAYERS=5`, `MULTIPLIER=1.5`, 상대 기부 범위(`0~25%`)
- Trust Game: multiplier 없음(프로토콜에서는 ×3), trustee/trustor 로직이 혼재, endowment 미정의
- Match: `OPPONENT_PERSONALITIES` 리스트가 코드에 직접 정의, `return_rate_range` 튜플로 하드코딩
- 프로토콜과의 괴리: 프로토콜은 RTG 3 partner × 15 trials, PGG 15 trials을 요구하지만 현재 코드는 이를 반영하지 않음

---

## 2. 목표 YAML 스키마 설계

### 2.1 Claude Code에 전달할 프롬프트 (Phase 1: YAML 스키마 설계)

```
아래 실험 프로토콜과 코드북을 참고하여, 게임 실험의 모든 가변 파라미터를 정의하는 
YAML 설정 파일의 스키마를 설계해줘.

**요구사항:**
1. 하나의 YAML 파일(`game_config.yaml`)에 PGG와 RTG 설정을 모두 포함한다.
2. 각 게임의 구조적 파라미터(trials, blocks, endowment, multiplier 등)와 
   partner behavior 파라미터(return_rate, volatility, noise 등)를 분리한다.
3. Partner 유형은 리스트로 정의하되, 각 partner에 대해 다음을 지정할 수 있어야 한다:
   - name, code (1/2/3)
   - mean_return_rate 범위 또는 고정값
   - volatility_parameter
   - noise_distribution (type, mean, sd)
   - 선택적으로 contingency_schedule (trial별 고정 시퀀스)
4. PGG의 시뮬레이션 상대 행동도 설정 가능해야 한다:
   - group_size, simulated_contribution_range, multiplier
5. Pydantic으로 validation할 수 있도록, 각 필드에 타입과 제약조건을 주석으로 명시한다.
6. 예시 값은 프로토콜의 기본값(RTG multiplier=3, partner types 3종, 
   PGG 15 trials 등)을 사용한다.

**참고 문서:**
- Integrated_Protocol.md (특히 4절 과제 설계)
- Integrated_Codebook.md (특히 6절 Partner algorithm log variables)

**출력:** game_config.yaml 파일과 그에 대한 Pydantic schema (schemas/game_config.py)
```

### 2.2 기대하는 YAML 구조 (예시, Claude Code에게 가이드로 제공)

```yaml
# game_config.yaml
version: "1.0"

pgg:
  trials: 15
  blocks: 1
  endowment: 10          # 매 trial 초기 자원
  group_size: 5           # 본인 포함
  multiplier: 1.5
  simulated_agents:
    contribution_range: [0.0, 0.25]   # endowment 대비 비율
    strategy: "uniform_random"         # uniform_random | fixed | conditional

rtg:
  trials_per_partner: 15
  endowment: 10           # 매 trial 초기 자원
  multiplier: 3
  block_order: "randomized"   # randomized | fixed
  
  partners:
    - name: "High Reciprocity"
      code: 1
      mean_return_rate: [0.60, 0.75]    # [min, max] 범위에서 trial별 샘플
      volatility: 0.05                   # SD of noise
      noise_distribution:
        type: "normal"
        mean: 0.0
        sd: 0.05
      clamp: [0.0, 1.0]                 # 반환비율 상하한
      
    - name: "Low Reciprocity"
      code: 2
      mean_return_rate: [0.10, 0.30]
      volatility: 0.05
      noise_distribution:
        type: "normal"
        mean: 0.0
        sd: 0.05
      clamp: [0.0, 1.0]
      
    - name: "Volatile Reciprocity"
      code: 3
      mean_return_rate: [0.30, 0.50]
      volatility: 0.25
      noise_distribution:
        type: "normal"
        mean: 0.0
        sd: 0.25
      clamp: [0.0, 1.0]

tutorial:
  trials: 10
  role: "trustee"            # 튜토리얼에서 참가자 역할
  endowment: 10
  multiplier: 3

post_block_questions:
  enabled: true
  items:
    - key: "partner_classification"
      type: "categorical"
      options: ["high_return", "low_return", "unpredictable"]
    - key: "classification_confidence"
      type: "likert"
      range: [1, 7]
    - key: "willingness_to_play_again"
      type: "likert"
      range: [1, 7]
```

---

## 3. 코드 리팩토링 계획

### 3.1 Phase 2: Config Loader 구현

```
game_config.yaml을 로드하고 Pydantic으로 validate하는 모듈을 만들어줘.

**요구사항:**
1. `core/game_config.py` 모듈을 생성한다.
2. YAML 파일 경로는 환경변수(`GAME_CONFIG_PATH`)로 지정하되, 
   기본값은 `config/game_config.yaml`이다.
3. 앱 시작 시 1회 로드하여 싱글톤으로 유지한다.
4. Pydantic v2 모델로 validation하며, 다음을 검증한다:
   - multiplier > 0
   - trials > 0
   - return_rate 범위가 [0, 1] 이내
   - partner code가 고유한지
   - noise_distribution.type이 허용된 값인지 ("normal", "uniform")
5. 로드 실패 시 명확한 에러 메시지와 함께 앱 시작을 중단한다.
6. `get_game_config()` 함수를 export하여 라우터에서 사용할 수 있도록 한다.
```

### 3.2 Phase 3: Partner Engine 리팩토링

```
현재 match.py의 OPPONENT_PERSONALITIES와 game.py의 하드코딩된 상대 행동을 
YAML 설정 기반의 PartnerEngine 클래스로 교체해줘.

**요구사항:**
1. `engine/partner.py` 모듈을 생성한다.
2. PartnerEngine 클래스는 다음을 담당한다:
   - YAML에서 partner config를 받아 초기화
   - trial별로 `generate_return(amount_received: float) -> PartnerResponse`를 호출하면
     설정에 따라 반환액을 계산
   - 내부적으로 seed 기반 난수 생성기를 유지 (재현성)
   - 매 trial의 algorithm log 변수를 생성:
     planned_return_ratio, actual_return_ratio, noise_term, volatility_parameter
3. PartnerResponse는 다음 필드를 포함하는 Pydantic 모델이다:
   - return_amount: float
   - return_ratio: float
   - algorithm_log: dict (planned_ratio, actual_ratio, noise_term, 
     volatility_param, seed, algorithm_version)
4. amount_sent가 0일 때의 edge case를 처리한다 (return_ratio = None).
5. 반환비율은 config의 clamp 범위 내로 제한한다.

**반환비율 생성 로직 (기본):**
- base_rate = uniform(mean_return_rate[0], mean_return_rate[1])
- noise = normal(noise_mean, noise_sd) * volatility
- planned_ratio = base_rate + noise
- actual_ratio = clamp(planned_ratio, clamp[0], clamp[1])
- return_amount = amount_received * actual_ratio
```

### 3.3 Phase 4: PGG Engine 리팩토링

```
game.py의 Public Goods Game 로직을 YAML 설정 기반으로 리팩토링해줘.

**요구사항:**
1. `engine/pgg.py` 모듈을 생성한다.
2. PGGEngine 클래스가 YAML의 pgg 섹션 설정을 받아:
   - simulated agent들의 기부액을 생성
   - common pot 계산
   - 개인별 payoff 계산
3. 현재 코드의 하드코딩된 값들을 모두 config에서 읽도록 변경한다:
   - NUM_PLAYERS → config.pgg.group_size
   - MULTIPLIER → config.pgg.multiplier
   - INITIAL_POINTS → config.pgg.endowment
   - 기부 범위 → config.pgg.simulated_agents.contribution_range
4. Firestore 저장 데이터에 config version과 사용된 파라미터를 함께 기록한다.
```

### 3.4 Phase 5: Router 리팩토링

```
game.py와 match.py의 라우터를 리팩토링하여 engine 모듈을 사용하도록 변경해줘.

**요구사항:**
1. 라우터는 게임 로직을 직접 포함하지 않고, engine 모듈을 호출한다.
2. 각 API 엔드포인트에서:
   - config를 get_game_config()로 가져옴
   - PartnerEngine 또는 PGGEngine 인스턴스를 생성
   - engine의 메서드를 호출하여 결과를 얻음
   - Firestore에 저장할 때 algorithm_log를 함께 저장
3. RTG 엔드포인트 구조를 프로토콜에 맞게 재설계한다:
   - POST /game/rtg/start-session → 세션 시작, partner 순서 무작위화, seed 생성
   - POST /game/rtg/submit-trial → trial 제출, partner engine으로 반환 생성
   - POST /game/rtg/post-block → post-block perception 질문 저장
   - GET /game/rtg/session/{session_id} → 세션 상태 조회
4. PGG 엔드포인트도 정리한다:
   - POST /game/pgg/submit-trial → trial 제출
5. Firestore 저장 스키마를 codebook의 RECORDED 변수와 일치시킨다.
   특히 다음 필드를 반드시 포함:
   - rtg_trial_index, rtg_block_index, partner_id, partner_type
   - trial_within_partner, endowment, amount_sent, amount_kept
   - multiplier, amount_received_by_partner
   - partner_return_amount, partner_return_ratio
   - participant_total_payoff_this_trial, cumulative_payoff
   - response_time_ms
   - algorithm_version, partner_seed, planned/actual_return_ratio
   - volatility_parameter, noise_term, contingency_schedule_id
```

---

## 4. 디렉토리 구조

```
project/
├── config/
│   └── game_config.yaml          # 게임 설정 (YAML)
├── core/
│   ├── firebase.py               # 기존 유지
│   └── game_config.py            # YAML 로더 + Pydantic validation
├── engine/
│   ├── __init__.py
│   ├── partner.py                # PartnerEngine (RTG 상대 행동 생성)
│   └── pgg.py                    # PGGEngine (PGG 상대 행동 생성)
├── schemas/
│   ├── game.py                   # API 요청/응답 스키마 (수정)
│   ├── game_config.py            # YAML 설정 Pydantic 모델
│   └── match.py                  # 기존 유지 또는 통합
├── routers/
│   ├── game.py                   # 리팩토링된 라우터
│   └── match.py                  # 리팩토링 또는 game.py에 통합
└── tests/
    ├── test_partner_engine.py
    ├── test_pgg_engine.py
    └── test_config_loading.py
```

---

## 5. 작업 순서 및 Claude Code 프롬프트 시퀀스

아래 순서대로 Claude Code에 지시한다. 각 단계가 완료되면 다음으로 넘어간다.

### Step 1: YAML 스키마 + Pydantic 모델

**프롬프트:**
```
이 프로젝트의 config/game_config.yaml과 schemas/game_config.py를 만들어줘.
[2.1절의 프롬프트 + 2.2절의 예시 YAML을 컨텍스트로 제공]
Integrated_Protocol.md의 4절과 Integrated_Codebook.md의 6절을 참조해.
```

### Step 2: Config Loader

**프롬프트:**
```
core/game_config.py를 만들어줘. YAML 파일을 로드하고 
schemas/game_config.py의 Pydantic 모델로 validate하는 싱글톤 로더야.
[3.1절의 요구사항을 제공]
```

### Step 3: Partner Engine

**프롬프트:**
```
engine/partner.py를 만들어줘.
[3.2절의 요구사항 전체를 제공]
기존 match.py의 OPPONENT_PERSONALITIES를 참고하되, 
YAML 설정 기반으로 완전히 대체해.
```

### Step 4: PGG Engine

**프롬프트:**
```
engine/pgg.py를 만들어줘.
[3.3절의 요구사항을 제공]
기존 game.py의 PGG 관련 로직을 참고해.
```

### Step 5: Router 리팩토링

**프롬프트:**
```
routers/game.py를 리팩토링해줘. 
[3.4절의 요구사항을 제공]
engine 모듈을 사용하고, Firestore 저장 스키마를 
Integrated_Codebook.md의 RECORDED 변수와 일치시켜.
```

### Step 6: 테스트

**프롬프트:**
```
다음 테스트를 작성해줘:
1. test_config_loading.py: 유효한 YAML 로드, 잘못된 YAML 거부, 
   필수 필드 누락 시 에러 확인
2. test_partner_engine.py: 각 partner type에 대해 
   - 같은 seed로 동일한 시퀀스 재현 가능한지
   - 반환비율이 clamp 범위 내인지
   - amount_sent=0 edge case 처리
   - algorithm_log가 올바른 필드를 포함하는지
3. test_pgg_engine.py: 
   - 시뮬레이션 기부가 설정 범위 내인지
   - payoff 계산이 정확한지
pytest로 실행 가능하게 만들어줘.
```

---

## 6. YAML 변경만으로 조절 가능한 실험 조건 목록

리팩토링 완료 후, 코드 수정 없이 YAML만 바꿔서 다음을 조절할 수 있어야 한다:

| 파라미터 | YAML 경로 | 조절 예시 |
|---|---|---|
| RTG multiplier | `rtg.multiplier` | ×2, ×3, ×4 비교 실험 |
| Trial 수 | `rtg.trials_per_partner` | 10, 15, 20 trials |
| Endowment | `rtg.endowment` | 10, 20, 100 포인트 |
| Partner 수/종류 | `rtg.partners` 리스트 | 2종, 3종, 4종 partner 조건 |
| Partner 반환비율 | `partners[].mean_return_rate` | 범위 조절 |
| Partner 변동성 | `partners[].volatility` | 0.05 vs 0.25 vs 0.40 |
| Noise 분포 | `partners[].noise_distribution` | normal vs uniform |
| 반환비율 상하한 | `partners[].clamp` | [0, 1] vs [0.05, 0.95] |
| PGG group size | `pgg.group_size` | 4인, 5인, 8인 |
| PGG multiplier | `pgg.multiplier` | 1.2, 1.5, 2.0 |
| Post-block 질문 | `post_block_questions` | 문항 추가/제거 |

---

## 7. 주의사항

1. **재현성:** PartnerEngine은 반드시 seed 기반이어야 한다. 동일 seed + 동일 config로 동일한 partner 행동 시퀀스를 재현할 수 있어야 한다. Seed는 세션 시작 시 생성하여 Firestore에 저장한다.

2. **Codebook 일치:** Firestore에 저장하는 필드명은 `Integrated_Codebook.md`의 변수명과 정확히 일치시킨다. 현재 코드의 `human_contribution`, `human_payoff` 같은 비표준 필드명은 codebook 표준(`pgg_contribution`, `amount_sent` 등)으로 교체한다.

3. **Algorithm log:** 매 trial마다 `algorithm_version`, `partner_seed`, `planned_partner_return_ratio`, `actual_partner_return_ratio`, `volatility_parameter`, `noise_term`, `contingency_schedule_id`를 반드시 기록한다. 이는 디버깅뿐 아니라 논문 재현성의 필수 요건이다.

4. **Edge cases:**
   - `amount_sent = 0`일 때 `partner_return_ratio`는 `None`으로 처리
   - Trial timeout 시 `timeout_flag = 1`, `missing_response_flag` 와 구분
   - Config 변경 시 기존 진행 중인 세션에 영향 없도록 세션 시작 시 config snapshot 저장

5. **하위 호환:** 기존 Firestore 데이터와의 호환성을 고려하여, 새 필드를 추가하되 기존 필드를 제거하지 않는다. `algorithm_version` 필드로 어떤 코드 버전에서 생성된 데이터인지 구분한다.

6. **Tutorial과 Main task 분리:** Tutorial trial은 별도 컬렉션이나 `tutorial_trial_flag`로 구분한다. 분석에 포함되지 않아야 한다.

---

## 8. Claude Code 사용 시 컨텍스트 제공 팁

Claude Code에 각 단계를 지시할 때 다음 파일들을 함께 제공한다:

- **항상 포함:** `Integrated_Protocol.md`, `Integrated_Codebook.md`
- **Phase 1-2:** 위 두 파일만으로 충분
- **Phase 3-5:** 위 두 파일 + 현재 `game.py`, `match.py` + 이전 단계에서 생성된 파일들
- **Phase 6:** 위 모든 파일 + engine 모듈들

각 프롬프트의 길이가 길어지면, "이전 단계에서 만든 `engine/partner.py`를 확인하고" 식으로 파일 참조를 지시하면 된다.
