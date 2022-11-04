// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./IERC165.sol";

interface IERC721 is IERC165 {
    // 定义Transfer事件，在发生交易转移时触发。Solidity event在 EVM 的日志记录功能之上提供了一个抽象。应用程序可以通过以太坊客户端的 RPC 接口订阅和监听这些事件
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    // 定义Approval事件，在发生代币授权时触发该事件
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    // 记录owner全部token授权给 operate事件
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // 记录
    function balanceOf(address owner) external view returns (uint256 balance);
    // 获取token的拥有者地址
    function ownerOf(uint256 tokenId) external view returns (address owner);
    // 转移token从from到to地址
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
    // 转移token从from到to地址
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    // 转移token从from到to地址 被
    function transferFrom(address from, address to, uint256 tokenId) external;
    // 将token授权给to地址
    function approve(address to, uint256 tokenId) external;
    // 授权全部token给operate地址
    function setApprovalForAll(address operator, bool _approved) external;
    // 获取token的授权者地址
    function getApproved(uint256 tokenId) external view returns (address operator);
    // 判断owner是否授权给operator
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}
