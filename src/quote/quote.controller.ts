import { Controller, Get, Query } from '@nestjs/common';
import { log } from 'console';
import quotePrice from '../libs/quote';

@Controller('quote')
export class QuoteController {
  @Get()
  async quote(@Query() query) {
    log('begin query');
    // const mainnetTokens = tokens.mainnet;
    const tokenIn = query.tokenIn;
    const tokenOut = query.tokenOut;
    let amountIn = query.amountIn;
    if (!tokenIn || !tokenOut) {
      return 'missing token symbols';
    }

    if (!amountIn) {
      amountIn = 1;
    }
    const symbolIn: string = tokenIn as string;
    const symbolOut: string = tokenOut as string;
    const { suc, msg, amountOut } = await quotePrice(
      symbolIn.toUpperCase(),
      symbolOut.toUpperCase(),
      amountIn,
    );
    if (suc) {
      return { tokenIn, tokenOut, amountOut };
    } else {
      return { suc, msg };
    }
  }
}
