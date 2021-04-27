interface userWallet {
  user_id: string;
  balance: number;
  lastRedeem?: number;
}

export function createUserWallet(user_id:string, initialBalance:number): Promise<userWallet>;
export function getUserWallet(user_id:string): Promise<userWallet>;
export function setUserWallet(user_id:string, key:string, value:any): Promise<userWallet>;
