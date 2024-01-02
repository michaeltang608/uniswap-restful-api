import { BigNumber, Wallet, ethers } from 'ethers';
import { CurrencyAmount, Percent, TradeType, Token } from '@uniswap/sdk-core';
import { SwapRouter, SwapOptions, Trade, Route, Pool } from '@uniswap/v3-sdk';
import { FeeAmount } from '@uniswap/v3-sdk';

import { getPoolInfo } from './pool';
import * as Address from './consts/contractAddress';
import * as txConfig from './consts/txConfig';
import * as Abi from './consts/abi';
import { TradeReq } from './beans/req';
import { fromReadableAmount } from './util';
import quote from './quote';
import provider from './provider';
import tokenMap from './consts/tokens';

//

export async function swap(
  symbolIn: string,
  symbolOut: string,
  amountIn: number,
  prvKey: string,
): Promise<{ suc: boolean; msg: string }> {
  symbolIn = symbolIn.toUpperCase();
  symbolOut = symbolOut.toUpperCase();
  if (!tokenMap.has(symbolIn) || !tokenMap.has(symbolOut)) {
    return { suc: false, msg: 'invalid token symbol' };
  }
  const wallet: Wallet = new ethers.Wallet(prvKey, provider);
  const req: TradeReq = {
    wallet,
    tokenIn: tokenMap.get(symbolIn),
    tokenOut: tokenMap.get(symbolOut),
    amountIn,
    poolFee: FeeAmount.MEDIUM,
  };
  const txRequest: ethers.providers.TransactionRequest = await buildTxRequest(
    wallet,
    req,
  );
  if (txRequest.value) {
    txRequest.value = BigNumber.from(txRequest.value);
  }
  // approve router to spend tokenIn
  const approveResult = await checkAndAproveRouter(req);
  if (!approveResult) {
    return { suc: false, msg: 'approve fail' };
  }

  console.log('before wallet sendTransaction');
  try {
    // manually configure max gas limit to prevent gas estimation error due to complex logic
    txRequest.gasLimit = 100 * 10000;
    const txResult = await wallet.sendTransaction(txRequest);
    console.log('wallet send transaction success, txResult=', txResult);
    let receipt = null;
    while (receipt === null) {
      try {
        receipt = await provider.getTransactionReceipt(txResult.hash);
      } catch (e) {
        console.log(`fetch receipt error:`, e);
        break;
      }
    }
    if (receipt) {
      console.log(`managed to get receipt`, receipt);
      return { suc: true, msg: '' };
    } else {
      return { suc: false, msg: 'no receipt' };
    }
  } catch (error) {
    console.error('wallet send transaction fail', error);
    return { suc: false, msg: 'send transaction fail' };
  }
}

async function checkAndAproveRouter(req: TradeReq): Promise<boolean> {
  const Erc20Contract = new ethers.Contract(
    req.tokenIn.address,
    Abi.ERC20_ABI,
    req.wallet,
  );
  const tx = await Erc20Contract.approve(
    Address.UNISWAP_V3_ROUTER,
    fromReadableAmount(req.amountIn, req.tokenIn.decimals),
  );
  let receipt = null;
  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(tx.hash);

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

type TokenTrade = Trade<Token, Token, TradeType>;

// build TransactionRequest
async function buildTxRequest(
  wallet: ethers.Wallet,
  req: TradeReq,
): Promise<ethers.providers.TransactionRequest> {
  const trade: TokenTrade = await buildTrade(req);
  const options: SwapOptions = {
    slippageTolerance: new Percent(50, 10_1000), // 50 bips
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from current unix time
    recipient: wallet.address,
  };
  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  const txRequest: ethers.providers.TransactionRequest = {
    data: methodParameters.calldata,
    to: Address.UNISWAP_V3_ROUTER,
    value: methodParameters.value,
    from: wallet.address,
    maxFeePerGas: txConfig.MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: txConfig.MAX_PRIORITY_FEE_PER_GAS,
  };
  console.log('build txRequest success');
  return txRequest;
}

// build trade
async function buildTrade(req: TradeReq): Promise<TokenTrade> {
  const tokenIn: Token = req.tokenIn;
  const tokenOut: Token = req.tokenOut;

  const poolInfo = await getPoolInfo(req);
  const pool = new Pool(
    tokenIn,
    tokenOut,
    req.poolFee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick,
  );
  const swapRoute = new Route([pool], tokenIn, tokenOut);

  const { suc, amountOut } = await quote(
    tokenIn.symbol,
    tokenOut.symbol,
    req.amountIn,
  );
  if (!suc) {
    return null;
  }

  const amountOutRaw = fromReadableAmount(amountOut, tokenOut.decimals);
  // const amountOutReadable = toReadableAmount(amountOut, tokenOut.decimals);
  console.log(
    `after quoteV2, ${req.amountIn} ${tokenIn.symbol} == ${amountOut} ${tokenOut.symbol}`,
  );

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      tokenIn,
      fromReadableAmount(req.amountIn, tokenIn.decimals).toString(),
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      tokenOut,
      amountOutRaw.toString(),
    ),
    tradeType: TradeType.EXACT_INPUT,
  });
  console.log('build trade success');
  return uncheckedTrade;
}
