import { TooltipOptions } from 'primeng/api';
import { IPhoneMessage } from '@revolt-rp/common';

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
  const latestMessageMap = new Map<string, IPhoneMessage>();

  for (const msg of messages) {
    const contact = msg.sender === phoneNumber ? msg.receiver : msg.sender;

    if (!latestMessageMap.has(contact) || latestMessageMap.get(contact)!.createdAt < msg.createdAt) {
      latestMessageMap.set(contact, msg);
    }
  }

  return [...latestMessageMap.entries()]
    .sort((a, b) => b[1].createdAt.getTime() - a[1].createdAt.getTime())
    .map(([contact]) => contact);
};
