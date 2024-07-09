const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    
    let realEstate, escrow;
    let buyer, seller, lender, inspector;

    beforeEach(async () => {
        // Get the signers
        [buyer, seller, lender, inspector] = await ethers.getSigners();

        // Deploy the RealEstate contract
        const RealEstate =  await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();

        // Mint the property
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
        await transaction.wait();

        // Deploy the escrow contract
        const Escrow = await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address
        );
    })

    describe('Deployments', () => {
        it('Should return the NFT Address', async () => {

            let result = await escrow.nftAddress();

            expect(result).to.be.equal(realEstate.address);
        });
    
        it('Should returns the seller', async () => {
            let result = await escrow.seller();
            expect(result).to.be.equal(seller.address);
    
        });
    
        it('Should returns the lender', async () => {
            let result = await escrow.lender();
            expect(result).to.be.equal(lender.address);
        });
    
        it('Should returns the inspector', async () => {
            let result = await escrow.inspector();
            expect(result).to.be.equal(inspector.address);
        });
    })

    it('Saves the addresses', async () => {


    });

    describe('Listing', () => {
        it('Should update the status of the property ownership', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
        });
    })
})
