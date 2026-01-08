import axios from 'axios';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  RESPONSE_TYPE,
} from '../../../libs/constants';

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export const googleOAuthAdapter = {
  getLoginUrl: (state: string): string => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      redirect_uri: GOOGLE_REDIRECT_URI!,
      response_type: RESPONSE_TYPE!,
      scope: 'openid email profile https://www.googleapis.com/auth/calendar',
      state: state,
      access_type: 'offline',
      prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  exchangeCodeForToken: async (code: string): Promise<GoogleTokenResponse> => {
    const url = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      redirect_uri: GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    });
    const response = await axios.post<GoogleTokenResponse>(url, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
};
