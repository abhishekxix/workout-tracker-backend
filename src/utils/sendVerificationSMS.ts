
import twilio from 'twilio';
import {createJWT} from './createJWT';
import {createTokenUser} from './createTokenUser';

export const sendVerificationSMS = async (user: any) => {
  const accountSID = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSID, authToken);

  const tokenUser = {...createTokenUser(user), phoneNumber: user.phoneNumber};

  const verificationToken = createJWT(
      tokenUser,
    process.env.JWT_VERIFICATION_LIFETIME as string,
  );

  /* eslint-disable max-len */
  await client.messages.create({
    body: `Click the following link to verify your phone number:
    ${process.env.SERVER_URL}:${process.env.PORT}/api/v1/auth/verifyPhone/${verificationToken}`,
    from: process.env.TWILIO_SMS_PHONE_NUMBER,
    to: user.phoneNumber,
  });
};
