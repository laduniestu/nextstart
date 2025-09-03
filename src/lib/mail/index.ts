import Plunk from '@plunk/node';

import { env } from '@/env/server';

let plunk: Plunk | null = null;

function getPlunk() {
  if (!plunk) {
    plunk = new Plunk(env.PLUNK_API_KEY);
  }
  return plunk;
}
export const sendEmail = async (payload: {
  to: string;
  subject: string;
  body: string;
}) => {
  const plunk = getPlunk();
  try {
    const response = await plunk.emails.send({
      to: payload.to,
      subject: payload.subject,
      body: payload.body,
    });

    console.log('Email sent successfully:', response);

    if (response?.success) return true;
    return false;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
