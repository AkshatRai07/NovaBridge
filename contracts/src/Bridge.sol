// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract Bridge {
    IPyth pyth;

    bytes32 constant public ETH_USD_ID = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace; // Ether

    bytes32 constant public AUD_USD_ID = 0x67a6f93030420c1c9e3fe37c1ab6b77966af82f995944a9fefce357a22854a80; // Australian Doll (Australia)
    bytes32 constant public EUR_USD_ID = 0xa995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b; // Euro (Eurozone countries)
    bytes32 constant public GBP_USD_ID = 0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1; // Pound Sterling (United Kingdom)
    bytes32 constant public NZD_USD_ID = 0x92eea8ba1b00078cdc2ef6f64f091f262e8c7d0576ee4677572f314ebfafa4c7; // New Zealand Dollar (New Zealand)

    bytes32 constant public USD_BRL_ID = 0xd2db4dbf1aea74e0f666b0e8f73b9580d407f5e5cf931940b06dc633d7a95906; // Brazilian Real (Brazil)
    bytes32 constant public USD_CAD_ID = 0x3112b03a41c910ed446852aacf67118cb1bec67b2cd0b9a214c58cc0eaa2ecca; // Canadian Dollar (Canada)
    bytes32 constant public USD_CHF_ID = 0x0b1e3297e69f162877b577b0d6a47a0d63b2392bc8499e6540da4187a63e28f8; // Swiss Franc (Switzerland & Liechtenstein)
    bytes32 constant public USD_CLP_ID = 0xd407a4b25cae3f9ec063af35c1d7feb9aa55be71d3f2a01b6de719dbcc3e84c7; // Chilean Peso (Chile)
    bytes32 constant public USD_CNH_ID = 0xeef52e09c878ad41f6a81803e3640fe04dceea727de894edd4ea117e2e332e66; // Chinese Yuan (offshore market)
    bytes32 constant public USD_COP_ID = 0xcaffb53eda8972cf729e59166e64f893960db66fa89ff5cd4702caf2ef4edf8d; // Colombian Peso (Colombia)
    bytes32 constant public USD_HKD_ID = 0x19d75fde7fee50fe67753fdc825e583594eb2f51ae84e114a5246c4ab23aff4c; // Hong Kong Dollar (Hong Kong)
    bytes32 constant public USD_IDR_ID = 0x6693afcd49878bbd622e46bd805e7177932cf6ab0b1c91b135d71151b9207433; // Indonesian Rupiah (Indonesia)
    bytes32 constant public USD_INR_ID = 0x0ac0f9a2886fc2dd708bc66cc2cea359052ce89d324f45d95fadbc6c4fcf1809; // Indian Rupee (India)
    bytes32 constant public USD_JPY_ID = 0xef2c98c804ba503c6a707e38be4dfbb16683775f195b091252bf24693042fd52; // Japanese Yen (Japan)
    bytes32 constant public USD_KRW_ID = 0xe539120487c29b4defdf9a53d337316ea022a2688978a468f9efd847201be7e3; // South Korean Won (South Korea)
    bytes32 constant public USD_MXN_ID = 0xe13b1c1ffb32f34e1be9545583f01ef385fde7f42ee66049d30570dc866b77ca; // Mexican Peso (Mexico)
    bytes32 constant public USD_NOK_ID = 0x235ddea9f40e9af5814dbcc83a418b98e3ee8df1e34e1ae4d45cf5de596023a3; // Norwegian Krone (Norway)
    bytes32 constant public USD_PEN_ID = 0x5a90fd584136ff7969fc54c6642430e3c50af8ff234ed0e697555ea7b192446a; // Peruvian Sol (Peru)
    bytes32 constant public USD_PHP_ID = 0x2bda7f268b52bfbc3f2e124c31445247647350db313caadc6771e6299e0a68c9; // Philippine Peso (Philippines)
    bytes32 constant public USD_SEK_ID = 0x8ccb376aa871517e807358d4e3cf0bc7fe4950474dbe6c9ffc21ef64e43fc676; // Swedish Krona (Sweden)
    bytes32 constant public USD_SGD_ID = 0x396a969a9c1480fa15ed50bc59149e2c0075a72fe8f458ed941ddec48bdb4918; // Singapore Dollar (Singapore)
    bytes32 constant public USD_TRY_ID = 0x032a2eba1c2635bf973e95fb62b2c0705c1be2603b9572cc8d5edeaf8744e058; // Turkish Lira (Türkiye)
    bytes32 constant public USD_TWD_ID = 0x489f02f2f13584026d63fd397c80ed3b414a2820c4d43da0306fc007fcd5a8e0; // New Taiwan Dollar (Taiwan)
    bytes32 constant public USD_ZAR_ID = 0x389d889017db82bf42141f23b61b8de938a4e2d156e36312175bebf797f493f1; // South African Rand (South Africa)

    constructor(address pythContract) {
        pyth = IPyth(pythContract);
        // Pyth Base Sepolia Testnet Address = 0xA2aa501b19aff244D90cc15a4Cf739D2725B5729
    }
 
    /**
        * This method is an example of how to interact with the Pyth contract.
        * Fetch the priceUpdate from Hermes and pass it to the Pyth contract to update the prices.
        * Add the priceUpdate argument to any method on your contract that needs to read the Pyth price.
        * See https://docs.pyth.network/price-feeds/fetch-price-updates for more information on how to fetch the priceUpdate.
    
        * @param priceUpdate The encoded data to update the contract with the latest price
     */
    function exampleMethod(bytes[] calldata priceUpdate) public payable {
        // Submit a priceUpdate to the Pyth contract to update the on-chain price.
        // Updating the price requires paying the fee returned by getUpdateFee.
        // WARNING: These lines are required to ensure the getPriceNoOlderThan call below succeeds. If you remove them, transactions may fail with "0x19abf40e" error.
        uint fee = pyth.getUpdateFee(priceUpdate);
        pyth.updatePriceFeeds{ value: fee }(priceUpdate);

        // Read the current price from a price feed if it is less than 60 seconds old.
        // Each price feed (e.g., ETH/USD) is identified by a price feed ID.
        // The complete list of feed IDs is available at https://docs.pyth.network/price-feeds/price-feeds
        bytes32 priceFeedId = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace; // ETH/USD
        PythStructs.Price memory price = pyth.getPriceNoOlderThan(priceFeedId, 60);
    }
}
