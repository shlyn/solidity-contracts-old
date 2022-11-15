// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../Token/ERC721/ERC721.sol";

contract NFTFarm {
    function stakeNFT721(address contractAddress, uint256 tokenId) external {
        IERC721 nftContract = IERC721(contractAddress);
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function withdraw() external {
        //
    }
}