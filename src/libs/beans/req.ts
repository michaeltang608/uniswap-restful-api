import { Token } from '@uniswap/sdk-core';
import { ethers } from 'ethers';

export interface TradeReq {
  wallet: ethers.Wallet;
  tokenIn: Token;
  tokenOut: Token;
  amountIn: number;
  poolFee: number;
}
