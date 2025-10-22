// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomToken is ERC20, Ownable {
    uint256 public deploymentTimestamp;
    string public customName;
    
    constructor(
        string memory _customName,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(string(abi.encodePacked(_customName, " Token")), symbol) Ownable(msg.sender) {
        customName = _customName;
        _mint(msg.sender, initialSupply * 10 ** decimals());
        deploymentTimestamp = block.timestamp;
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}