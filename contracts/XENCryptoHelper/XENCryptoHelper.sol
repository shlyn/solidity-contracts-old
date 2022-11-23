// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./XENCryptoProxy.sol";
import "./interfaces/IXENCryptoProxy.sol";

contract XENCryptoHelper  {
	bytes miniProxy;

	mapping (address=>uint) public countClaimRank;
	mapping (address=>uint) public countClaimMint;
	
	constructor(address _miniProxy) {
        require(_miniProxy != address(0));
		miniProxy = bytes.concat(
            bytes20(0x3D602d80600A3D3981F3363d3d373d3D3D363d73),
            bytes20(address(_miniProxy)),
            bytes15(0x5af43d82803e903d91602b57fd5bf3)
        );
	}

	function bulkClaimRank(uint times, uint term) external {
		bytes memory bytecode = miniProxy;
		address proxy;
		uint N = countClaimRank[msg.sender] + 1;
		for(uint i = N; i < N + times; i++) {
	        bytes32 salt = keccak256(abi.encodePacked(msg.sender, i));
			assembly {
	            proxy := create2(0, add(bytecode, 32), mload(bytecode), salt)
			}
			IXENCryptoProxy(proxy).callClaimRank(term);
		}
		countClaimRank[msg.sender] += times;
	}

	function bulkClaimMintReward(uint times) external {
		uint N = countClaimRank[msg.sender];
		uint M = countClaimMint[msg.sender];
		N = M + times < N ? M + times : N;
		for(uint i = M + 1; i < N + 1; i++) {
	        address proxy = proxyFor(msg.sender, i);
			IXENCryptoProxy(proxy).callClaimMintRewardTo(msg.sender);
		}
		countClaimMint[msg.sender] = N;
	}

	function batchClaimMint(uint times) external {
		uint N = countClaimRank[msg.sender];
		uint M = countClaimMint[msg.sender];
		N = M + times < N ? M + times : N;
		for(uint i = M + 1; i < N + 1; i++) {
	        address proxy = proxyFor(msg.sender, i);
			IXENCryptoProxy(proxy).callClaimMintRewardTo(msg.sender);
		}
		countClaimMint[msg.sender] = N;
	}

    function proxyFor(address sender, uint i) private view returns (address proxy) {
        bytes32 salt = keccak256(abi.encodePacked(sender, i));
        proxy = address(uint160(uint(keccak256(abi.encodePacked(
                hex'ff',
                address(this),
                salt,
                keccak256(abi.encodePacked(miniProxy))
            )))));
    }
}