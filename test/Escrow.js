const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {

    let buyer, seller, lender, inspector

    it('Saves the addresses', async () => {

        // Get the signers
        [buyer, seller, lender, inspector] = await ethers.getSigners();

        // Deploy the contract
        const RealEstate =  await ethers.getContractFactory('RealEstate');
        const realEstate = await RealEstate.deploy();

        // Mint the property
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
        await transaction.wait();

        const Escrow = await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address
        );

        let result = await escrow.nftAddress();

        expect(result).to.be.equal(realEstate.address);

        result = await escrow.seller();
        expect(result).to.be.equal(seller.address);
    });
})
