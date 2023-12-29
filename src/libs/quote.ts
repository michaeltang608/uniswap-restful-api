import Quorter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';
import { ethers } from 'ethers';
import { log } from 'console';
import * as ContractAddress from './consts/contractAddress';
import { fromReadableAmount, toReadableAmount } from './util';
import tokens from './consts/tokens';
import provider from './provider';

const quote = async (
  symbolIn: string,
  symbolOut: string,
  amountIn: number,
): Promise<string> => {
  log('quote begin');
  if (!tokens.has(symbolIn)) {
    return `can not find token info for ${symbolIn}`;
  }
  if (!tokens.has(symbolOut)) {
    return `can not find token info for ${symbolOut}`;
  }
  const tokenIn = tokens.get(symbolIn);
  const tokenOut = tokens.get(symbolOut);
  const quoterContract = new ethers.Contract(
    ContractAddress.QUOTER,
    Quorter.abi,
    provider,
  );
  const poolConstants = await getPoolConstants(tokenIn, tokenOut);
  const amountInStr = fromReadableAmount(amountIn, tokenIn.decimals).toString();

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    tokenIn.address,
    tokenOut.address,
    poolConstants.fee,
    amountInStr,
    0,
  );

  return toReadableAmount(quotedAmountOut, tokenOut.decimals);
};

async function getPoolConstants(
  tokenIn: Token,
  tokenOut: Token,
): Promise<{
  token0: string;
  token1: string;
  fee: number;
}> {
  const poolAddress = computePoolAddress({
    factoryAddress: ContractAddress.POOL_FACTORY,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: FeeAmount.MEDIUM,
  });

  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI.abi,
    provider,
  );

  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);

  return {
    token0,
    token1,
    fee,
  };
}

export default quote;
