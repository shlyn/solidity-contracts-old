// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CoinTool {
    address owner;
    function claimTokens(address _token) external {
		require(owner == msg.sender); // 判断调用者地址是否为owner地址

		// 如果_token地址为0x0，就把当前合约地址的ETH发送到owner地址,然后退出
		if (_token == address(0x0)) {
			payable (owner).transfer(address(this).balance);
			return;
		}

		// 创建_token合约对象,将当前合约地址上的erc20token 代币发送到owner
		IERC20 erc20token = IERC20(_token);
		uint256 balance = erc20token.balanceOf(address(this));
		erc20token.transfer(owner, balance);
	}
}