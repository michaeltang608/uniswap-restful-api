import { ethers } from 'ethers';
import { WETH_ABI } from './consts/abi';
import * as Address from './consts/contractAddress';
import provider from './provider';

export async function deposit(
  prvKey: string,
  ethAmount: string,
): Promise<boolean> {
  const wallet: ethers.Wallet = new ethers.Wallet(prvKey, provider);
  const wethContract: ethers.Contract = new ethers.Contract(
    Address.WETH,
    WETH_ABI,
    wallet,
  );

  const txRes = await wethContract.deposit({
    value: ethers.utils.parseEther(ethAmount),
  });

  let receipt = null;
  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash);

      if (receipt !== null) {
        console.log('receive receipt: ', receipt);
        return true;
      }
    } catch (e) {
      console.log(`Receipt error:`, e);
      return false;
    }
  }
}
