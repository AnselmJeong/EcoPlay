# 통합 프로토콜 Codebook — 상세 변수 설명서

아래 문서는 Integrated_Protocol.md에 등장하는 모든 변수를 대상으로, 각 변수의 의미를 상세히 설명한 codebook입니다. 설명은 다음 기준에 따라 작성했습니다.

- 이 변수가 **언제, 어떻게 기록되는지**
- **무엇을 측정하는지**
- 분석에서 **왜 필요한지**
- **측정 유형(Source):** 각 변수가 직접 측정/기록(RECORDED)인지, 코드에서 사후 계산(DERIVED)인지 명시

> **Source 범례**
>
> - 🔴 **RECORDED** — 실험 코드 또는 설문/면담에서 직접 기록하는 변수. 실험 프로그램에 반드시 구현되어야 한다.
> - 🔵 **DERIVED** — 기록된 원자료(RECORDED 변수)로부터 분석 단계에서 사후 계산하는 변수. 실험 코드에 구현할 필요 없이 분석 스크립트에서 재현 가능해야 한다.

---

# 1. Participant-level variables 🔴 RECORDED

이 수준의 변수는 **참가자 1명당 1번만 저장**된다. 실험 세션 시작 시 인구통계 수집 단계에서 기록하거나, 실험 종료 후 연구자가 확정한다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| participant_id | string | 🔴 RECORDED | 각 참가자에게 부여되는 고유 익명 식별자이다. 이름이나 주민번호 같은 개인정보를 직접 저장하지 않고, 연구용 익명 ID로 관리하는 것이 원칙이다. 이후 모든 설문과 RTG trial 데이터는 이 ID를 기준으로 연결된다. |
| session_date | datetime | 🔴 RECORDED | 참가자가 실험에 참여한 날짜와 시간이다. 세션 효과(오전/오후, 특정 기간의 모집군 차이), 데이터 누락 점검, 재현성 확인에 중요하다. `YYYY-MM-DD HH:MM:SS` 형식으로 저장한다. |
| age | int | 🔴 RECORDED | 참가자의 만 나이이다. 사회불안, 의사결정, 반응속도 모두 연령의 영향을 받을 수 있으므로 분석에서 핵심 공변량 후보이다. 본 연구의 포함 기준은 만 16세 이상 29세 미만이다. |
| sex_at_birth | categorical | 🔴 RECORDED | 출생 시 지정된 생물학적 성별이다(male / female / intersex). 생물학적 요인이나 기존 임상 연구와의 비교를 위해 분리 저장한다. `gender`와는 서로 다른 변수이므로 혼동하지 않는다. |
| gender | categorical / string | 🔴 RECORDED | 참가자가 스스로 보고한 성별 정체성이다. 출생 시 성별과 일치할 수도 있고 다를 수도 있다. 임상적·사회적 맥락을 반영하는 변수로, 필요 시 자유기입 후 분석용 재코딩이 가능하다. |
| education_years | int | 🔴 RECORDED | 총 교육 연수이다. 고졸, 대학 재학, 대학원 등의 인지적·사회적 배경 차이를 비교적 연속적으로 반영할 수 있다. |
| current_student_status | binary | 🔴 RECORDED | 현재 학생 신분인지 여부이다(0=비학생, 1=학생). education_years와 보조적으로 사용할 수 있다. 대학생 표본과 지역사회 표본이 섞일 때 모집군 특성을 간단히 반영하는 데 유용하다. |
| diagnostic_group | categorical | 🔴 RECORDED | 참가자의 임상군 분류이다. 예를 들어 건강 대조군, 사회불안장애군, 기타 불안장애군 등으로 구분할 수 있다. 연속체 분석뿐 아니라 군 간 비교를 하고 싶을 때 중요하다. 구조화된 면담 또는 의무기록 기반으로 결정한다. |
| psychiatric_diagnosis | string / array | 🔴 RECORDED | 구체적인 정신과 진단명을 저장하는 변수이다. 다중 진단이 가능하므로, 문자열 배열이나 별도 다중 binary 변수로 관리하는 것이 더 낫다. diagnostic_group이 군 분류용 범주형이라면, 이 변수는 원본 진단 정보를 보존하는 역할을 한다. |
| medication_status | categorical | 🔴 RECORDED | 현재 향정신성 약물 복용 상태를 기록한다(0=none, 1=antidepressant, 2=benzodiazepine, 3=multiple 등). 약물은 반응속도, 불안 수준, 학습 패턴에 영향을 줄 수 있어 공변량 후보이다. |
| handedness | categorical | 🔴 RECORDED | 주손 여부이다(right / left / ambidextrous). 이 과제에서는 필수는 아니지만, 향후 반응속도나 신경영상/행동 연결 분석을 고려한다면 기록해둘 수 있다. |
| task_order | categorical | 🔴 RECORDED | 과제가 어떤 순서로 제시되었는지 기록한다. 본 프로토콜의 기본 순서는 RTG Tutorial → RTG 본실험 → 설문이지만, counterbalancing을 할 경우 이 변수로 순서 효과를 통제할 수 있다. |
| tutorial_completed | binary | 🔴 RECORDED | RTG 튜토리얼(trustee 역할 경험 10 trials)을 끝까지 완료했는지 여부이다(0=미완료, 1=완료). 중도 이탈자나 이해 부족 사례를 제외하는 기준이 될 수 있다. |
| comprehension_check_passed | binary | 🔴 RECORDED | 참가자가 RTG 과제 구조를 충분히 이해했는지 확인하는 이해도 점검 통과 여부이다(0=실패, 1=통과). 예를 들어 "보낸 돈은 몇 배가 되어 상대에게 전달되는가?" 같은 질문을 맞혔는지 기록한다. 분석 포함 여부를 결정하는 중요한 품질관리 변수이다. |
| include_in_analysis_flag | binary | 🔴 RECORDED | 최종적으로 본 분석에 포함할지 여부를 저장하는 플래그이다(0=제외, 1=포함). 이해도 실패, 중도 중단, 심각한 결측, 기술적 오류 등을 반영하여 연구자가 확정한다. 원자료는 보존하되 분석 시 필터링에 사용한다. |

---

# 2. Questionnaire variables

설문은 반드시 **item-level raw data**와 **total/subscale score**를 모두 저장한다. 총점만 저장하면 나중에 역채점 오류나 특정 문항 이상치를 수정할 수 없다. 설문은 RTG 본실험 종료 후에 실시한다.

## 2-1. Item-level variables 🔴 RECORDED

각 문항에 대해 참가자가 응답한 원점수를 그대로 저장한다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| ksias_item_01 ~ ksias_item_n | int | 🔴 RECORDED | K-SIAS(Korean Social Interaction Anxiety Scale, 단축형) 각 문항의 원점수이다. 사회적 상호작용 상황에서의 불안 수준을 구성하는 세부 문항 반응을 보존하기 위한 것이다. 본 연구의 핵심 독립변수 중 하나이다. |
| ksps_item_01 ~ ksps_item_n | int | 🔴 RECORDED | K-SPS(Korean Social Phobia Scale, 단축형) 각 문항의 원점수이다. 특히 타인에게 관찰되거나 평가받는 수행 상황에서의 불안을 반영한다. K-SIAS가 상호작용 불안에 초점을 둔다면, K-SPS는 관찰/수행 불안에 초점을 두어 사회불안의 하위유형을 분리하는 데 유용하다. |
| kbfne_item_01 ~ kbfne_item_n | int | 🔴 RECORDED | K-BFNE(Korean Brief Fear of Negative Evaluation Scale) 각 문항 점수이다. 부정적 평가에 대한 두려움이라는 사회불안의 핵심 인지적 성분을 측정한다. Trust game에서 상대의 반응을 부정적으로 해석하는 편향과 연결될 가능성이 있어, K-SIAS/K-SPS와 함께 핵심 독립변수로 포함한다. |
| phq9_item_01 ~ phq9_item_09 | int | 🔴 RECORDED | PHQ-9(Patient Health Questionnaire-9) 각 문항의 점수이다. 총 9문항으로 우울 증상의 심각도를 측정한다. 사회불안과 함께 나타나는 우울의 영향을 통제하기 위해 필요한 공변량 측정이다. |
| gad7_item_01 ~ gad7_item_07 | int | 🔴 RECORDED | GAD-7(Generalized Anxiety Disorder-7) 각 문항의 점수이다. 총 7문항으로 범불안 증상을 측정한다. 사회불안 특이 효과와 일반적 불안 효과를 구분하는 데 중요한 공변량이다. |
| ucla_item_01 ~ ucla_item_n | int | 🔴 RECORDED | UCLA Loneliness Scale 각 문항 점수이다. 주관적 외로움과 사회적 연결감 저하를 측정한다. 대인관계 회피, 사회적 고립감이 trust behavior에 미치는 영향을 고려할 때 보조 공변량으로 의미가 있다. |
| ecrr_item_01 ~ ecrr_item_n | int | 🔴 RECORDED | ECR-R(Experiences in Close Relationships Questionnaire-Revised) 한국판 각 문항 점수이다. 애착불안(attachment anxiety)과 애착회피(attachment avoidance)의 두 차원을 측정한다. H4 매개 모형에서 PBI → ECR-R → trust 행동 경로의 핵심 매개변수를 구성하는 원자료이다. |
| pbi_item_01 ~ pbi_item_n | int | 🔴 RECORDED | PBI(Parental Bonding Instrument) 한국판 각 문항 점수이다. 부모-자녀 결합의 돌봄(care)과 과보호(overprotection) 차원을 측정한다. H4 매개 모형에서 가장 앞단의 선행변수를 구성하는 원자료이다. 부와 모를 분리하여 평가할 경우 pbi_father_item_nn / pbi_mother_item_nn으로 구분 저장할 수 있다. |

## 2-2. Scale-level variables 🔵 DERIVED

item-level 원점수에서 역채점 적용 후 합산/평균하여 산출한다. 실험 코드에서 실시간으로 계산해도 되지만, 반드시 item-level raw data를 별도 보존해야 한다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| ksias_total | int | 🔵 DERIVED | K-SIAS 전체 총점이다. 사회적 상호작용 불안의 전반적 수준을 나타내는 대표 지표이다. 분석에서 핵심 독립변수로 사용한다. |
| ksps_total | int | 🔵 DERIVED | K-SPS 전체 총점이다. 수행/관찰 상황에서의 사회불안 정도를 나타낸다. K-SIAS와 함께 사회불안의 하위유형별 효과를 비교하는 데 활용한다. |
| kbfne_total | int | 🔵 DERIVED | K-BFNE 총점이다. 타인의 부정적 평가에 대한 두려움 정도를 나타낸다. Trust game에서 상대 해석 편향과 연결될 가능성이 있어, 핵심 독립변수로 포함한다. |
| phq9_total | int | 🔵 DERIVED | PHQ-9 총점이다. 우울 증상의 전반적 심각도를 나타낸다. 사회불안 효과를 해석할 때 반드시 통제해야 할 공변량이다. 본 연구에서는 진단 목적의 cut-off가 아닌 연속변수로 사용한다. |
| gad7_total | int | 🔵 DERIVED | GAD-7 총점이다. 일반적 불안 수준을 나타낸다. 사회불안 특이성 검증을 위한 공변량이다. |
| ucla_total | int | 🔵 DERIVED | UCLA Loneliness Scale 총점이다. 주관적 외로움과 사회적 고립감을 반영한다. 낮은 신뢰 혹은 회피적 경향과 관련될 수 있는 공변량이다. |
| ecrr_anxiety | float | 🔵 DERIVED | ECR-R의 애착불안(attachment anxiety) 하위척도 점수이다. 관계에서의 버림받음에 대한 불안, 상대의 가용성에 대한 걱정을 반영한다. H4 매개 모형에서 PBI → 이 변수 → trust 행동 경로의 핵심 매개변수이다. |
| ecrr_avoidance | float | 🔵 DERIVED | ECR-R의 애착회피(attachment avoidance) 하위척도 점수이다. 친밀감에 대한 불편함, 의존 회피를 반영한다. 애착불안과 함께 trust game에서의 행동 패턴과 연결될 수 있다. |
| pbi_care | float | 🔵 DERIVED | PBI의 돌봄(care) 하위척도 점수이다. 부모가 따뜻하고 공감적이었는지를 반영한다. 낮은 돌봄은 불안정 애착과 연결되며, 이를 통해 trust 행동에 간접 영향을 미칠 수 있다. |
| pbi_overprotection | float | 🔵 DERIVED | PBI의 과보호(overprotection) 하위척도 점수이다. 부모가 통제적이고 자율성을 억제했는지를 반영한다. 높은 과보호는 사회적 상황에서의 위협 민감성과 연결될 수 있다. |

---

# 3. Repeated Trust Game (RTG) — core trial-level variables 🔴 RECORDED

이 부분이 본 연구의 핵심이다. RTG 본실험의 모든 trial(총 45 trials = 3 partners × 15 trials)에서 매번 기록되어야 하며, 거의 모든 분석은 여기서 출발한다. 실험 코드에서 반드시 구현해야 하는 변수들이다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| rtg_trial_index | int | 🔴 RECORDED | RTG 전체를 통틀어 몇 번째 trial인지 나타내는 전역 trial 번호이다(1~45). 세 partner block을 모두 합산한 일련번호이다. 전체 실험 진행에 따른 피로 효과, 전반적 시간 추세를 확인하는 데 필요하다. |
| rtg_block_index | int | 🔴 RECORDED | 현재 trial이 어느 partner block에 속하는지를 나타낸다(1, 2, 3). 한 block은 한 partner와의 15 trials로 구성된다. Block 순서는 참가자별로 무작위화되므로, block_index와 partner_type의 대응은 참가자마다 다르다. Partner별 학습 효과와 순서 효과를 구분할 때 필요하다. |
| partner_id | string | 🔴 RECORDED | 현재 상호작용 중인 상대의 고유 ID이다. 동일한 partner를 15 trial에 걸쳐 반복적으로 만나는 구조이므로, 그 상대가 누구인지를 식별해야 한다. partner_type과의 매핑 테이블은 별도로 관리한다. |
| partner_type | categorical | 🔴 RECORDED | 프로그램이 할당한 상대의 reciprocity 유형이다(1=high reciprocity, 2=low reciprocity, 3=volatile reciprocity). 참가자는 이 정보를 모른다. 연구자가 ground truth로 사용하며, 모든 partner 유형별 분석의 기준이 된다. |
| trial_within_partner | int | 🔴 RECORDED | 특정 partner와의 상호작용 안에서 몇 번째 trial인지 나타낸다(1~15). 학습 곡선 분석에 매우 중요한 변수이다. 예를 들어 trial 1~3은 초기 trust, trial 11~15는 학습 후 안정화된 trust로 해석할 수 있다. |
| endowment | float | 🔴 RECORDED | 해당 trial에서 참가자가 보유한 초기 자원이다. Trustor로서 이 금액 중 일부를 상대에게 보낼 수 있다. 매 trial 동일 금액(예: 10포인트)이 주어지는 것이 일반적이지만, 설계 변경 가능성을 위해 trial마다 기록한다. |
| amount_sent | float | 🔴 RECORDED | 참가자가 상대에게 보낸 금액이다. **Trust의 가장 직접적인 행동지표**이다. 0(완전한 불신 또는 방어)부터 endowment 전액(완전한 신뢰)까지 가능하다. 본 연구의 거의 모든 분석에서 핵심 종속변수로 사용된다. |
| amount_kept | float | 🔴 RECORDED | 참가자가 보내지 않고 남긴 금액이다. 논리적으로 `endowment - amount_sent`이지만, 데이터 검증(두 값의 합이 endowment와 일치하는지)과 직관적 해석을 위해 별도 저장한다. |
| multiplier | float | 🔴 RECORDED | 참가자가 보낸 돈이 상대에게 전달되기 전에 몇 배가 되는지 나타내는 계수이다. 본 프로토콜에서는 ×3으로 고정이지만, trial log에 매번 기록하여 재현성을 확보한다. 이 배수가 있기 때문에 투자가 사회적 효율성을 높이는 구조이며, trust game의 딜레마 구조를 만든다. |
| amount_received_by_partner | float | 🔴 RECORDED | 상대가 실제로 받은 금액이다(`amount_sent × multiplier`). Partner가 반환 결정을 할 때 기준이 되는 액수이다. 이 값을 별도로 기록하면 `partner_return_ratio` 계산 시 분모를 원자료에서 직접 확인할 수 있다. |
| partner_return_amount | float | 🔴 RECORDED | 상대가 참가자에게 실제로 돌려준 금액이다. Partner algorithm이 생성한 값이다. 참가자 입장에서 이 피드백이 "호혜" 또는 "배신"으로 경험되며, 다음 trial의 trust 조정에 직접 영향을 미치는 핵심 정보이다. |
| partner_return_ratio | float | 🔴 RECORDED | 상대가 받은 금액 중 얼마를 돌려줬는지의 비율이다(`partner_return_amount / amount_received_by_partner`). 절대 금액은 amount_sent에 의존하지만, 반환비율은 상대의 호혜적 성향을 정규화하여 비교하기에 더 적합하다. 사건 분류(betrayal, reciprocity, neutral)의 기준이 되는 핵심 변수이다. 참가자가 0을 보낸 경우(amount_sent=0) 이 비율은 정의되지 않으므로 NA 처리한다. |
| participant_total_payoff_this_trial | float | 🔴 RECORDED | 해당 trial이 끝났을 때 참가자가 실제로 보유하게 된 총 이득이다(`amount_kept + partner_return_amount`). 참가자 입장에서 이번 선택이 얼마나 유리했는지 나타내는 최종 outcome이다. |
| cumulative_payoff | float | 🔴 RECORDED | 지금까지 모든 trial에서 누적된 총 보상액이다. 참가자가 장기적 성과를 참고하여 전략을 조정할 가능성이 있다. 또한 실험 종료 후 보상 지급 기준으로 사용될 수 있다. |
| response_time_ms | int | 🔴 RECORDED | 참가자가 이번 trial에서 얼마를 보낼지 결정하는 데 걸린 시간이다(밀리초 단위). 의사결정의 갈등, 불확실성, 위협 해석 정도의 간접 지표가 될 수 있다. 극단적으로 빠른 반응(예: <200ms)은 무성의 응답, 극단적으로 느린 반응은 제한시간 초과와 관련될 수 있어 데이터 품질 점검에도 활용한다. |

---

# 4. Post-block perception variables 🔴 RECORDED

이 변수들은 각 partner block(15 trials) 종료 직후 수집한다. 총 3회(partner당 1회) 기록된다. 참가자가 상대의 특성을 얼마나 정확히 파악했는지, 그리고 그 상대에 대해 얼마나 접근/회피적인 태도를 가지는지 측정한다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| partner_classification_response | categorical | 🔴 RECORDED | 각 partner block 종료 후 참가자가 그 상대를 어떤 유형으로 인식했는지에 대한 응답이다. 선택지: "대체로 많이 돌려주는 편" / "대체로 적게 돌려주는 편" / "들쭉날쭉하고 예측하기 어려운 편". 행동 결과를 해석할 때 참가자의 belief를 반영하는 중요한 변수이다. 예를 들어 low-trust 행동이 "상대를 정확히 파악한 전략적 선택"인지 "사회적 신호 해석의 왜곡"인지를 구분하는 데 핵심적이다. |
| partner_classification_correct | binary | 🔵 DERIVED | 참가자의 분류가 실제 partner_type과 일치했는지 여부이다(0=불일치, 1=일치). 산출: `partner_classification_response`와 `partner_type`의 매칭 여부. 사회적 신호를 얼마나 정확히 학습했는지의 단순 정확도 지표이다. 사회불안이 높은 참가자가 정확도가 낮은지, 아니면 정확도는 높지만 행동 조절이 다른지를 구분하는 데 유용하다. |
| classification_confidence | int (1–7) | 🔴 RECORDED | 자신의 분류 판단에 대한 확신도를 1–7 Likert로 평가한 값이다. 맞게 맞췄는지뿐 아니라 "얼마나 확신을 가지고 해석했는지"를 알 수 있다. 사회불안이 높은 참가자는 정확하게 판단했더라도 확신이 낮을 수 있으며, 이는 사회적 판단에서의 인지적 자신감 저하를 시사한다. |
| willingness_to_play_again | int (1–7) | 🔴 RECORDED | 그 상대와 다시 게임하고 싶은지에 대한 1–7 Likert 평정이다. 단순 인지적 분류를 넘어 상대에 대한 주관적 접근/회피 동기를 반영한다. 이 변수와 partner_type의 상호작용은 사회불안군에서의 행동적 회피 경향을 직접 측정하는 지표가 된다. |

---

# 5. Partner algorithm log variables 🔴 RECORDED

이 변수들은 참가자 심리변수가 아니라, **프로그램 내부에서 partner behavior가 어떻게 생성되었는지**를 남기는 재현성/디버깅용 로그이다. 매 trial 기록한다. 분석에 직접 쓰이지 않더라도, 나중에 특정 참가자의 게임 경험을 완전히 재구성하는 데 필수적이다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| algorithm_version | string | 🔴 RECORDED | Partner 반환 알고리즘의 버전 식별자이다. 연구 진행 중 코드가 수정되면 어떤 세션이 어떤 규칙으로 생성되었는지 구분할 수 있어야 한다. 예: "v1.0", "v1.2-hotfix". |
| partner_seed | int | 🔴 RECORDED | 난수 생성에 사용된 seed이다. 동일한 seed를 쓰면 동일한 시뮬레이션 패턴을 정확히 재현할 수 있으므로, 디버깅과 재현성 검증에 핵심적이다. |
| planned_partner_return_ratio | float | 🔴 RECORDED | 알고리즘이 그 trial에서 의도한 목표 반환비율이다. 예를 들어 "이번 trial은 0.65 정도 반환하도록 설계한" 값이다. Noise 적용 전의 기저 값이며, 실제 실행된 값(actual)과 비교하여 알고리즘이 의도대로 작동했는지 확인할 수 있다. |
| actual_partner_return_ratio | float | 🔴 RECORDED | Noise나 boundary 제약을 적용한 뒤 실제로 실행된 반환비율이다. Planned와 actual이 다를 수 있는 이유는 noise_term 적용, 반환비율의 상한/하한 clipping, amount_sent가 0일 때의 예외 처리 등이다. 둘 다 저장하는 것이 원칙이다. |
| volatility_parameter | float | 🔴 RECORDED | Volatile partner의 변동성 크기를 결정하는 내부 파라미터이다. 예를 들어 trial 간 반환비율이 얼마나 크게 흔들릴 수 있는지 나타낸다. High/low reciprocity partner에서는 이 값이 작고, volatile partner에서는 크다. |
| noise_term | float | 🔴 RECORDED | 해당 trial에서 적용된 무작위 오차 성분이다. 각 trial의 반환이 deterministic하지 않고 약간의 자연스러운 변동을 갖도록 하는 값이며, 정규분포 또는 균일분포에서 추출될 수 있다. 이 값을 기록해야 정확한 재현이 가능하다. |
| contingency_schedule_id | string | 🔴 RECORDED | 어떤 사전 정의된 반환 스케줄 또는 규칙 세트를 사용했는지를 나타내는 ID이다. 여러 schedule을 counterbalancing하거나, 고정 시퀀스(예: 특정 trial에서 반드시 배신이 발생)를 사용할 경우 이 변수로 추적한다. |

---

# 6. RTG trial-level derived variables 🔵 DERIVED

아래 변수들은 4절(core trial-level RECORDED 변수)의 원자료로부터 **분석 단계에서 사후 계산**한다. 실험 코드에서 실시간 저장할 필요는 없지만, 분석 스크립트에서 재현 가능해야 한다.

## 6-1. Lag / 이전 trial 변수

이 변수들은 참가자의 현재 선택이 **직전 trial의 경험에 어떻게 영향을 받는지** 보기 위한 것이다. 동일 partner block 내에서만 계산하며, 각 block의 첫 trial(trial_within_partner=1)에서는 NA이다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| previous_amount_sent | float | 🔵 DERIVED | 직전 trial에서 참가자가 보낸 금액이다. 산출: 동일 partner block 내 `amount_sent(t-1)`. 현재 투자 수준이 이전에 비해 유지/증가/감소했는지 평가하는 기준선이다. |
| previous_partner_return_amount | float | 🔵 DERIVED | 직전 trial에서 상대가 돌려준 금액이다. 산출: 동일 partner block 내 `partner_return_amount(t-1)`. 참가자가 이 피드백을 바탕으로 다음 trial의 신뢰 수준을 조정하는지 보는 핵심 predictor이다. |
| previous_partner_return_ratio | float | 🔵 DERIVED | 직전 trial에서 상대의 반환비율이다. 산출: 동일 partner block 내 `partner_return_ratio(t-1)`. 절대 반환액보다 더 정규화된 피드백 정보이며, mixed-effects model과 RL 모형에서 핵심 predictor로 사용된다. |

## 6-2. Updating / 변화 변수

이 변수들은 사회불안이 단순히 trust 수준을 낮추는지(H1), 아니면 **피드백을 반영하는 방식 자체를 바꾸는지**(H2)를 분석하는 데 핵심적이다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| delta_sent_from_previous_trial | float | 🔵 DERIVED | 현재 trial의 amount_sent에서 직전 trial의 amount_sent를 뺀 값이다. 산출: `amount_sent(t) - amount_sent(t-1)`. 양수면 신뢰 증가, 음수면 신뢰 감소를 뜻한다. H2의 핵심 지표이다. |
| delta_return_from_previous_trial | float | 🔵 DERIVED | 현재 trial에서 받은 반환액이 직전 trial에 비해 얼마나 달라졌는지 나타낸다. 산출: `partner_return_amount(t) - partner_return_amount(t-1)`. Partner behavior의 변화량이며, 참가자가 반응해야 할 환경 변화의 크기이다. |
| trust_update_after_feedback | float | 🔵 DERIVED | 특정 trial의 피드백을 받은 뒤 **다음 trial에서** 투자액이 얼마나 변했는지를 나타낸다. 산출: `amount_sent(t+1) - amount_sent(t)`. delta_sent_from_previous_trial과 동일한 값이지만 시점을 "피드백을 받은 trial" 기준으로 정렬한 것이다. 예를 들어 return이 낮았을 때 다음 trial에 많이 줄이면 negative feedback에 민감하다고 볼 수 있다. |
| gain_or_loss_relative_to_expectation | float | 🔵 DERIVED | 참가자가 "기대했던 수준" 대비 실제 결과가 얼마나 좋았거나 나빴는지를 나타내는 prediction error 유사 지표이다. 산출: `partner_return_ratio(t) - rolling_mean_return_ratio(최근 3 trial)`. 명시적 기대 평정을 수집하지 않으므로 최근 rolling mean을 기준 기대치로 정의한다. Computational modeling의 예측 오차와 대응되는 행동 수준 지표이다. |

## 6-3. 사건 분류 변수

이 변수들은 특정 trial을 "배신", "호혜", "중립" 사건으로 범주화한다. **사전 정의 기준(preregistration 대상)**이며, 데이터를 보기 전에 확정한다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| betrayal_event_flag | binary | 🔵 DERIVED | 해당 trial의 partner response가 사전 정의 기준에 따라 "배신적 사건"인지 여부이다(0=아님, 1=배신). 산출: `partner_return_ratio < 0.25`이면 1. 이 기준은 상대가 받은 금액의 25% 미만을 돌려준 경우로, 참가자 입장에서 명백한 손해를 경험한 trial을 식별한다. amount_sent=0인 trial은 해당 없음(NA)으로 처리한다. |
| reciprocity_event_flag | binary | 🔵 DERIVED | 해당 trial의 반환이 충분히 높아 "호혜적/신뢰보상적 사건"인지 여부이다(0=아님, 1=호혜). 산출: `partner_return_ratio ≥ 0.50`이면 1. 상대가 받은 금액의 절반 이상을 돌려준 경우로, 참가자 입장에서 신뢰가 보상받은 trial이다. |
| neutral_event_flag | binary | 🔵 DERIVED | 배신도 아니고 강한 호혜도 아닌 중간 범주의 피드백인지 여부이다(0=아님, 1=중립). 산출: 위 두 조건에 해당하지 않는 경우(0.25 ≤ partner_return_ratio < 0.50). |

## 6-4. Recovery / 배신 적응 변수

이 변수들은 참가자가 배신 사건 이후 얼마나 오래 위축되는지, 얼마나 잘 회복하는지를 측정한다. H1(withdrawal)과 H2(unstable building)의 핵심 행동지표이다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| trials_since_last_betrayal | int | 🔵 DERIVED | 가장 최근 배신 사건(betrayal_event_flag=1) 이후 몇 개의 trial이 지났는지를 나타낸다. 산출: 동일 partner block 내에서 마지막 betrayal trial로부터의 trial 수. 배신이 없었던 경우 NA. 배신의 여파가 시간이 지나면서 줄어드는지 보는 데 필요하다. |
| sent_change_after_betrayal_1trial | float | 🔵 DERIVED | 배신 사건 직후 **바로 다음 1 trial**에서 투자액이 얼마나 변했는지이다. 산출: 배신 trial을 t라 할 때 `amount_sent(t+1) - amount_sent(t)`. 즉각적인 신뢰 감소 또는 방어적 반응의 강도를 보여준다. 값이 크게 음수일수록 배신에 대한 즉각적 반응이 강한 것이다. |
| sent_change_after_betrayal_3trial | float | 🔵 DERIVED | 배신 사건 후 3 trial 이내에 투자액이 어떻게 변화했는지이다. 산출: `mean(amount_sent(t+1, t+2, t+3)) - amount_sent(t)`. 1 trial 변화보다 더 안정적인 단기 회복/지속 위축 지표이다. 남은 trial이 3개 미만이면 가용한 trial로 계산한다. |
| recovered_to_pre_betrayal_level_flag | binary | 🔵 DERIVED | 배신 이후 일정 기간 내에 투자 수준이 배신 이전 수준으로 회복되었는지 여부이다(0=미회복, 1=회복). 산출: 배신 전 3 trial 평균을 기준으로, 배신 후 5 trial 내에 그 수준의 80% 이상으로 복귀했으면 1. 회복 탄력성을 단순한 이진 지표로 표현한다. |

## 6-5. Instability / 변동성 변수

이 변수들은 참가자가 trust를 얼마나 안정적으로 형성하는지, 아니면 trial마다 심하게 흔들리는지를 평가한다. H2(unstable trust building)의 핵심 지표이다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| rolling_mean_sent_last3 | float | 🔵 DERIVED | 최근 3개 trial의 평균 투자액이다. 산출: 동일 partner block 내 `mean(amount_sent(t), amount_sent(t-1), amount_sent(t-2))`. 순간적인 선택 하나보다 더 안정된 국소적 신뢰수준을 나타낸다. Trial 1~2에서는 가용 trial로 계산한다. |
| rolling_sd_sent_last3 | float | 🔵 DERIVED | 최근 3개 trial에서 투자액의 표준편차이다. 산출: 동일 partner block 내 `sd(amount_sent(t), amount_sent(t-1), amount_sent(t-2))`. 짧은 구간 내 trust behavior의 흔들림 정도를 나타낸다. 이 값이 크면 참가자가 상대를 아직 파악하지 못했거나 의사결정이 불안정한 것으로 해석할 수 있다. |
| absolute_change_in_sent | float | 🔵 DERIVED | 현재 trial 투자액과 직전 trial 투자액의 차이의 절대값이다. 산출: `|amount_sent(t) - amount_sent(t-1)|`. 방향과 무관하게 "얼마나 크게 바뀌었는지"를 보여주는 순수 불안정성 지표이다. delta_sent_from_previous_trial이 방향 정보를 포함하는 반면, 이 변수는 크기만 본다. |
| initial_trust_overall | float | 🔵 DERIVED | 전체 RTG에서 가장 첫 trial에 보낸 금액이다. 산출: `amount_sent` where `rtg_trial_index = 1`. 어떤 상대와의 경험도 없는 상태에서의 전반적 초기 신뢰 성향을 반영한다. H1(withdrawal)의 직접 지표이다. |
| initial_trust_per_partner | float | 🔵 DERIVED | 각 partner block의 첫 trial에서 보낸 금액이다. 산출: `amount_sent` where `trial_within_partner = 1`, partner별. 새로운 상대를 만났을 때의 baseline trust를 partner 간 비교할 수 있다. 이전 block의 경험이 다음 block의 초기 trust에 영향을 미치는 carry-over 효과를 확인할 수 있다. |

---

# 7. Data quality flags 🔵 DERIVED

이 변수들은 분석 포함/제외를 결정하기 위한 품질관리용 플래그이다. 실험 코드에서 일부 기록하고(timeout, missing), 나머지는 데이터 정리 단계에서 부여한다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| tutorial_trial_flag | binary | 🔴 RECORDED | 해당 행(trial)이 RTG 튜토리얼 trial인지 여부이다(0=본실험, 1=튜토리얼). 튜토리얼 자료는 분석에서 제외하므로 반드시 본실험 trial과 분리해야 한다. 실험 코드에서 직접 기록한다. |
| main_task_trial_flag | binary | 🔴 RECORDED | 해당 trial이 본 분석 대상인 main task에 속하는지 여부이다(0=비대상, 1=대상). Tutorial, practice, aborted trial과 구분하는 데 유용하다. 실험 코드에서 직접 기록한다. |
| missing_response_flag | binary | 🔴 RECORDED | 참가자가 해당 trial에서 응답하지 않았거나 기술적 오류로 값이 비어 있는지를 나타낸다(0=정상, 1=결측). 실험 코드에서 직접 기록한다. |
| timeout_flag | binary | 🔴 RECORDED | 제한 시간 내에 응답하지 못했는지 여부이다(0=시간 내 응답, 1=시간 초과). missing_response_flag와 구분해야 한다. missing은 기술적 오류 포함이고, timeout은 참가자의 의사결정 지연만을 반영한다. 실험 코드에서 직접 기록한다. |
| exclusion_reason | string | 🔵 DERIVED | 분석 제외 시 그 이유를 텍스트 또는 코드로 기록한다. 예: "comprehension_failure", "incomplete_session", "software_error", "excessive_missing". 데이터 정리 단계에서 연구자가 부여하며, include_in_analysis_flag와 함께 사용한다. |

---

# 8. Participant-level derived summary variables 🔵 DERIVED

이 변수들은 trial-level raw data(4절)에서 **사후 계산되는 요약 지표**이다. 논문에서 2차 분석(participant-level regression)과 매개 모형(SEM)에 직접 투입된다. 모든 산출은 main_task_trial_flag=1인 trial만을 대상으로 한다.

## 8-1. Trust level 요약

| Variable name | Type | Source | 산출 방법 | 가설 대응 | Description |
|---|---|---|---|---|---|
| mean_sent_all_trials | float | 🔵 DERIVED | 전체 45 trial의 `amount_sent` 평균 | H1 | 전체 RTG에서 평균적으로 얼마를 보냈는지를 나타낸다. 가장 단순한 전반적 신뢰 수준 지표이다. 사회불안이 높을수록 이 값이 낮으면 H1(withdrawal)을 지지한다. |
| mean_sent_high_partner | float | 🔵 DERIVED | partner_type=1인 trial의 `amount_sent` 평균 | H1 | High reciprocity partner에게 평균적으로 얼마를 보냈는지 나타낸다. "호혜적인 상대에게 trust를 형성할 수 있는가"를 보여준다. 사회불안이 높은 참가자가 이 값마저 낮다면, 좋은 상대조차 신뢰하지 못하는 전반적 저신뢰를 시사한다. |
| mean_sent_low_partner | float | 🔵 DERIVED | partner_type=2인 trial의 `amount_sent` 평균 | H3 | Low reciprocity partner에게 평균적으로 얼마를 보냈는지 나타낸다. 이 값이 지나치게 높으면 self-protection failure 또는 over-trust를 시사한다(H3). 반대로 적절히 낮으면 합리적 학습의 증거이다. |
| mean_sent_volatile_partner | float | 🔵 DERIVED | partner_type=3인 trial의 `amount_sent` 평균 | H2 | Volatile reciprocity partner에게 평균적으로 얼마를 보냈는지 나타낸다. 불확실한 상대에 대한 전반적 접근 수준을 반영한다. |
| first_trial_sent_overall | float | 🔵 DERIVED | `amount_sent` where `rtg_trial_index = 1` | H1 | 전체 RTG의 첫 trial 투자액이다. initial_trust_overall과 동일한 값이지만, participant-level 요약변수로서의 역할을 명시적으로 부여한다. 학습 이전의 baseline interpersonal trust tendency로 해석한다. |
| first_trial_sent_each_partner | float (×3) | 🔵 DERIVED | 각 partner block의 `amount_sent` where `trial_within_partner = 1` | H1 | 각 partner를 처음 만났을 때의 첫 투자액이다. 새로운 상대를 대할 때의 초기 기대와 경계 수준을 보여준다. Partner별로 3개 값이 산출되므로 평균을 쓰거나 partner별로 분리 분석한다. |

## 8-2. Updating 요약

| Variable name | Type | Source | 산출 방법 | 가설 대응 | Description |
|---|---|---|---|---|---|
| mean_delta_after_positive_feedback | float | 🔵 DERIVED | `reciprocity_event_flag=1`인 trial 직후의 `delta_sent_from_previous_trial` 평균 | H2 | 긍정적 피드백(reciprocity event) 이후 평균적으로 투자액을 얼마나 올렸는지를 나타낸다. 호혜를 학습하고 trust를 올리는 경향을 반영한다. 사회불안이 높은 참가자에서 이 값이 작으면, 좋은 피드백에도 trust를 잘 올리지 못하는 것을 의미한다(H2의 positive updating 약화). |
| mean_delta_after_negative_feedback | float | 🔵 DERIVED | `betrayal_event_flag=1`인 trial 직후의 `delta_sent_from_previous_trial` 평균 | H2 | 부정적 피드백(betrayal event) 이후 평균적으로 투자액을 얼마나 줄였는지를 나타낸다. 배신 민감성 또는 방어적 감소 반응을 반영한다. 값이 크게 음수일수록 배신에 민감하다. H2에서 사회불안이 높은 참가자는 이 값의 절대크기가 클 것으로 예상한다. |
| positive_update_slope | float | 🔵 DERIVED | `previous_partner_return_ratio`가 높을 때 `delta_sent`의 회귀 기울기 (reciprocity event trial 한정) | H2 | 긍정적 피드백의 크기에 따라 투자 증가가 얼마나 가파르게 나타나는지를 요약한 기울기이다. 개인별로 `previous_partner_return_ratio → delta_sent`의 단순 회귀에서 추출한다. |
| negative_update_slope | float | 🔵 DERIVED | `previous_partner_return_ratio`가 낮을 때 `delta_sent`의 회귀 기울기 (betrayal event trial 한정) | H2 | 부정적 피드백의 크기에 따라 투자 감소가 얼마나 가파르게 나타나는지를 요약한 기울기이다. positive_update_slope과의 비교(비대칭)가 H2의 핵심 검정이다. |
| learning_index_high_partner | float | 🔵 DERIVED | high partner 후반 5 trial 평균 − 초반 5 trial 평균의 `amount_sent` | H1, H2 | High partner에 대해 trial이 지날수록 신뢰를 얼마나 잘 형성했는지 나타내는 학습 지표이다. 양수면 호혜적 상대에게 점차 trust를 높인 것이다. |
| learning_index_low_partner | float | 🔵 DERIVED | low partner 후반 5 trial 평균 − 초반 5 trial 평균의 `amount_sent` | H3 | Low partner에 대해 trial이 지날수록 투자를 얼마나 적절히 줄였는지 나타내는 학습 지표이다. 음수면 비호혜적 상대에게 점차 trust를 낮춘(적절한 학습) 것이다. 사회불안이 높은 H3군에서 이 값이 0에 가까우면 학습 실패를 시사한다. |
| discrimination_index | float | 🔵 DERIVED | `mean_sent_high_partner - mean_sent_low_partner` | H1, H2, H3 | 좋은 상대와 나쁜 상대를 행동적으로 얼마나 잘 구분했는지를 보여준다. 값이 클수록 구분이 잘 된 것이다. 사회불안 효과가 "전반적 저투자"(H1)라면 두 값이 모두 낮아 discrimination_index는 유지될 수 있고, "학습 실패"(H2/H3)라면 discrimination_index 자체가 작아진다. |

## 8-3. Instability 요약

| Variable name | Type | Source | 산출 방법 | 가설 대응 | Description |
|---|---|---|---|---|---|
| sd_sent_all_trials | float | 🔵 DERIVED | 전체 45 trial의 `amount_sent` 표준편차 | H2 | 전체 trial에서 투자액의 변동성이다. 값이 클수록 trial 간 trust behavior가 더 많이 흔들렸다는 뜻이다. 다만 이 값에는 partner 간 차이도 포함되므로, partner 내 변동성(instability_index_volatile_partner)과 함께 해석해야 한다. |
| mean_absolute_trial_to_trial_change | float | 🔵 DERIVED | 전체 trial의 `absolute_change_in_sent` 평균 | H2 | 인접한 trial 사이에서 투자액이 평균적으로 얼마나 크게 바뀌는지를 나타낸다. 방향과 무관한 순수 instability 지표이다. sd_sent_all_trials와 달리, 전반적 수준의 차이가 아니라 trial-to-trial 점프의 크기를 직접 반영한다. |
| instability_index_volatile_partner | float | 🔵 DERIVED | partner_type=3인 trial의 `absolute_change_in_sent` 평균 또는 `amount_sent` 표준편차 | H2 | Volatile partner 조건에서의 투자 변동성을 따로 요약한 값이다. 불확실한 상대에 대한 행동적 흔들림을 평가하는 핵심 H2 지표이다. 사회불안이 높은 참가자에서 이 값이 특별히 크면, 예측 불가능한 상대에게 과대반응하는 패턴을 시사한다. |

## 8-4. Betrayal / recovery 요약

| Variable name | Type | Source | 산출 방법 | 가설 대응 | Description |
|---|---|---|---|---|---|
| betrayal_drop_magnitude | float | 🔵 DERIVED | 모든 betrayal event 직후 `sent_change_after_betrayal_1trial`의 평균(절대값) | H1, H2 | 배신 사건 직후 투자액이 얼마나 크게 떨어졌는지를 요약한 값이다. 배신 민감성의 대표 지표이다. H1에서는 큰 drop이 예상되고, H3에서는 오히려 drop이 작은 것이 예상된다. |
| betrayal_recovery_rate | float | 🔵 DERIVED | 배신 후 투자수준이 배신 전 수준으로 복귀하는 속도 (trial 수의 역수 또는 지수적 회복 곡선의 기울기) | H1 | 배신 이후 투자수준이 다시 회복되는 속도이다. 회복력이 높을수록 빠르게 baseline에 가까워진다. 사회불안이 높은 참가자에서 이 값이 낮으면, 배신의 영향이 오래 지속되는 것을 의미한다. |
| number_of_trials_to_recover | int | 🔵 DERIVED | 배신 전 수준의 80%로 돌아오기까지 걸린 trial 수의 평균 | H1 | 배신 전 수준으로 돌아오기까지 걸린 trial 수이다. 값이 클수록 배신의 영향이 오래 지속된 것이다. 회복하지 못한 경우 NA 또는 최대값(15)으로 처리한다. |
| persistent_distrust_after_betrayal | float / binary | 🔵 DERIVED | 배신 후 나머지 trial에서의 평균 투자가 배신 전 대비 일정 비율(예: 50%) 이하로 유지되었는지 | H1 | 배신 이후에도 장기간 낮은 투자 상태가 지속되는지를 나타낸다. 연속형(비율)으로도, 일정 기준 이상이면 1로 이진화할 수도 있다. H1(withdrawal)의 극단적 형태를 포착하는 지표이다. |

## 8-5. Over-trust / self-protection failure 요약

| Variable name | Type | Source | 산출 방법 | 가설 대응 | Description |
|---|---|---|---|---|---|
| overtrust_index_low_partner | float | 🔵 DERIVED | `mean_sent_low_partner`를 `mean_sent_all_trials`로 나눈 비율, 또는 low partner 후반 5 trial 평균이 여전히 높은 정도 | H3 | Low reciprocity partner에게도 상대적으로 높은 투자를 계속 유지하는 정도를 나타낸다. 명백히 신뢰할 가치가 낮은 상대에게도 과도하게 trust를 유지하면 값이 커진다. H3(over-trust/self-protection failure)의 핵심 지표이다. |
| protection_failure_index | float | 🔵 DERIVED | low partner에서 betrayal event 후에도 투자 감소가 불충분한 정도: `mean_delta_after_negative_feedback`의 절대값이 일정 기준 이하인 비율 | H3 | 반복적인 낮은 반환에도 불구하고 투자 감소가 충분히 일어나지 않는 정도를 나타낸다. Self-protective adjustment의 실패를 직접 반영하는 지표이다. overtrust_index가 "결과적으로 얼마나 많이 보냈는가"라면, protection_failure_index는 "배신에 대한 반응이 얼마나 부족했는가"라는 과정적 측면을 포착한다. |

---

# 9. Computational modeling parameters 🔵 DERIVED

Trial-by-trial Rescorla-Wagner 또는 hierarchical Bayesian 모형을 적용하여 추정하는 개인별 잠재 파라미터이다. 이 변수들은 원자료에서 직접 계산하는 것이 아니라, **모형 적합(model fitting)을 통해 추정**된다. 2nd-stage regression에서 사회불안 점수 및 공변량과 연결한다.

| Variable name | Type | Source | Description |
|---|---|---|---|
| alpha_positive | float | 🔵 DERIVED (model-estimated) | α⁺, 긍정적 피드백(호혜)에서의 학습 속도이다. Rescorla-Wagner 모형에서 prediction error가 양수일 때 기대치를 업데이트하는 비율이다. 이 값이 클수록 호혜적 경험을 빠르게 학습하여 trust를 높인다. H2에서 사회불안이 높은 참가자는 이 값이 낮을 것으로 예상한다. |
| alpha_negative | float | 🔵 DERIVED (model-estimated) | α⁻, 부정적 피드백(배신)에서의 학습 속도이다. Prediction error가 음수일 때 기대치를 업데이트하는 비율이다. 이 값이 클수록 배신 경험에 민감하게 반응하여 trust를 빠르게 낮춘다. H2에서 사회불안이 높은 참가자는 이 값이 높을 것으로 예상한다. α⁺와의 비대칭(α⁻ > α⁺)이 H2의 핵심 예측이다. |
| prior_trust | float | 🔵 DERIVED (model-estimated) | β₀, 초기 신뢰 기대치이다. 모형에서 학습이 시작되기 전 상대의 reciprocation에 대한 사전 기대를 반영한다. H1에서는 이 값이 낮고, H3에서는 오히려 높을 것으로 예상한다. |
| inverse_temperature | float | 🔵 DERIVED (model-estimated) | β, 선택의 확률적 정밀도(또는 탐색-착취 균형)를 나타내는 파라미터이다. 값이 크면 기대 가치에 따라 결정론적으로 선택하고, 값이 작으면 무작위에 가까운 선택을 한다. 사회불안이 높은 참가자에서 이 값이 낮으면, 내적 기대가 있더라도 행동에 일관되게 반영하지 못하는 것을 시사한다. |

---

# 활용 원칙 요약

1. **🔴 RECORDED 변수는 실험 코드에 반드시 구현**해야 한다. 이 변수가 빠지면 사후에 복구할 수 없다.
2. **🔵 DERIVED 변수는 분석 스크립트에서 재현 가능**해야 한다. 실험 중 실시간으로 계산해도 무방하지만, 원자료(RECORDED)가 보존되어 있으면 언제든 재계산할 수 있다.
3. Raw data는 덮어쓰지 않고 원본 보존한다.
4. 설문은 item-level과 total/subscale-level을 모두 저장한다.
5. RTG에서 매 trial마다 participant 행동 변수, partner 피드백 변수, algorithm log를 반드시 기록한다.
6. Tutorial/practice trial은 `tutorial_trial_flag` 및 `main_task_trial_flag`로 본실험과 구분한다.
7. 사건 분류 기준(betrayal < 0.25, reciprocity ≥ 0.50)은 preregistration에 포함시키며 데이터 확인 전에 확정한다.
8. Partner algorithm의 seed, version, schedule ID를 반드시 기록하여 완전한 재현성을 확보한다.
