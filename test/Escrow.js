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

        // Approve the escrow contract to transfer the property
        transaction = await realEstate.connect(seller).approve(escrow.address, 1);
        await transaction.wait();

        // List the property
        transaction = await escrow.connect(seller).listNFT(1, tokens(100), tokens(50), buyer.address);
        await transaction.wait();

    })

    describe('Deployments', () => {
        it('Should return the NFT Address', async () => {

            let result = await escrow.nftAddress();

            expect(result).to.be.equal(realEstate.address);
        });
    
        it('Should return the seller', async () => {
            let result = await escrow.seller();
            expect(result).to.be.equal(seller.address);
    
        });
    
        it('Should return the lender', async () => {
            let result = await escrow.lender();
            expect(result).to.be.equal(lender.address);
        });
    
        it('Should return the inspector', async () => {
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

        it('Should update the status of the property listing', async () => {
            const result = await escrow.isListed(1);
            expect(result).to.be.equal(true);
        });

        it('Should return the purchase price of the property', async () => {
            const result = await escrow.purchasePrice(1);
            expect(result).to.be.equal(tokens(100));
        });
        
        it('Should return the buyer of the property', async () => {
            const result = await escrow.buyer(1);
            expect(result).to.be.equal(buyer.address);
        });

        it('Should return the escrow amount of the property', async () => {
            const result = await escrow.escrowAmount(1);
            expect(result).to.be.equal(tokens(50));
        });

        it('Check if only the seller can list the property', async () => {
            const result = escrow.connect(buyer).listNFT(1, tokens(100), tokens(50), buyer.address);
            await expect(result).to.be.revertedWith('Only the seller can call this function');
        });
    })
})
