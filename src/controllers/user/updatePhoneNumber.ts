import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {BadRequestError} from '../../errors';
import {User} from '../../models';
import {formatPhoneNumber, getResLocal, sendVerificationSMS} from '../../utils';

export const updatePhoneNumber = async (req: Request, res: Response) => {
  const {phoneNumber, region} = req.body;
  const {_id} = getResLocal(res, 'user');

  if (!(phoneNumber && region)) {
    throw new BadRequestError('Please provide phone number and region');
  }

  const userPhone = formatPhoneNumber(phoneNumber, region);

  const user = await User.findById(_id);
  user.phoneNumber = userPhone;
  user.region = region;
  user.isPhoneVerified = false;
  await user.save();

  await sendVerificationSMS(user);

  res
      .status(StatusCodes.ACCEPTED)
      .json({msg: 'Please verify your phone number.'});
};
