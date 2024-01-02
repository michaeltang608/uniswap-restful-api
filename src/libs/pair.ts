import { Contract } from 'ethers';
import * as Address from './consts/contractAddress';
import * as ABI from './consts/abi';
import provider from './provider';

// 查询pair是否存在
// 查询pair 的 reserve 及 kLast
// 添加流动性，并查询最新的 reserver和 kLast

export async function getPairAddress(
  tokenA: string,
  tokenB: string,
): Promise<string> {
  const factory: Contract = new Contract(
    Address.POOL_FACTORY_V3,
    ABI.UNISWAP_V2_FACTORY_ABI,
    provider,
  );

  const pairAddress: string = await factory.getPair(tokenA, tokenB);
  return pairAddress;
}

// query reserver&kLast
export async function getReserve(
  tokenA: string,
  tokenB: string,
): Promise<{ r1: number; r2: number; kLast: number }> {
  const pairAddress = await getPairAddress(tokenA, tokenB);
  const pair: Contract = new Contract(
    pairAddress,
    ABI.UNISWAP_V2_PAIR_ABI,
    provider,
  );
  const [r1, r2] = await pair.getReserves();
  const kLast = await pair.kLast();
  return { r1, r2, kLast };
}
