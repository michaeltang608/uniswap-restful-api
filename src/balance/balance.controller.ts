import { Controller, Get, Param } from '@nestjs/common';
import { log } from 'console';
import { getBalance } from '../libs/wallet';
import { walletAddress } from '../config';

@Controller('balance')
export class BalanceController {
  @Get(':token')
  async queryBalance(@Param('token') token: string) {
    log('query token balance');
    token = token.toUpperCase();

    const balance = await getBalance(walletAddress, token);
    return `balance of ${token}: ${balance}`;
  }
}
