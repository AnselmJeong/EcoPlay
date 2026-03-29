# Repeated Trust Game 연구용 Codebook (상세 Description 포함)

아래 문서는 앞서 정리한 실험 설계를 바탕으로, 실제 코드 구현과 데이터 분석에 바로 사용할 수 있도록 각 변수의 의미를 한국어로 상세히 설명한 codebook입니다. 설명은 가능한 한 다음 기준에 따라 작성했습니다.

- 이 변수가 **언제 기록되는지**
- **무엇을 측정하는지**
- 분석에서 **왜 필요한지**
- 혼동하기 쉬운 변수와 **어떻게 구분해야 하는지**

---

# 1. Participant-level variables

이 수준의 변수는 **참가자 1명당 1번만 저장**됩니다. 즉, trial마다 반복되지 않는 기본 정보입니다.

| Variable name | Type | Description |
|---|---|---|
| hospital_id | string | 참가자의 병록번호. 이후 모든 설문, 과제, trial 데이터는 이 ID를 기준으로 연결됩니다. |
| admission | categorical | 현재 입원해있는지 여부 (입원/외래 ) |
| name | string | 환자 이름. 병록번호와 대조하여 error를 감지 |
| sex | categorical | 남/여 |
| birth_date | date | 참가자의 생년월일. 나이는 사회불안, 의사결정, 반응속도 모두 연령의 영향을 받을 수 있으므로 핵심 공변량 후보입니다. |
| education | categorical | 중졸, 고졸, 대학 재학, 대학 졸업, 대학원 이상 |
| diagnosis | string / categorical | 가장 주된 정신과 진단명을 저장. 아마도 categorical로 하는 것이 나을 듯 |
| medication_status | categorical/ multiple selection | 현재 복용 약물. `0=none, 1=antidepressant, 2=benzodiazepine, 3=antipsychotic`로 정한 후 다중 선택. 약물은 반응속도, 불안 수준, 학습 패턴에 영향을 줄 수 있어 공변량 후보입니다. |

---

# 2. Questionnaire variables

설문은 반드시 **item-level raw data**와 **total score**를 모두 저장하는 것이 좋습니다. 총점만 저장하면, 나중에 역채점 오류나 특정 문항 이상치를 수정할 수 없습니다.

## 2-1. Item-level variables

| Variable name | Type | Description |
|---|---|---|
| ksias_item_01 ~ ksias_item_n | int | K-SIAS 각 문항의 원점수입니다. 각 문항에 대해 참가자가 응답한 숫자를 그대로 저장합니다. 사회적 상호작용 상황에서의 불안 수준을 구성하는 세부 문항 반응을 보존하기 위한 것입니다. |
| ksps_item_01 ~ ksps_item_n | int | K-SPS 각 문항의 원점수입니다. 특히 타인에게 관찰되거나 평가받는 상황에서의 불안을 반영합니다. |
| kbfne_item_01 ~ kbfne_item_n | int | K-BFNE 각 문항 점수입니다. 부정적 평가에 대한 두려움이라는, 사회불안의 핵심 인지적 성분을 보다 직접적으로 측정합니다. |
| phq9_item_01 ~ phq9_item_09 | int | 우울증상 각 문항의 점수입니다. 사회불안과 함께 나타나는 우울의 영향을 통제하기 위해 필요합니다. |
| gad7_item_01 ~ gad7_item_07 | int | 범불안 증상 각 문항의 점수입니다. 사회불안 특이 효과와 일반적 불안 효과를 구분하는 데 중요합니다. |
| ucla_item_01 ~ ucla_item_n | int | UCLA loneliness scale 각 문항 점수입니다. 대인관계 회피, 사회적 연결감 저하와 trust behavior 간의 관련성을 고려할 때 보조 공변량으로 의미가 있습니다. |

## 2-2. Scale-level variables (derived)

| Variable name | Type | Description |
|---|---|---|
| ksias_total | int | K-SIAS 전체 총점입니다. 사회적 상호작용 불안의 전반적 수준을 나타내는 대표 지표로 사용할 수 있습니다. |
| ksps_total | int | K-SPS 전체 총점입니다. 수행/관찰 상황에서의 사회불안 정도를 나타냅니다. |
| kbfne_total | int | K-BFNE 총점입니다. 타인의 부정적 평가에 대한 두려움 정도를 나타내며, trust game에서 상대 해석 편향과 연결될 가능성이 있습니다. |
| phq9_total | int | PHQ-9 총점으로, 우울 증상의 전반적 심각도를 나타냅니다. 사회불안 효과를 해석할 때 통제해야 할 중요한 공변량입니다. |
| gad7_total | int | GAD-7 총점으로, 일반적 불안 수준을 나타냅니다. 사회불안 특이성 검증을 위해 필요합니다. |
| ucla_total | int | UCLA loneliness 총점으로, 주관적 외로움과 사회적 고립감을 반영합니다. 낮은 신뢰 혹은 회피적 경향과 관련될 수 있습니다. |

---

# 3. Public Goods Game variables

PGG는 본 연구에서 핵심 과제는 아니지만, **일반적인 협력 성향 또는 집단적 prosocial tendency**를 보는 보조 지표로 의미가 있습니다.

## 3-1. Trial-level variables

| Variable name | Type | Description |
|---|---|---|
| pgg_trial_index | int | PGG 내에서 몇 번째 trial인지 나타냅니다. trial 순서에 따른 피로, 학습, 전략 변화 등을 확인할 수 있습니다. |
| pgg_amount_sent | float | 참가자가 공공 풀에 기여한 금액입니다. 이 값이 클수록 집단 협력 성향이 높다고 볼 수 있습니다. |
| pgg_group_total_sent | float | 집단 전체가 그 trial에서 공공 풀에 넣은 총 기여액입니다. 컴퓨터 시뮬레이션이라면 알고리즘이 생성한 값이 됩니다. 참가자가 받는 사회적 피드백의 핵심 정보입니다. |
| pgg_amount_returned | float | 그룹 기여 결과를 반영해 참가자에게 돌아온 보상액입니다. 즉, 참가자가 “협력의 결과로 실제 얼마를 벌었는지”를 나타냅니다. |
| pgg_response_time | int | 참가자가 얼마를 기여할지 결정하는 데 걸린 시간입니다. 갈등, 망설임, 숙고 수준의 간접 지표가 될 수 있습니다. 밀리초 단위 저장이 좋습니다. |

## 3-2. Other variables (derived)

| Variable name | Type | Description |
|---|---|---|
| pgg_mean_contribution | float | 참가자가 PGG 전체 trial에서 평균적으로 얼마나 기여했는지를 나타냅니다. 일반적 협력 성향의 요약 지표입니다. |
| pgg_contribution_variability | float | trial 간 기여액의 변동성입니다. 어떤 참가자는 일관되게 기여하고, 어떤 참가자는 trial마다 크게 흔들릴 수 있는데, 이 차이를 반영합니다. |

---

# 4. Repeated Trust Game core trial-level variables

이 부분이 본 연구의 핵심입니다. 모든 trial마다 저장되어야 하며, 나중에 거의 모든 분석은 여기서 출발합니다.

| Variable name | Type | Description |
|---|---|---|
| tg_block_index | int | 현재 trial이 어느 partner block에 속하는지를 나타냅니다. 예를 들어 첫 번째 partner block, 두 번째 partner block, 세 번째 partner block입니다. partner별 학습과 block 효과를 구분할 때 필요합니다. |
| tg_trial_index | int | 각 block 내에서 몇 번째 trial인지 나타내는 번호. Block_index와 함께 이어져서 trial의 고유 index를 생성 |
| tg_partner_type | categorical | 현재 상대하고 있는 상대의 reciprocity 유형입니다. 예: 1=high reciprocity, 2=low reciprocity, 3=volatile reciprocity. 참가자는 이 정보를 모르고, 연구자는 ground truth로 사용합니다. |
| tg_amount_sent | float | 참가자가 상대에게 보낸 금액입니다. trust의 가장 직접적인 행동지표입니다. 많이 보낼수록 상대를 더 신뢰하거나 더 협력적인 선택을 한 것으로 해석할 수 있습니다. |
| tg_amount_received_by_partner | float | 상대가 실제로 받은 금액입니다. 일반적으로 `tg_amount_sent × multiplier`입니다. 즉, partner가 반환 결정을 할 때 기준이 되는 액수입니다. |
| tg_amount_returned | float | 상대가 참가자에게 실제로 돌려준 금액입니다. partner의 협력성, 호혜성, 배신 여부를 평가하는 핵심 피드백입니다. |
| tg_partner_return_ratio | float | 상대가 받은 금액 중 얼마를 돌려줬는지의 비율입니다. 즉 `tg_amount_returned / tg_amount_received_by_partner`입니다. 절대 금액보다 상대의 호혜적 성향을 비교하기에 더 적합한 지표입니다. |
| tg_payoff_this_trial | float | 한 trial이 끝났을 때 참가자가 얻은 이득. 보통 `tg_amount_returned - tg_amount_sent`입니다. 참가자 입장에서는 이번 선택이 얼마나 유리했는지 나타내는 최종 outcome입니다. |
| tg_cumulative_payoff | float | 지금까지 모든 trial에서 누적된 총 보상액입니다. 참가자가 전략을 조정할 때 참고하는 장기적 성과 지표가 될 수 있습니다. |
| tg_response_time | int | 참가자가 이번 trial에서 얼마를 보낼지 결정하는 데 걸린 시간입니다. 높은 불확실성, 갈등, 위협 해석과 관련될 가능성이 있습니다. |

---

# 5. Lag / previous-trial variables (derived)

이 변수들은 참가자의 현재 선택이 **직전 trial의 경험에 어떻게 영향을 받는지** 보기 위해 필요합니다.

| Variable name | Type | Description |
|---|---|---|
| tg_previous_amount_sent | float | 직전 trial에서 참가자가 보낸 금액입니다. 현재 투자 수준이 이전 투자 수준에 비해 유지/증가/감소했는지 평가할 수 있습니다. |
| tg_previous_amount_returned | float | 직전 trial에서 상대가 실제로 돌려준 금액입니다. 참가자는 이 피드백을 바탕으로 다음 trial의 신뢰 수준을 조정할 수 있습니다. |
| tg_previous_partner_return_ratio | float | 직전 trial에서 상대가 받은 금액 대비 얼마를 돌려줬는지의 비율입니다. 절대 반환액보다 더 정규화된 피드백 정보이며, 학습모형에서는 매우 중요한 predictor가 됩니다. |

---

# 6. Updating / change variables (derived)

이 변수들은 사회불안이 단순히 trust 수준을 낮추는지, 아니면 **피드백을 반영하는 방식 자체를 바꾸는지**를 분석하는 데 중요합니다.

| Variable name | Type | Description |
|---|---|---|
| tg_delta_amount_sent | float | 현재 trial의 amount_sent에서 직전 trial의 amount_sent를 뺀 값입니다. 양수면 신뢰 증가, 음수면 신뢰 감소를 뜻합니다. |
| tg_delta_amount_returned | float | 현재 trial에서 받은 반환액이 직전 trial에 비해 얼마나 달라졌는지 나타냅니다. partner behavior의 변화량입니다. |

---

# 7. Event classification variables

이 변수들은 특정 trial을 “배신”, “호혜”, “중립” 사건으로 범주화하기 위한 것입니다. 사건 단위 분석에 필요합니다.

| Variable name | Type | Description |
|---|---|---|
| tg_betrayal_flag | binary | 그 trial의 partner response를 사전에 정의한 기준에 따라 “배신적 사건”으로 분류했는지 여부입니다. 예를 들어 `partner_return_ratio < 0.25`이면 1로 둘 수 있습니다. 중요한 점은 이 기준을 데이터 보기 전에 미리 정해두는 것입니다. |
| tg_reciprocity_flag | binary | 그 trial의 반환이 충분히 높아 “호혜적/신뢰보상적 사건”으로 간주되는지 여부입니다. 예를 들어 `partner_return_ratio ≥ 0.50` 같은 기준을 둘 수 있습니다. |

---

# 8. Recovery / betrayal adaptation variables (derived)

이 변수들은 참가자가 배신 사건 이후 얼마나 오래 위축되는지, 얼마나 잘 회복하는지를 측정합니다.

| Variable name | Type | Description |
|---|---|---|
| tg_trials_since_last_betrayal | int | 가장 최근 배신 사건 이후 몇 개의 trial이 지났는지를 나타냅니다. 배신의 여파가 시간이 지나면서 줄어드는지 보는 데 필요합니다. |
| tg_sent_change_after_betrayal_1 | float | 배신 사건 직후 다음 trial에서 투자액이 얼마나 변했는지를 나타냅니다. 즉각적인 신뢰 감소 또는 방어적 반응의 강도를 보여줍니다. |
| tg_sent_change_after_betrayal_3 | float | 배신 사건 후 3 trial 이내에 투자액이 어떻게 변화했는지를 반영합니다. 단기 회복 또는 지속적 위축을 평가하는 데 유용합니다. |

---

# 9. Post-block perception variables

이 변수들은 참가자가 상대의 특성을 얼마나 정확히 파악했는지, 그리고 그 상대에 대해 얼마나 접근/회피적인 태도를 가지는지 측정합니다.

| Variable name | Type | Description |
|---|---|---|
| tg_partner_classification | categorical | 각 partner block 종료 후 참가자가 그 상대를 어떤 유형으로 인식했는지에 대한 응답입니다. 즉, “많이 돌려주는 편 / 적게 돌려주는 편 / 들쭉날쭉하고 예측하기 어려운 편” 중 무엇으로 보았는지를 기록합니다. 행동 결과를 해석할 때 belief를 반영하는 중요한 변수입니다. |
| tg_willingness_to_play_again | int | 그 상대와 다시 게임하고 싶은지에 대한 1–7 Likert 평정입니다. 이는 단순 인지적 분류를 넘어, 상대에 대한 주관적 접근/회피 동기를 반영합니다. |

---

# 10. Partner algorithm log variables

이 변수들은 참가자 심리변수가 아니라, **프로그램 내부에서 partner behavior가 어떻게 생성되었는지**를 남기는 디버깅/재현성용 로그입니다. 매우 중요합니다.

| Variable name | Type | Description |
|---|---|---|
| tg_planned_partner_return_ratio | float | 알고리즘이 그 trial에서 의도한 목표 반환비율입니다. 예를 들어 “이번 trial은 0.65 정도 반환하도록 설계”한 값입니다. |
| tg_actual_partner_return_ratio | float | noise나 제약을 적용한 뒤 실제로 실행된 반환비율입니다. planned와 actual이 다를 수 있기 때문에 둘 다 저장하는 것이 좋습니다. |

---

# 11. Participant-level summary variables (derived)

이 변수들은 trial-level raw data에서 사후 계산되는 **요약 지표**입니다. 논문에서 1차 분석에 바로 들어가기 좋습니다.

## 12-1. Trust level summary

| Variable name | Type | Description |
|---|---|---|
| tg_mean_sent_all_trials | float | 전체 RTG trial에서 평균적으로 얼마를 보냈는지를 나타냅니다. 가장 단순한 전반적 신뢰 수준 지표입니다. |
| tg_mean_sent_high_partner | float | high reciprocity partner에게 평균적으로 얼마를 보냈는지 나타냅니다. “호혜적인 상대에게 trust를 형성할 수 있는가”를 보여줍니다. |
| tg_mean_sent_low_partner | float | low reciprocity partner에게 평균적으로 얼마를 보냈는지 나타냅니다. 이 값이 지나치게 높으면 self-protection failure 또는 over-trust 가능성을 시사할 수 있습니다. |
| tg_mean_sent_volatile_partner | float | volatile reciprocity partner에게 평균적으로 얼마를 보냈는지 나타냅니다. 불확실한 상대에 대한 전반적 접근 수준을 반영합니다. |
| tg_first_trial_sent_each_block | float | 각 partner를 처음 만났을 때의 첫 투자액입니다. 새로운 상대를 대할 때의 초기 기대와 경계 수준을 보여줍니다. |

## 12-2. Updating summary (derived)

| Variable name | Type | Description |
|---|---|---|
| tg_mean_delta_after_positive_feedback | float | 긍정적 피드백(높은 반환) 이후 평균적으로 투자액을 얼마나 조정했는지를 나타냅니다. 호혜를 학습하고 trust를 올리는 경향을 반영합니다. |
| tg_mean_delta_after_negative_feedback | float | 부정적 피드백(낮은 반환) 이후 평균적으로 투자액을 얼마나 조정했는지를 나타냅니다. 배신 민감성 또는 방어적 감소 반응을 반영합니다. |
| tg_positive_update_slope | float | 긍정적 피드백의 크기에 따라 투자 증가가 얼마나 가파르게 나타나는지를 요약한 기울기입니다. |
| tg_negative_update_slope | float | 부정적 피드백의 크기에 따라 투자 감소가 얼마나 가파르게 나타나는지를 요약한 기울기입니다. |
| tg_learning_index_high_partner | float | high partner에 대해 trial이 지날수록 신뢰를 얼마나 잘 형성했는지 나타내는 학습 지표입니다. 예를 들어 후반 평균 투자액 − 초반 평균 투자액으로 계산할 수 있습니다. |
| tg_learning_index_low_partner | float | low partner에 대해 trial이 지날수록 투자를 얼마나 적절히 줄였는지 나타내는 학습 지표입니다. |
| tg_discrimination_index | float | `mean_sent_high_partner - mean_sent_low_partner`로 계산되는 지표입니다. 좋은 상대와 나쁜 상대를 행동적으로 얼마나 잘 구분했는지를 보여줍니다. 값이 클수록 구분이 잘 된 것입니다. |

## 12-3. Instability summary (derived)

| Variable name | Type | Description |
|---|---|---|
| tg_sd_sent_all_trials | float | 전체 trial에서 투자액의 표준편차입니다. 값이 클수록 trial 간 trust behavior가 더 많이 흔들렸다는 뜻입니다. |
| tg_mean_absolute_trial_to_trial_change | float | 인접한 trial 사이에서 투자액이 평균적으로 얼마나 크게 바뀌는지를 나타냅니다. 방향과 무관한 instability 지표입니다. |
| tg_instability_index_volatile_partner | float | volatile partner 조건에서의 투자 변동성을 따로 요약한 값입니다. 불확실한 상대에 대한 행동적 흔들림을 평가하는 데 핵심입니다. |

## 12-4. Betrayal / recovery summary (derived)

| Variable name | Type | Description |
|---|---|---|
| tg_betrayal_drop_magnitude | float | 배신 사건 직후 투자액이 얼마나 크게 떨어졌는지를 요약한 값입니다. 배신 민감성의 대표 지표입니다. |
| tg_betrayal_recovery_rate | float | 배신 이후 투자수준이 다시 회복되는 속도를 나타냅니다. 회복력이 높을수록 빠르게 baseline에 가까워집니다. |
| tg_number_of_trials_to_recover | int | 배신 전 수준으로 돌아오기까지 걸린 trial 수입니다. 값이 클수록 배신의 영향이 오래 지속된 것입니다. |
| tg_persistent_distrust_after_betrayal | float / binary | 배신 이후에도 장기간 낮은 투자 상태가 지속되는지를 나타냅니다. 연속형으로도, 일정 기준 이상이면 1로 이진화할 수도 있습니다. |

## 12-5. Over-trust / self-protection failure summary (derived)

| Variable name | Type | Description |
|---|---|---|
| tg_overtrust_index_low_partner | float | low reciprocity partner에게도 상대적으로 높은 투자를 계속 유지하는 정도를 나타냅니다. 명백히 신뢰할 가치가 낮은 상대에게도 과도하게 trust를 유지하면 값이 커집니다. |
| tg_protection_failure_index | float | 반복적인 낮은 반환에도 불구하고 투자 감소가 충분히 일어나지 않는 정도를 나타냅니다. self-protective adjustment의 실패를 반영하는 지표입니다. |

