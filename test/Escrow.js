import { expect } from 'chai';
import { ethers } from 'hardhat';

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {

    it('Saves the addresses', async () => {
        ethers.getContractFactory()
    });
})
