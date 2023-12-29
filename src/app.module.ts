import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuoteController } from './quote/quote.controller';
import { BalanceController } from './balance/balance.controller';

@Module({
  imports: [],
  controllers: [AppController, QuoteController, BalanceController],
  providers: [AppService],
})
export class AppModule {}
