export const runtime = "nodejs";

import { HermesClient } from "@pythnetwork/hermes-client";

const PRICE_LABELS: string[] = [
  "ETH/USD",
  "AUD/USD",
  "EUR/USD",
  "GBP/USD",
  "NZD/USD",
  "USD/BRL",
  "USD/CAD",
  "USD/CHF",
  "USD/CLP",
  "USD/CNH",
  "USD/COP",
  "USD/HKD",
  "USD/IDR",
  "USD/INR",
  "USD/JPY",
  "USD/KRW",
  "USD/MXN",
  "USD/NOK",
  "USD/PEN",
  "USD/PHP",
  "USD/SEK",
  "USD/SGD",
  "USD/TRY",
  "USD/TWD",
  "USD/ZAR",
];

const PRICE_FEED_IDS: string[] = [
  "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD
  "67a6f93030420c1c9e3fe37c1ab6b77966af82f995944a9fefce357a22854a80", // AUD/USD
  "a995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b", // EUR/USD
  "84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1", // GBP/USD
  "92eea8ba1b00078cdc2ef6f64f091f262e8c7d0576ee4677572f314ebfafa4c7", // NZD/USD
  "d2db4dbf1aea74e0f666b0e8f73b9580d407f5e5cf931940b06dc633d7a95906", // USD/BRL
  "3112b03a41c910ed446852aacf67118cb1bec67b2cd0b9a214c58cc0eaa2ecca", // USD/CAD
  "0b1e3297e69f162877b577b0d6a47a0d63b2392bc8499e6540da4187a63e28f8", // USD/CHF
  "d407a4b25cae3f9ec063af35c1d7feb9aa55be71d3f2a01b6de719dbcc3e84c7", // USD/CLP
  "eef52e09c878ad41f6a81803e3640fe04dceea727de894edd4ea117e2e332e66", // USD/CNH
  "caffb53eda8972cf729e59166e64f893960db66fa89ff5cd4702caf2ef4edf8d", // USD/COP
  "19d75fde7fee50fe67753fdc825e583594eb2f51ae84e114a5246c4ab23aff4c", // USD/HKD
  "6693afcd49878bbd622e46bd805e7177932cf6ab0b1c91b135d71151b9207433", // USD/IDR
  "0ac0f9a2886fc2dd708bc66cc2cea359052ce89d324f45d95fadbc6c4fcf1809", // USD/INR
  "ef2c98c804ba503c6a707e38be4dfbb16683775f195b091252bf24693042fd52", // USD/JPY
  "e539120487c29b4defdf9a53d337316ea022a2688978a468f9efd847201be7e3", // USD/KRW
  "e13b1c1ffb32f34e1be9545583f01ef385fde7f42ee66049d30570dc866b77ca", // USD/MXN
  "235ddea9f40e9af5814dbcc83a418b98e3ee8df1e34e1ae4d45cf5de596023a3", // USD/NOK
  "5a90fd584136ff7969fc54c6642430e3c50af8ff234ed0e697555ea7b192446a", // USD/PEN
  "2bda7f268b52bfbc3f2e124c31445247647350db313caadc6771e6299e0a68c9", // USD/PHP
  "8ccb376aa871517e807358d4e3cf0bc7fe4950474dbe6c9ffc21ef64e43fc676", // USD/SEK
  "396a969a9c1480fa15ed50bc59149e2c0075a72fe8f458ed941ddec48bdb4918", // USD/SGD
  "032a2eba1c2635bf973e95fb62b2c0705c1be2603b9572cc8d5edeaf8744e058", // USD/TRY
  "489f02f2f13584026d63fd397c80ed3b414a2820c4d43da0306fc007fcd5a8e0", // USD/TWD
  "389d889017db82bf42141f23b61b8de938a4e2d156e36312175bebf797f493f1", // USD/ZAR
];

// Map ID → Label
const ID_TO_LABEL = PRICE_FEED_IDS.reduce((map, id, idx) => {
  map[id] = PRICE_LABELS[idx];
  return map;
}, {} as Record<string, string>);

export async function GET() {
  const connection = new HermesClient("https://hermes.pyth.network", {});

  const latestPrices: Record<string, number> = {};

  const stream = new ReadableStream({
    async start(controller) {
      const send = () => {
        const dataArray = PRICE_LABELS.map(label => ({
          pair: label,
          price: latestPrices[label] ?? null
        }));
        controller.enqueue(`data: ${JSON.stringify(dataArray)}\n\n`);
      };

      const eventSource = await connection.getPriceUpdatesStream(PRICE_FEED_IDS);

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.parsed?.length) {
            for (const feed of parsed.parsed) {
              const label = ID_TO_LABEL[feed.id];
              if (!label) continue;
              const actualPrice = feed.price.price * Math.pow(10, feed.price.expo);
              latestPrices[label] = actualPrice;
            }
            send();
          }
        } catch (err) {
          console.error("Error parsing HermesClient data:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("HermesClient SSE error:", err);
        eventSource.close();
      };
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    }
  });
}
