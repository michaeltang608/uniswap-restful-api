import { BigNumber, ethers } from 'ethers';

export function fromReadableAmount(amout: number, decimals: number): BigNumber {
  return ethers.utils.parseUnits(amout.toString(), decimals);
}

export function toReadableAmount(
  rawAmount: ethers.BigNumberish,
  decimals: number,
): string {
  return ethers.utils.formatUnits(rawAmount, decimals);
  // .slice(0, READABLE_FROM_LEN);
}
