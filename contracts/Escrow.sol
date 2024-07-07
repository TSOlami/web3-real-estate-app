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
    address public lender;
    address public inspector;
    address payable public seller;
    address public nftAddress;

    constructor(
        address _lender,
        address _inspector,
        address payable _seller,
        address _nftAddress
    ) {
        lender = _lender;
        inspector = _inspector;
        seller = _seller;
        nftAddress = _nftAddress;
    }

}
