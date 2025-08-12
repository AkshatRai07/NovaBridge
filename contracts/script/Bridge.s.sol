// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Bridge} from "../src/Bridge.sol";

contract BridgeScript is Script {
    Bridge public bridge;
    address PythBaseSepoliaTestnetAddress = 0xA2aa501b19aff244D90cc15a4Cf739D2725B5729;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        bridge = new Bridge(PythBaseSepoliaTestnetAddress);

        vm.stopBroadcast();
    }
}
