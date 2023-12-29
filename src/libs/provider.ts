import { ethers } from 'ethers';
import { rpcUrl } from '../config';

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

export default provider;
