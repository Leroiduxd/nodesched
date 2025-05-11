// === Dépendances ===
const Web3 = require("web3").default;
const fetch = require("node-fetch");

// === Smart Contract Dashboard Configuration ===
const assetMapping = {
  "0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688": { symbol: "AAPL", expo: -5 },
  "0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a": { symbol: "AMZN", expo: -5 },
  "0xfee33f2a978bf32dd6b662b65ba8083c6773b494f8401194ec1870c640860245": { symbol: "COIN", expo: -5 },
  "0xe65ff435be42630439c96396653a342829e877e2aafaeaf1a10d0ee5fd2cf3f2": { symbol: "GOOG", expo: -5 },
  "0x6f9cd89ef1b7fd39f667101a91ad578b6c6ace4579d5f7f285a4b06aa4504be6": { symbol: "GME", expo: -5 },
  "0xc1751e085ee292b8b3b9dd122a135614485a201c35dfc653553f0e28c1baf3ff": { symbol: "INTC", expo: -5 },
  "0x9aa471dccea36b90703325225ac76189baf7e0cc286b8843de1de4f31f9caa7d": { symbol: "KO", expo: -5 },
  "0xd3178156b7c0f6ce10d6da7d347952a672467b51708baaf1a57ffe1fb005824a": { symbol: "MCD", expo: -5 },
  "0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1": { symbol: "MSFT", expo: -5 },
  "0x67649450b4ca4bfff97cbaf96d2fd9e40f6db148cb65999140154415e4378e14": { symbol: "NIKE", expo: -5 },
  "0x78a3e3b8e676a8f73c439f5d749737034b139bbbe899ba5775216fba596607fe": { symbol: "NVDA", expo: -5 },
  "0xb1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593": { symbol: "META", expo: -5 },
  "0x16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1": { symbol: "TSLA", expo: -5 },
  "0x67a6f93030420c1c9e3fe37c1ab6b77966af82f995944a9fefce357a22854a80": { symbol: "AUDUSD", expo: -5 },
  "0xa995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b": { symbol: "EUR", expo: -5 },
  "0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1": { symbol: "GBP", expo: -5 },
  "0x92eea8ba1b00078cdc2ef6f64f091f262e8c7d0576ee4677572f314ebfafa4c7": { symbol: "NZD", expo: -5 },
  "0x3112b03a41c910ed446852aacf67118cb1bec67b2cd0b9a214c58cc0eaa2ecca": { symbol: "CAD", expo: -5 },
  "0x0b1e3297e69f162877b577b0d6a47a0d63b2392bc8499e6540da4187a63e28f8": { symbol: "CHF", expo: -5 },
  "0xef2c98c804ba503c6a707e38be4dfbb16683775f195b091252bf24693042fd52": { symbol: "JPY", expo: -3 },
  "0xf2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e": { symbol: "XAGUSD", expo: -5 },
  "0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2": { symbol: "XAU", expo: -3 },
  "0x0bbf28e9a841a1cc788f6a361b17ca072d0ea3098a1e5df1c3922d06719579ff": { symbol: "PYTH", expo: -8 },
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace": { symbol: "ETH", expo: -8 }
};

// === ABI du Smart Contract ===
const contractAddress = "0xac51dd5ad45dc78661646f1e62aa0e8c60af086b";
const contractABI = [
    {
        "inputs": [],
        "name": "getAllAssetIds",
        "outputs": [
          { "internalType": "bytes32[]", "name": "stocks", "type": "bytes32[]" },
          { "internalType": "bytes32[]", "name": "forex", "type": "bytes32[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllLimitOrders",
        "outputs": [
          { "internalType": "uint256[]", "name": "orderIds", "type": "uint256[]" },
          { "internalType": "address[]", "name": "traders", "type": "address[]" },
          { "internalType": "bytes32[]", "name": "assetIds", "type": "bytes32[]" },
          { "internalType": "int256[]", "name": "targetPrices", "type": "int256[]" },
          { "internalType": "int256[]", "name": "orderStopLosses", "type": "int256[]" },
          { "internalType": "int256[]", "name": "orderTakeProfits", "type": "int256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllLiquidationPrices",
        "outputs": [
          { "internalType": "uint256[]", "name": "positionIds", "type": "uint256[]" },
          { "internalType": "bytes32[]", "name": "assetIds", "type": "bytes32[]" },
          { "internalType": "int256[]", "name": "liqPrices", "type": "int256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllStopLosses",
        "outputs": [
          { "internalType": "uint256[]", "name": "positionIds", "type": "uint256[]" },
          { "internalType": "bytes32[]", "name": "assetIds", "type": "bytes32[]" },
          { "internalType": "int256[]", "name": "stopLossValues", "type": "int256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllTakeProfits",
        "outputs": [
          { "internalType": "uint256[]", "name": "positionIds", "type": "uint256[]" },
          { "internalType": "bytes32[]", "name": "assetIds", "type": "bytes32[]" },
          { "internalType": "int256[]", "name": "takeProfitValues", "type": "int256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      // Fonctions à appeler automatiquement lorsque la ligne devient verte
      {
        "inputs": [
          { "internalType": "uint256", "name": "orderId", "type": "uint256" },
          { "internalType": "bytes[]", "name": "priceUpdate", "type": "bytes[]" }
        ],
        "name": "executeLimitOrder",
        "outputs": [
          { "internalType": "bool", "name": "executed", "type": "bool" },
          { "internalType": "uint256", "name": "positionId", "type": "uint256" }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "positionId", "type": "uint256" },
          { "internalType": "bytes[]", "name": "priceUpdate", "type": "bytes[]" }
        ],
        "name": "closePositionLiquidation",
        "outputs": [
          { "internalType": "bool", "name": "closed", "type": "bool" },
          { "internalType": "uint256", "name": "finalAmount", "type": "uint256" },
          { "internalType": "int256", "name": "profit", "type": "int256" }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "positionId", "type": "uint256" },
          { "internalType": "bytes[]", "name": "priceUpdate", "type": "bytes[]" }
        ],
        "name": "closePositionStopLoss",
        "outputs": [
          { "internalType": "bool", "name": "closed", "type": "bool" },
          { "internalType": "uint256", "name": "finalAmount", "type": "uint256" },
          { "internalType": "int256", "name": "profit", "type": "int256" }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "positionId", "type": "uint256" },
          { "internalType": "bytes[]", "name": "priceUpdate", "type": "bytes[]" }
        ],
        "name": "closePositionTakeProfit",
        "outputs": [
          { "internalType": "bool", "name": "closed", "type": "bool" },
          { "internalType": "uint256", "name": "finalAmount", "type": "uint256" },
          { "internalType": "int256", "name": "profit", "type": "int256" }
        ],
        "stateMutability": "payable",
        "type": "function"
      }
];

// === Variables Globales ===
const cooldowns = {};
const COOLDOWN_MS = 30000;

// !!! Pour la démo - clé privée très risquée !!!
const privateKey = "0xe12f9b03327a875c2d5bf9b40a75cd2effeed46ea508ee595c6bc708c386da8c";
// RPC endpoint (Infura ou autre, chaîne appropriée)
const HTTP_RPC = "https://api.avax-test.network/ext/bc/C/rpc";
 // à remplacer

const web3 = new Web3(HTTP_RPC);
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Message console
function notify(msg) {
  console.log("[NOTIF]", msg);
}

// Formatage valeur
function formatValue(value, assetId) {
  const assetIdLower = assetId.toLowerCase();
  const expo = assetMapping[assetIdLower] ? assetMapping[assetIdLower].expo : 0;
  return parseFloat(value) * Math.pow(10, expo);
}

// === Gestion des prix live (= cache local) ===
const liveAssets = [
  "Equity.US.AAPL/USD", "Equity.US.AMZN/USD", "Equity.US.COIN/USD", "Equity.US.GOOG/USD",
  "Equity.US.GME/USD", "Equity.US.INTC/USD", "Equity.US.KO/USD", "Equity.US.MCD/USD",
  "Equity.US.MFST/USD", "Equity.US.NKE/USD", "Equity.US.NVDA/USD", "Equity.US.FB/USD",
  "Equity.US.TSLA/USD", "FX.AUD/USD", "FX.EUR/USD", "FX.GBP/USD", "FX.NZD/USD",
  "FX.USD/CAD", "FX.USD/CHF", "FX.USD/JPY", "Metal.XAU/USD", "Metal.XAG/USD",
  "Crypto.PYTH/USD", "Crypto.ETH/USD"
];
const liveRows = {};
liveAssets.forEach(a => liveRows[a] = { lastPrice: null });

// Fonction helper pour convertir "symbol" vers id de liveAsset
function resolveLiveSymbol(symbol) {
  // simple mapping
  for (let asset of liveAssets) {
    if (asset.endsWith(symbol + "/USD") || asset.endsWith(symbol)) return asset;
    // exceptions/minors
    if (symbol === "NIKE"&&asset.includes("NKE")) return asset;
    if (symbol === "META"&&asset.includes("FB")) return asset;
    if (symbol === "MSFT"&&asset.includes("MFST")) return asset;
    if (symbol === "XAGUSD"&&asset.includes("XAG")) return asset;
    if (symbol === "XAU"&&asset.includes("XAU")) return asset;
    if (symbol === "EUR"&&asset.includes("EUR")) return asset;
    if (symbol === "GBP"&&asset.includes("GBP")) return asset;
    if (symbol === "PYTH"&&asset.includes("PYTH")) return asset;
    if (symbol === "ETH"&&asset.includes("ETH")) return asset;
  }
  return null;
}

// Récupérer le dernier prix du marché pour un symbol ("AAPL" etc.)
function getMarketPrice(symbol) {
  const liveSym = resolveLiveSymbol(symbol);
  if (liveSym&&liveRows[liveSym]&&liveRows[liveSym].lastPrice)
    return parseFloat(liveRows[liveSym].lastPrice);
  return null;
}

// Recharge les prix en direct toutes les 5 secondes via l'API TradingView de Pyth (pas de streaming, REST polling)
async function updateLivePrices() {
  for (const asset of liveAssets) {
    try {
      const resp = await fetch(`https://benchmarks.pyth.network/v1/shims/tradingview/price/${encodeURIComponent(asset)}`);
      const data = await resp.json();
      if (data&&data.p)
        liveRows[asset].lastPrice = data.p;
    } catch (err) {
      liveRows[asset].lastPrice = null;
    }
  }
}

// === Fonctions d'appel contrats ===
async function callPositionFunction(functionName, id, assetId) {
  const key = functionName + ":" + id;
  const now = Date.now();
  if (cooldowns[key]&&now < cooldowns[key]) {
    notify("Cooldown sur " + key);
    return;
  }
  cooldowns[key] = now + COOLDOWN_MS;
  const assetIdForAPI = assetId.replace(/^0x/, "");
  const url = "https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=" + assetIdForAPI;
  try {
    const response = await fetch(url);
    const json = await response.json();
    let priceUpdate = "";
    if (
      json.binary&&json.binary.data&&json.binary.data.length > 0&&json.binary.data[0]
    ) {
      priceUpdate = "0x" + json.binary.data[0];
    }
    let nonce = await web3.eth.getTransactionCount(account.address, "pending");
    let estimatedGas = await contract.methods[functionName](id, [priceUpdate])
      .estimateGas({ from: account.address });
    estimatedGas = Math.floor(estimatedGas * 1.2);
    let gasPrice = await web3.eth.getGasPrice();
    gasPrice = Math.floor(parseInt(gasPrice) * 2);
    const txOptions = {
      from: account.address,
      gas: estimatedGas,
      gasPrice: gasPrice,
      nonce: nonce
    };
    try {
      const tx = await contract.methods[functionName](id, [priceUpdate]).send(txOptions);
      notify(functionName + " exécutée. Tx : " + tx.transactionHash);
    } catch (e) {
      if (e.message&&e.message.includes("nonce too low")) {
        notify("Nonce bas: retry...");
        nonce = await web3.eth.getTransactionCount(account.address, "latest");
        txOptions.nonce = nonce;
        const tx = await contract.methods[functionName](id, [priceUpdate]).send(txOptions);
        notify(functionName + " OK (nonce upd.). Tx: " + tx.transactionHash);
      } else {
        throw e;
      }
    }
  } catch (e) {
    notify("Erreur " + functionName + " ID " + id + ": " + e.message);
  }
}

// === Chargement Données du Smart Contract ===
async function loadAssets() {
  try {
    const result = await contract.methods.getAllAssetIds().call();
    const stocks = result[0], forex = result[1];
    console.log("Stocks :", stocks);
    console.log("Forex :", forex);
  } catch (error) {
    notify("Erreur lors du chargement des assets: " + error.message);
  }
}

async function loadLimitOrders() {
  try {
    const result = await contract.methods.getAllLimitOrders().call();
    const orderIds = result[0], assetIds = result[2], targetPrices = result[3];
    for (let i = 0; i < orderIds.length; i++) {
      const assetId = assetIds[i];
      const assetIdLower = assetId.toLowerCase();
      const symbol = assetMapping[assetIdLower] ? assetMapping[assetIdLower].symbol : assetId;
      const formattedTargetPrice = formatValue(targetPrices[i], assetId);
      const marketPrice = getMarketPrice(symbol);
      console.log(`Limit Order [${orderIds[i]}] ${symbol}: Target=${formattedTargetPrice}, Market=${marketPrice}`);
      if (marketPrice) {
        const ratio = formattedTargetPrice / marketPrice;
        if (Math.abs(ratio - 1) <= 0.001) {
          await callPositionFunction("executeLimitOrder", orderIds[i], assetId);
        }
      }
    }
  } catch (error) {
    notify("Erreur lors du chargement des Limit Orders: " + error.message);
  }
}

async function loadLiquidationPrices() {
  try {
    const result = await contract.methods.getAllLiquidationPrices().call();
    const positionIds = result[0], assetIds = result[1], liqPrices = result[2];
    for (let i = 0; i < positionIds.length; i++) {
      const assetId = assetIds[i], assetIdLower = assetId.toLowerCase();
      const symbol = assetMapping[assetIdLower] ? assetMapping[assetIdLower].symbol : assetId;
      const formattedLiq = formatValue(liqPrices[i], assetId);
      const marketPrice = getMarketPrice(symbol);
      console.log(`Liquidation [${positionIds[i]}] ${symbol}: Liq=${formattedLiq}, Market=${marketPrice}`);
      if (marketPrice) {
        const ratio = formattedLiq / marketPrice;
        if (Math.abs(ratio - 1) <= 0.001) {
          await callPositionFunction("closePositionLiquidation", positionIds[i], assetId);
        }
      }
    }
  } catch (err) {
    notify("Erreur lors du chargement des liquidations: " + err.message);
  }
}

async function loadStopLosses() {
  try {
    const result = await contract.methods.getAllStopLosses().call();
    const positionIds = result[0], assetIds = result[1], stopLossValues = result[2];
    for (let i = 0; i < positionIds.length; i++) {
      const assetId = assetIds[i], assetIdLower = assetId.toLowerCase();
      const symbol = assetMapping[assetIdLower] ? assetMapping[assetIdLower].symbol : assetId;
      const formattedStopLoss = formatValue(stopLossValues[i], assetId);
      const marketPrice = getMarketPrice(symbol);
      console.log(`StopLoss [${positionIds[i]}] ${symbol}: SL=${formattedStopLoss}, Market=${marketPrice}`);
      if (marketPrice) {
        const ratio = formattedStopLoss / marketPrice;
        if (Math.abs(ratio - 1) <= 0.001) {
          await callPositionFunction("closePositionStopLoss", positionIds[i], assetId);
        }
      }
    }
  } catch (error) {
    notify("Erreur lors du chargement des StopLoss: " + error.message);
  }
}

async function loadTakeProfits() {
  try {
    const result = await contract.methods.getAllTakeProfits().call();
    const positionIds = result[0], assetIds = result[1], takeProfitValues = result[2];
    for (let i = 0; i < positionIds.length; i++) {
      const assetId = assetIds[i], assetIdLower = assetId.toLowerCase();
      const symbol = assetMapping[assetIdLower] ? assetMapping[assetIdLower].symbol : assetId;
      const formattedTakeProfit = formatValue(takeProfitValues[i], assetId);
      const marketPrice = getMarketPrice(symbol);
      console.log(`TakeProfit [${positionIds[i]}] ${symbol}: TP=${formattedTakeProfit}, Market=${marketPrice}`);
      if (marketPrice) {
        const ratio = formattedTakeProfit / marketPrice;
        if (Math.abs(ratio - 1) <= 0.001) {
          await callPositionFunction("closePositionTakeProfit", positionIds[i], assetId);
        }
      }
    }
  } catch (err) {
    notify("Erreur lors du chargement des TakeProfits: " + err.message);
  }
}


// === "Main" Loop ===
async function main() {
  await loadAssets();
  setInterval(updateLivePrices, 6000);
  setInterval(async () => {
    await loadLimitOrders();
    await loadLiquidationPrices();
    await loadStopLosses();
    await loadTakeProfits();
  }, 9000);
}

// Go!
updateLivePrices().then(main);