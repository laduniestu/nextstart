/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
export const rateLimitConfig = {
  enabled: true,
  window: 60,
  max: 20,
  customRules: {
    '/sign-in/email': {
      window: 60,
      max: 10,
    },
    '/email-otp/verify-email': () => {
      return {
        window: 60,
        max: 3,
      };
    },
    '/email-otp/send-verification-otp': () => {
      return {
        window: 60 * 5,
        max: 2,
      };
    },
  },
};
