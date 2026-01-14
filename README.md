# **{Team04-AI_trio}**

[협업 문서 링크 - github](https://github.com/minyeok123/nb06-Moonshot-team04-AI_trio) <br>
[협업 문서 링크 - notion](https://www.notion.so/Team-Project-2ce61538a9e2806ba419d21e4473dc06?source=copy_link)

## **팀원 구성**

- 오윤 ([개인 Github 링크](https://github.com/xoxo-oy))
- 김민혁 ([개인 Github 링크](https://github.com/minyeok123))
- 김지선 ([개인 Github 링크](https://github.com/KimDay366))

---

## **프로젝트 소개**

- Moonshot - 프로젝트 일정 관리 서비스 백엔드 구축
- 프로젝트 기간: 2025.12.22 - 2026.01.15

---

## **기술 스택**

- Backend: Express.js, PrismaORM, Typescript
- Database: PostgreSQL
- 공통 Tool: Git & Github, Discord, Notion

---

## **팀원별 구현 기능 상세**

### 공통

- Auth API
  - POST : 회원가입
  - POST : 로그인 및 토큰 생성
  - POST : 토큰 갱신(리프레시 토큰)
  - GET : Google Oauth 연동 & 콜백

### 김지선

- User API

  - GET : 내 정보 조회
  - PATCH : 내 정보 수정
  - GET : 참여 중인 프로젝트 조회
  - GET : 참여 중인 모든 프로젝트의 할 일 목록 조회

- Task API

  - POST : 프로젝트에 할 일 생성
  - GET : 프로젝트의 할 일 목록 조회
  - GET : 할 일 조회
  - PATCH : 할 일 수정
  - DELETE : 할 일 삭제

- Files API
  - POST : 파일 업로드

### 김민혁

- Project API

  - POST : 프로젝트 생성
  - GET : 프로젝트 조회
  - PATCH : 프로젝트 수정
  - DELETE : 프로젝트 삭제

- Comment API
  - POST : 할 일에 댓글 추가
  - GET : 할 일에 달린 댓글 조회
  - GET : 댓글 조회
  - PATCH : 댓글 수정
  - DELETE : 댓글 삭제

### 오윤

- Member API

  - GET : 프로젝트 멤버 조회
  - DELETE : 프로젝트에서 유저 제외하기
  - POST : 프로젝트에 멤버 초대
  - POST : 멤버 초대 수락
  - DELETE : 멤버 초대 삭제

- SubTask API
  - POST : 하위 할 일 생성
  - GET : 하위 할 일 목록 조회
  - GET : 하위 할 일 조회
  - PATCH : 하위 할 일 수정
  - DELETE : 하위 할 일 삭제

---

## **파일 구조**

```
.
├── README.md
├── package-lock.json
├── package.json
├── tsconfig.json
├── prisma
│   └── schema.prisma
├── src
│   ├── server.ts
│   ├── libs
│   │   └── common.ts
│   ├── middlewares
│   │   └── common.ts
│   ├── modules
│   │   └── model.sample
│   │       ├── dto
│   │       │   └── sample.ts
│   │       ├── sample.controller.ts
│   │       ├── sample.repo.ts
│   │       ├── sample.router.ts
│   │       ├── sample.service.ts
│   │       ├── sample.validator.ts
│   │       └── utils
│   │           └── sample.ts
│   └── types
│       └── express
│           └── common.ts
└── uploads
    └── common.jpg

```

---

## **구현 홈페이지**

[배포 링크](https://nb06-moonshot-team04-ai-trio.onrender.com/)

---

## **프로젝트 회고록**

- [개발 레포트 - 오윤](https://www.notion.so/2e761538a9e28064b291c49c4d711701?source=copy_link)
- [개발 레포트 - 김민혁](https://www.notion.so/2e761538a9e280cbae73ea3c4870d87f?source=copy_link)
- [개발 레포트 - 김지선](https://www.notion.so/2e761538a9e2803fbb89d936af4bd069?source=copy_link)

---

## **커밋 컨벤션 이모지**

```
✨ feat: → 새로운 기능 추가
🐛 fix: → 버그 수정
📝 docs: → 문서 변경
💄 style: → 코드 스타일/포맷 변경 (기능 변화 없음)
♻️ refactor: → 코드 리팩토링 (기능 변화 없음)
⚡ perf: → 성능 개선
✅ test: → 테스트 추가/수정
📦 chore: → 빌드/환경/패키지 변경
```
