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
): Promise<{ suc: boolean; amountOut?: string; msg?: string }> => {
  log('quote begin');
  let msg = '';
  if (!tokens.has(symbolIn)) {
    msg = `can not find token info for ${symbolIn}}`;
    return { suc: false, msg: msg };
  }
  if (!tokens.has(symbolOut)) {
    msg = `can not find token info for ${symbolOut}}`;
    return { suc: false, msg: msg };
  }
  const tokenIn = tokens.get(symbolIn);
  const tokenOut = tokens.get(symbolOut);
  const quoterContract = new ethers.Contract(
    ContractAddress.UNISWAP_V3_QUOTER,
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

  const amountOut = toReadableAmount(quotedAmountOut, tokenOut.decimals);
  return { suc: true, amountOut };
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
    factoryAddress: ContractAddress.POOL_FACTORY_V3,
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
