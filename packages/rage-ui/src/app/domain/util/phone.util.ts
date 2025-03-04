import { TooltipOptions } from 'primeng/api';

export const getPhoneDockTooltip = (label: string): TooltipOptions => {
  return {
    tooltipLabel: label,
    tooltipPosition: 'top',
    positionTop: 0,
    positionLeft: 20,
    showDelay: 1000
  };
};
