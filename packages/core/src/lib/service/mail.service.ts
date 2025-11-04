
export const sendMail = async (to: string, subject: string, body: string): Promise<void> => {
  console.log(`Sending mail to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);

  return Promise.resolve();
}
