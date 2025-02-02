
export interface IBankInteraction {
  type: 'bank' | 'atm';
  bankAccountId: string;
  amount: number;
  targetAccountNumber: string | null;
}
