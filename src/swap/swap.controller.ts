import { Body, Controller, Post } from '@nestjs/common';
import { deposit } from '../libs/weth';
import { swap } from '../libs/trade';
import { prvKey } from '../config';
import { SwapDto, DepositDto } from './req.dto';

@Controller('swap')
export class SwapController {
  @Post()
  async swap(@Body() req: SwapDto) {
    const { suc, msg } = await swap(
      req.tokenIn,
      req.tokenOut,
      req.amountIn,
      prvKey,
    );
    return { suc: suc, msg: msg };
  }
  @Post('weth')
  async depositWETH(@Body() req: DepositDto) {
    const result = await deposit(prvKey, req.amountIn.toString());
    return result;
  }
}
