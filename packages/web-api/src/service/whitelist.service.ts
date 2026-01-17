import dayjs from 'dayjs';
import { IWhiteListCreate, IWhitelistTest, WhitelistStatus } from '@revolt-rp/common';
import { AccountModel, whitelistConfig, WhiteListModel } from '@revolt-rp/core';


export const getWhitelistByAccountId = async (accountId: string) => {
  return WhiteListModel.find({ account: accountId })
    .sort({ createdAt: -1 })
    .populate([
      {
        path: 'reviewedBy',
        select: '-password'
      }
    ])
    .exec();
};


const calculateGrade = (whitelistCreate: IWhiteListCreate) => {
  let correctAnswers = 0;

  const questionMap = new Map<string, string>();
  whitelistConfig.questions.forEach(q => {
    const correctAnswer = q.answers.find(a => a.isCorrect);
    if (correctAnswer) {
      questionMap.set(q.question, correctAnswer.content);
    }
  });

  whitelistCreate.answers.forEach(answer => {
    const correctAnswer = questionMap.get(answer.question);
    if (correctAnswer && correctAnswer === answer.answer) {
      correctAnswers += 1;
    }
  });

  return (correctAnswers / whitelistConfig.maxQuestions) * 100;
};

export const createWhitelist = async (accountId: string, create: IWhiteListCreate) => {
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

  const whitelist = await WhiteListModel.create({
    account: accountId,
    answers: create.answers,
    essayAnswers: create.essayAnswers,
    grade: calculateGrade(create)
  });

  await AccountModel.findByIdAndUpdate(accountId, {
    $push: { whitelist: whitelist.id }
  });

  return whitelist;
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

export const getAllWhitelists = async (status: WhitelistStatus | undefined, limit = 50, offset = 0) => {
  return Promise.all([
    WhiteListModel.find({ ...(status ? { status } : {}) })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate([{
          path: 'account',
          select: '-password'
        },
        {
          path: 'reviewedBy',
          select: '-password'
        }
      ])
      .exec(),
    WhiteListModel.countDocuments({ status }).exec()
  ]);
};


function getRandomQuestions<T>(arr: T[], count: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

export const generateWhitelistTest = () => {
  const questions = getRandomQuestions(whitelistConfig.questions, whitelistConfig.maxQuestions)
    .map(q => ({
      question: q.question,
      answers: q.answers.map(a => ({ content: a.content }))
    }));

  const whitelistTest: IWhitelistTest = {
    maxQuestions: whitelistConfig.maxQuestions,
    maxEssayQuestions: whitelistConfig.maxEssayQuestions,
    questions,
    essayQuestions: getRandomQuestions(whitelistConfig.essayQuestions, whitelistConfig.maxEssayQuestions)
  };

  return whitelistTest;
};
