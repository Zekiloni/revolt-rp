
export interface IBankInteraction {
  bankAccountId: string;
  amount: number;
  targetAccountNumber: string | null;
}
