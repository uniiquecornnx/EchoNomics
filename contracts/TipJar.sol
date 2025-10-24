// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TipJar {
    event TipSent(address indexed from, address indexed to, uint256 amount, string message);

    function sendTip(address payable streamer, string calldata message) external payable {
        require(msg.value > 0, "Tip must be greater than 0");
        streamer.transfer(msg.value);
        emit TipSent(msg.sender, streamer, msg.value, message);
    }
}
