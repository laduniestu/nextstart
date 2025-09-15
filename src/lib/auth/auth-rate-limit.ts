export const rateLimitConfig = {
  enabled: true,
  window: 60,
  max: 20,
  customRules: {
    '/sign-in/email': {
      window: 60,
      max: 5,
    },
    '/email-otp/verify-email': () => {
      return {
        window: 60 * 5,
        max: 5,
      };
    },
    '/email-otp/send-verification-otp': () => {
      return {
        window: 60 * 60,
        max: 3,
      };
    },
  },
};
