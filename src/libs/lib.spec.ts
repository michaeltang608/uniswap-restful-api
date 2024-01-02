// import { Test, TestingModule } from '@nestjs/testing';
import { getReserve } from './pair';
import tokens from './consts/tokens';
describe('uniswap', () => {
  //   it('pair exist', async () => {
  //     const pairAddress = await getPairAddress(
  //       tokens.get('WETH').address,
  //       tokens.get('DAI').address,
  //     );
  //     console.log(`pair address = ${pairAddress}`);
  //     const WETH_DAI_PAIR = '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11';
  //     expect(pairAddress.toLocaleLowerCase()).toBe(
  //       WETH_DAI_PAIR.toLocaleLowerCase(),
  //     );
  //   });
  it('get reserve', async () => {
    const { r1, r2, kLast } = await getReserve(
      tokens.get('WETH').address,
      tokens.get('DAI').address,
    );

    console.log(`r1=${r1}, r2=${r2}, kLast=${kLast}`);
  });
});
