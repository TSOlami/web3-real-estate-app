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

    mapping(uint256 => bool) public isListed;

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

    function listNFT(uint256 _tokenId) public {
        // Transfer NFT to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _tokenId);

        // Mark NFT as listed
        isListed[_tokenId] = true;
    }
}
