# EcoPlay Backend (FastAPI)

이 디렉토리는 EcoPlay의 백엔드 API 서버를 위한 FastAPI 프로젝트입니다.

## 주요 역할
- 게임 데이터(Firebase 저장, Trust Game 매칭, LLM 메시지 등) 처리 및 저장
- 프론트엔드(Next.js)와의 RESTful/비동기 API 통신
- 사용자, 게임 세션, 결과, 메시지 등 관리

## 구조
- `main.py`: FastAPI 앱 진입점
- `routers/`: 각 기능별 라우터(게임, 유저, 매칭, 메시지 등)
- `schemas/`: Pydantic 데이터 모델
- `db/`: 데이터베이스 연결 및 쿼리 유틸리티
- `services/`: 비즈니스 로직(매칭, LLM 등)
- `core/`: 설정, 미들웨어, 예외처리 등

## 실행 방법
```bash
uvicorn main:app --reload
``` 