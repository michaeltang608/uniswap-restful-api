import { Controller, Get, Param } from '@nestjs/common';
import { log } from 'console';
import { getBalance } from '../libs/wallet';
import { walletAddress } from '../config';

@Controller('balance')
export class BalanceController {
  @Get(':token')
  async queryBalance(@Param() params) {
    log('query token balance');
    const token = (params.token as string).toUpperCase();

    const balance = await getBalance(walletAddress, token);
    return `balance of ${token}: ${balance}`;
  }
}
