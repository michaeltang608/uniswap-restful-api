import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuoteController } from './quote/quote.controller';
import { BalanceController } from './balance/balance.controller';
import { SwapController } from './swap/swap.controller';

@Module({
  imports: [],
  controllers: [AppController, QuoteController, BalanceController, SwapController],
  providers: [AppService],
})
export class AppModule {}
