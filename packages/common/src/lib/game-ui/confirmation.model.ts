

export interface IConfirmation {
  message?: string;
  icon?: string;
  header?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptIcon?: string;
  rejectIcon?: string;
  closeOnEscape?: boolean;
  dismissableMask?: boolean;
  acceptButtonStyleClass?: string;
  rejectButtonStyleClass?: string;
  acceptButtonProps?: any;
  rejectButtonProps?: any;
  closeButtonProps?: any;
  closable?: boolean;
  position?: string;
}
