import { TooltipOptions } from 'primeng/api';
import { IPhoneMessage, IPhonePhoto, ITransaction, TransactionStatus, TransactionType } from '@revolt-rp/common';
import { ImgurUploadResponse } from '../model/imgur/imgur.model';


export const getPhoneDockTooltip = (label: string): TooltipOptions => {
  return {
    tooltipLabel: label,
    tooltipPosition: 'top',
    positionTop: 0,
    positionLeft: 20,
    showDelay: 1000
  };
};


export const getConversations = (phoneNumber: string, messages: IPhoneMessage[]) => {
  return [...new Set(
    messages.flatMap(msg => [msg.sender, msg.receiver])
  )].filter(number => number !== phoneNumber);
};


export const getBankMonthlyStats = (transactions: ITransaction[]): [number, number] => {
  return transactions.reduce(
    ([income, outcome], transaction) => {
      if (transaction.status === TransactionStatus.Completed) {
        if (transaction.type === TransactionType.Deposit || transaction.type === TransactionType.Payment) {
          return [income + transaction.amount, outcome];
        } else if (transaction.type === TransactionType.Withdraw || transaction.type === TransactionType.Transfer) {
          return [income, outcome + transaction.amount];
        }
      }
      return [income, outcome];
    },
    [0, 0]
  );
};


export const mapToPhonePhoto = (photo: ImgurUploadResponse): Partial<IPhonePhoto> => {
  return {
    id: photo.id,
    url: photo.link,
    deleteHash: photo.deletehash
  };
};
