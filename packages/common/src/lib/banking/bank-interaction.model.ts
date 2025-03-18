
export interface IBankInteraction {
  type: 'bank' | 'atm' | 'online';
  bankAccountId: string;
  amount: number;
  targetAccountNumber: string | null;
}
