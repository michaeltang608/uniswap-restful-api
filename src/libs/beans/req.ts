import { providers } from 'ethers';
import { Token } from '@uniswap/sdk-core';

export interface TradeReq {
  provider: providers.Provider;
  wallet: {
    address: string;
    privateKey: string;
  };
  tokens: {
    in: Token;
    amountIn: number;
    out: Token;
    poolFee: number;
  };
}
