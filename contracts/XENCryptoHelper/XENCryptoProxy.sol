// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./interfaces/IXENCrypto.sol";
import "./interfaces/IXENCryptoProxy.sol";

contract XENCryptoProxy is IXENCryptoProxy {
    address public constant _XENCrypto = 0xDd68332Fe8099c0CF3619cB3Bb0D8159EF1eCc93;
    address public constant _XenAssistant = 0xAE272C6Ea3FdB317BCA0e83A9CB169f0d0f1073E;
	address private immutable _original;

	constructor() {
		_original = address(this);
	}

	function callClaimRank(uint term) external {
		require(msg.sender == _XenAssistant, "unauthorized");
		IXENCrypto(_XENCrypto).claimRank(term);
	}

	function callClaimMintRewardTo(address to) external {
		require(msg.sender == _XenAssistant, "unauthorized");
		IXENCrypto(_XENCrypto).claimMintRewardAndShare(to, 100);
		if(_original == address(0)) {
			selfdestruct(payable(tx.origin));
		}
	}
}
