import { TooltipOptions } from 'primeng/api';
import { IPhoneConversation, IPhoneMessage } from '@revolt-rp/common';

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
