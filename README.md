# **{Team04-AI_trio}**

[협업 문서 링크](https://github.com/minyeok123/nb06-Moonshot-team04-AI_trio)

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

### 김지선

- Auth API
  - 로그인 및 토큰 생성
- User API
  - GET : 자신의 정보 확인
- Task API
  - (추후 작업 내용 작성)

### 김민혁

- Auth API
  - 회원가입
- Project API
  - (추후 작업 내용 작성)
- Comment API
  - (추후 작업 내용 작성)

### 오윤

- Member API
  - (추후 작업 내용 작성)
- SubTask API
  - (추후 작업 내용 작성)

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
│   ├── app.ts
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
    └── common.ts

```

---

## **구현 홈페이지**

(개발한 홈페이지에 대한 링크 게시)

https://www.example.kr/

---

## **프로젝트 회고록**

(제작한 발표자료 링크 혹은 첨부파일 첨부)

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
