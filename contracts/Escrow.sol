// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public nftAddress;
    address public inspector;
    address public lender;
    address payable public seller;

    modifier  onlySeller() {
        require(msg.sender == seller, "Only the seller can call this function");
        _;
    }

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;

    constructor(
        address _nftAddress,
        address payable _seller,
        address _inspector,
        address _lender
    ) {
        lender = _lender;
        inspector = _inspector;
        seller = _seller;
        nftAddress = _nftAddress;
    }

    function listNFT(
        uint256 _tokenId,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address _buyer
    ) public payable onlySeller{
        // Transfer NFT to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _tokenId);

        // Mark NFT as listed
        isListed[_tokenId] = true;

        // Store escrow details
        purchasePrice[_tokenId] = _purchasePrice;
        escrowAmount[_tokenId] = _escrowAmount;
        buyer[_tokenId] = _buyer;
    }
}
