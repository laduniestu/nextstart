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
    '/email-otp/verify-email': (request: any) => {
      console.log(request);
      return {
        window: 60 * 60,
        max: 10,
      };
    },
  },
  onLimit: (ctx: any) => {
    console.log('Rate limit triggered:', ctx);
  },
};
