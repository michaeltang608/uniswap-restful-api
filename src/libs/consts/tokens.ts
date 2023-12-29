import { ChainId, Token } from '@uniswap/sdk-core';

const tokens: Token[] = [
  new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  new Token(
    ChainId.MAINNET,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD//C',
  ),
];

const tokenMap = new Map<string, Token>();
tokens.forEach((e) => {
  tokenMap.set(e.symbol, e);
});
export default tokenMap;
