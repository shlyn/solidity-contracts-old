// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IXENCrypto {
	function claimRank(uint256 term) external;
	function claimMintRewardAndShare(address other, uint256 pct) external;
}
