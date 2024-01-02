import { BigNumber, ethers } from 'ethers';

export function fromReadableAmount(
  amout: number | string,
  decimals: number,
): BigNumber {
  const amountStr = typeof amout === 'string' ? amout : amout.toString();
  return ethers.utils.parseUnits(amountStr, decimals);
}

export function toReadableAmount(
  rawAmount: ethers.BigNumberish,
  decimals: number,
): string {
  return ethers.utils.formatUnits(rawAmount, decimals);
  // .slice(0, READABLE_FROM_LEN);
}
