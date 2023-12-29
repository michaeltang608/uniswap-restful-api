import { ethers } from 'ethers';
import { ERC20_ABI } from './abis/abi';
import { toReadableAmount } from './util';
import provider from './provider';
import tokenMap from './consts/tokens';

export function createWallet(
  prvKey: string,
  provider: ethers.providers.Provider,
): ethers.Wallet {
  return new ethers.Wallet(prvKey, provider);
}

// get balance of token
export async function getBalance(
  address: string,
  tokenName: string,
): Promise<string> {
  //get native token balance, like eth
  if (tokenName === 'ETH') {
    return ethers.utils.formatEther(await provider.getBalance(address));
  }

  //get erc20 standard token balance
  const token = tokenMap.get(tokenName);
  if (!token) return '';
  const erc20: ethers.Contract = new ethers.Contract(
    token.address,
    ERC20_ABI,
    provider,
  );
  const balance: number = await erc20.balanceOf(address);

  return toReadableAmount(balance, token.decimals);
}
