import { Controller, Get, Query } from '@nestjs/common';
import { log } from 'console';
import quotePrice from '../libs/quote';
import { QuoteDto } from './req.dto';

@Controller('quote')
export class QuoteController {
  @Get()
  async quote(@Query() req: QuoteDto) {
    log('begin query');
    // const mainnetTokens = tokens.mainnet;
    let amountIn = req.amountIn;
    if (!req.tokenIn || !req.tokenOut) {
      return 'missing token symbols';
    }

    const tokenIn = req.tokenIn.toUpperCase();
    const tokenOut = req.tokenOut.toUpperCase();
    if (!amountIn) {
      amountIn = 1;
    }
    const { suc, msg, amountOut } = await quotePrice(
      tokenIn,
      tokenOut,
      amountIn,
    );
    if (suc) {
      return { tokenIn, tokenOut, amountOut };
    } else {
      return { suc, msg };
    }
  }
}
