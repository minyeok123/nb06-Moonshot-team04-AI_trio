import './express-session';

declare module 'express-session' {
  interface SessionData {
    oauthState?: string; // 세션에 저장할 state
  }
}
