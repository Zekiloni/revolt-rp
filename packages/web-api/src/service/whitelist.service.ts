import dayjs from 'dayjs';
import { IWhiteListCreate, WhitelistStatus } from '@revolt-rp/common';
import { WhiteListModel } from '@revolt-rp/core';


export const getWhitelistByAccountId = async (accountId: string) => {
  const isAlreadyExists = await WhiteListModel.exists({ account: accountId, status: WhitelistStatus.PENDING });

  if (isAlreadyExists) {
    throw new Error('whitelist_already_pending');
  }

  const isApprovedExists = await WhiteListModel.exists({ account: accountId, status: WhitelistStatus.APPROVED });

  if (isApprovedExists) {
    throw new Error('whitelist_already_approved');
  }

  const threeDaysAgo = dayjs().subtract(3, 'day').toDate();

  const isRejectedExists = await WhiteListModel.exists({
    account: accountId,
    status: WhitelistStatus.REJECTED,
    createdAt: { $gt: threeDaysAgo }
  });

  if (isRejectedExists) {
    throw new Error('whitelist_rejected_recently');
  }

  return WhiteListModel.find({ account: accountId })
    .sort({ createdAt: -1 })
    .populate('reviewedBy', 'username')
    .exec();
};


export const createWhitelist = async (accountId: string, create: IWhiteListCreate) => {
  return WhiteListModel.create({
    account: accountId,
    answers: create.answers,
    grade: create.grade
  });
};

export const approveWhitelist = async (whitelistId: string, adminId: string) => {
  return WhiteListModel.findByIdAndUpdate(whitelistId, {
    status: WhitelistStatus.APPROVED,
    reviewedBy: adminId
  }, { new: true }).exec();
};

export const rejectWhitelist = async (whitelistId: string, adminId: string, note: string) => {
  return WhiteListModel.findByIdAndUpdate(whitelistId, {
    status: WhitelistStatus.REJECTED,
    reviewedBy: adminId,
    note
  }, { new: true }).exec();
};

export const getAllWhitelists = async (status: WhitelistStatus, limit = 50, offset = 0) => {
  return Promise.all([
    WhiteListModel.find({ status })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('account', 'username')
      .populate('reviewedBy', 'username')
      .exec(),
    WhiteListModel.countDocuments({ status }).exec()
  ]);
};
