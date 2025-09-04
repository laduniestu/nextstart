import { adminClient, emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { AFTER_LOGIN_URL } from '@/config';

export const authClient = createAuthClient({
  plugins: [adminClient(), emailOTPClient()],
});

export const signInWithGithub = async () => {
  await authClient.signIn.social({
    provider: 'github',
    callbackURL: AFTER_LOGIN_URL,
  });
};

export const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: 'google',
    callbackURL: AFTER_LOGIN_URL,
  });
};
