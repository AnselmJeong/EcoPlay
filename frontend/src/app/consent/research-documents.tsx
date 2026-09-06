"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const researchTitle = '사회적 불안 및 대인관계 어려움을 호소하는 정신건강의학과 환자에서 기본 신뢰(Basic Trust)의 발달적 기원과 반복 신뢰 게임(Repeated Trust Game)을 이용한 행동적 신뢰 탐색';

const introduction = '본 연구는 대인관계 어려움 또는 사회적 불안을 겪는 정신건강의학과 환자들에서, 어린 시절 부모의 양육 방식과 성인이 된 후의 애착 방식이 타인에 대한 기본적인 신뢰(basic trust) 형성에 어떤 영향을 미치는지, 그리고 이러한 신뢰가 실제 대인관계 행동으로 어떻게 나타나는지를 알아보는 연구입니다. 이 연구는 자발적으로 참여 의사를 밝히신 분에 한하여 수행됩니다. 다음 내용을 신중히 읽어보신 후 참여 의사를 밝혀 주시길 바라며 질문이 있다면 담당 연구원이 자세하게 설명해 드릴 것입니다.';

const informationSections = [
  {
    title: '1. 연구의 배경과 목적',
    paragraphs: ['대인관계 어려움 또는 사회적 불안을 겪는 사람들은 타인에 대한 신뢰를 형성하고 유지하는 데 어려움을 겪는 경우가 많습니다. 본 연구는 이러한 신뢰의 어려움이 어린 시절의 양육 경험 및 성인기 애착 방식과 어떤 관련이 있는지, 그리고 컴퓨터 과제(반복 신뢰 게임)에서 신뢰 행동이 어떻게 나타나는지를 살펴봄으로써, 향후 관련 임상적 개입을 개발하는 데 필요한 기초 자료를 얻고자 합니다.'],
  },
  {
    title: '2. 연구 참여 대상',
    paragraphs: ['본 연구에는 을지대학교병원 정신건강의학과에 외래로 내원 중이거나 안정기로 입원 중인 만 16세 이상 29세 이하의 환자로서, 사회적 불안 또는 대인관계의 어려움을 주호소로 하는 분들이 참여할 예정입니다.'],
  },
  {
    title: '3. 연구 방법',
    paragraphs: ['귀하가 참여 의사를 밝혀 주시면 다음과 같은 과정이 진행됩니다.'],
    steps: [
      '먼저 자기보고 설문지(부모 양육 방식, 성인 애착, 사회적 불안, 우울, 범불안 등을 묻는 문항)를 작성하시게 됩니다. 설문은 종이 또는 태블릿으로 진행됩니다.',
      '이어서 연구팀이 개발한 컴퓨터 기반 반복 신뢰 게임 과제를 독립된 공간에서 수행하시게 됩니다.',
      '본 과제는 연구팀이 개발한 웹 기반 프로그램을 이용하여 진행됩니다. 귀하는 프로그램에서 투자자 역할을 맡아 가상의 상대방과 반복적으로 상호작용하게 됩니다. 과제는 총 3개의 블록으로 구성되며, 각 블록당 15회씩 총 45회의 선택을 하게 됩니다. 매 시행에서 귀하에게 일정한 가상의 금액이 주어지며, 이 중 얼마를 상대방에게 투자할지 결정하게 됩니다. 귀하가 투자한 금액은 프로그램에서 3배로 증가하여 상대방에게 전달되며, 이후 상대방은 전달받은 금액 중 일부를 귀하에게 돌려주거나 돌려주지 않을 수 있습니다. 이러한 과정이 반복되면서 귀하는 상대방의 행동을 경험하게 됩니다. 본 과제에서 사용되는 금액과 상대방은 모두 프로그램 내에서 제시되는 가상의 금액 및 가상의 상대방이며, 실제 금전적 손익은 발생하지 않습니다.',
      '전체 소요 시간은 약 60분 내외이며, 병원 내 지정된 면담실 또는 병동 내 면담실에서 진행됩니다.',
      '연구자는 과제 수행 동안 인접 공간에서 대기하여 귀하의 요청에 즉시 대응할 수 있습니다.',
    ],
  },
  {
    title: '4. 연구 참여 기간',
    paragraphs: ['귀하는 본 연구를 위해 1회(희망할 시 2회로 나누어 진행 가능) 방문하시게 되며, 1회 방문 시 소요되는 시간은 약 60분 내외입니다.'],
  },
  {
    title: '5. 연구 참여 도중 중도탈락',
    paragraphs: ['귀하는 연구에 참여하신 후에도 언제든지 도중에 그만두실 수 있습니다. 만일 귀하가 연구에 참여하는 것을 그만두고 싶다면 담당 연구원이나 연구책임자에게 즉시 말씀해 주십시오. 참여를 중단하시더라도 귀하가 받고 계신 진료 및 향후 치료 계획에 어떠한 불이익도 없습니다.'],
  },
  {
    title: '6. 부작용 또는 위험요소',
    paragraphs: ['설문 응답 및 신뢰 게임 과정에서 일부 문항이나 상황이 개인적이거나 다소 불편한 감정(과거 양육 경험 회상, 대인관계 어려움에 대한 질문, 게임 중 상대방에게 배신당하는 경험 등)을 유발할 수 있습니다. 이러한 불편감이 발생할 경우 언제든지 담당 연구원에게 즉시 문의해 주시거나 참여를 중단·휴식하실 수 있습니다.'],
  },
  {
    title: '7. 연구 참여에 따른 이익',
    paragraphs: ['귀하가 이 연구에 참여하는 데 있어서 직접적인 이득이나 금전적 보상은 없습니다. 그러나 귀하가 제공하는 정보는 대인관계 어려움 및 사회적 불안을 겪는 환자들의 심리적 어려움을 이해하고 향후 임상적 개입 방법을 개발하는 데 도움이 될 것입니다. 본 연구 참여로 귀하에게 추가로 발생하는 검사비, 진료비 등의 비용은 없습니다.'],
  },
  {
    title: '8. 연구에 참여하지 않을 시 불이익',
    paragraphs: ['귀하는 본 연구에 참여하지 않을 자유가 있습니다. 또한 귀하가 본 연구에 참여하지 않아도, 또는 참여 중 언제든지 그만두시더라도 귀하에게는 어떠한 불이익도 없습니다.'],
  },
  {
    title: '9. 개인정보와 비밀보장',
    paragraphs: [
      '본 연구의 참여로 귀하에게서 수집되는 개인정보는 주진단 및 공존진단, 현재 복용 약물 종류, 외래/입원 구분, 만 나이, 성별, 가족 구조, 그리고 설문 및 컴퓨터 과제 응답 자료입니다. 이 정보는 연구를 위해 연구 종료일로부터 3년간 사용·보관되며, 수집된 정보는 개인정보보호법에 따라 적절히 관리됩니다. 관련 정보는 개인 식별 정보를 제거하고 고유 ID 코드를 부여하여 암호화된 컴퓨터 파일 또는 서버에 보관되며, 연구팀 외에는 접근할 수 없습니다.',
      '연구를 통해 얻은 모든 개인 정보의 비밀 보장을 위해 최선을 다할 것입니다. 이 연구에서 얻어진 개인 정보가 학회지나 학회에 공개될 때 귀하의 이름과 다른 개인 정보는 사용되지 않을 것입니다. 그러나 만일 법이 요구하면 귀하의 개인정보는 제공될 수도 있습니다.',
      '또한 모니터 요원, 점검 요원, 을지대학교병원 기관생명윤리위원회(IRB)는 연구대상자의 비밀보장을 침해하지 않고 관련 규정이 정하는 범위 안에서 본 연구의 실시 절차와 자료의 신뢰성을 검증하기 위해 연구 결과를 직접 열람할 수 있습니다. 연구 종료 후 연구 관련 자료는 3년간 보관되며 이후 파쇄 및 보안 삭제의 방법으로 폐기됩니다.',
    ],
  },
];

const consentStatements = [
  '나는 본 연구의 설명문을 읽었으며 담당 연구원과 이에 대하여 의논하였습니다.',
  '나는 위험과 이득에 관하여 들었으며 나의 질문에 만족할 만한 답변을 얻었습니다.',
  '나는 이 연구에 참여하는 것에 대하여 자발적으로 동의합니다.',
  '나는 이 연구에서 얻어진 나에 대한 정보를 현행 법률과 을지대학교병원 기관생명윤리위원회 규정이 허용하는 범위 내에서 연구자가 수집하고 처리하는 데 동의합니다.',
  '나는 언제라도 이 연구의 참여를 철회할 수 있고 이러한 결정이 나에게 어떠한 해도 되지 않을 것이라는 것을 압니다.',
  '나의 서명은 이 동의서의 사본을 받았다는 것을 뜻하며 연구 참여가 끝날 때까지 사본을 보관하겠습니다.',
];

export function ResearchDocuments() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-10 break-keep [overflow-wrap:anywhere] text-base leading-8 text-gray-700">
      <section aria-labelledby="information-heading">
        <h2 id="information-heading" className="mb-4 text-xl font-bold text-blue-900">
          연구대상자 설명서
        </h2>
        <div className="overflow-hidden rounded-lg border border-blue-200">
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls="research-information"
            aria-label={isExpanded ? '연구대상자 설명서 접기' : '연구대상자 설명서 전문 펼치기'}
            onClick={() => setIsExpanded(expanded => !expanded)}
            className="block w-full cursor-pointer bg-blue-50/60 p-4 text-left hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 sm:p-5"
          >
            {!isExpanded && (
              <span className="mb-3 line-clamp-3">{introduction}</span>
            )}
            <span className="flex items-center justify-between gap-4 text-sm font-semibold text-blue-800">
              <span>{isExpanded ? '설명문 접기' : '설명문 전문 펼치기'}</span>
              <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
            </span>
          </button>
          <div
            id="research-information"
            role="region"
            aria-labelledby="information-heading"
            aria-describedby="information-scroll-hint"
            hidden={!isExpanded}
          >
            <p id="information-scroll-hint" className="border-y border-blue-100 px-4 py-2 text-sm leading-6 text-gray-600 sm:px-5">
              아래 영역을 위아래로 스크롤하여 설명문 전체를 읽어주세요.
            </p>
            <div
              tabIndex={0}
              role="region"
              aria-label="연구대상자 설명서 전문"
              className="max-h-[min(60dvh,36rem)] space-y-8 overflow-y-scroll overscroll-y-contain bg-white p-4 [scrollbar-gutter:stable] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 sm:p-6"
            >
              <div className="space-y-4">
                <p className="font-semibold text-gray-900">
                  <span className="mb-1 block text-sm text-gray-500">연구과제명</span>
                  {researchTitle}
                </p>
                <p>{introduction}</p>
                <p>귀하의 서명은 귀하가 본 연구에 대해 그리고 위험성에 대해 설명을 들었음을 의미하며, 이 문서에 대한 귀하의 서명은 귀하께서 본 연구에 참가를 원한다는 것을 의미합니다.</p>
              </div>
              {informationSections.map(section => (
                <section key={section.title} className="space-y-3">
                  <h3 className="font-bold text-gray-900">{section.title}</h3>
                  {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                  {section.steps && (
                    <ul className="list-disc space-y-3 pl-5 marker:text-gray-400">
                      {section.steps.map(step => <li key={step} className="pl-1">{step}</li>)}
                    </ul>
                  )}
                </section>
              ))}
              <section className="space-y-4">
                <h3 className="font-bold text-gray-900">10. 연구 문의</h3>
                <p>본 연구에 대해 질문이 있거나 연구 중간에 문제가 생길 시 다음 연구 담당자에게 언제든지 연락하십시오.</p>
                <dl className="space-y-4">
                  <div>
                    <dt className="font-semibold text-gray-900">박유진 <span className="font-normal">(연구담당자, 정신건강의학과 전공의)</span></dt>
                    <dd>전화번호: <a href="tel:0426113443" className="text-blue-800 underline underline-offset-4">042-611-3443</a> (외래)</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">정성훈 <span className="font-normal">(연구책임자, 정신건강의학과 교수)</span></dt>
                    <dd>전화번호: <a href="tel:0426113443" className="text-blue-800 underline underline-offset-4">042-611-3443</a> (외래)</dd>
                  </div>
                </dl>
                <p>만일 어느 때라도 연구대상자로서 귀하의 권리에 대한 질문이 있다면 다음의 을지대학교병원 기관생명윤리위원회(IRB)에 연락하십시오.</p>
                <p>
                  <span className="block font-semibold text-gray-900">을지대학교병원 기관생명윤리위원회(IRB)</span>
                  전화번호: <a href="tel:0426113199" className="text-blue-800 underline underline-offset-4">042-611-3199</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="consent-heading" className="space-y-5 border-t border-gray-200 pt-8">
        <h2 id="consent-heading" className="text-xl font-bold text-blue-900">동의서</h2>
        <p className="font-semibold text-gray-900">
          <span className="mb-1 block text-sm text-gray-500">연구제목</span>
          {researchTitle}
        </p>
        <ol className="list-decimal space-y-4 pl-6 marker:font-semibold marker:text-blue-800">
          {consentStatements.map(statement => <li key={statement} className="pl-2">{statement}</li>)}
        </ol>
      </section>
    </div>
  );
}
