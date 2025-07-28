"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var viem_1 = require("viem");
require("viem/window");
var constants_ts_js_1 = require("./constants-ts.js");
var connectButton = document.getElementById("connectButton");
var fundButton = document.getElementById("fundButton");
var ethAmountInput = document.getElementById("ethAmountInput");
var balanceButton = document.getElementById("balanceButton");
var withdrawButton = document.getElementById("withdrawButton");
var walletClient; // walletClient is the client that we use to interact with the user's wallet, it is created using the createWalletClient method from viem
// It is used to send transactions, request addresses, etc. It is a viem type
var publicClient; // publicClient is the client that we use to interact with the blockchain, it is created using the createPublicClient method from viem
// It is used to read data from the blockchain, such as balances, contract calls, etc
function connect() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof window.ethereum !== "undefined")) return [3 /*break*/, 2];
                    walletClient = (0, viem_1.createWalletClient)({
                        transport: (0, viem_1.custom)(window.ethereum)
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()]; // requestAddresses is a viem method to get the user's addresses, it returns a promise
                case 1:
                    _a.sent(); // requestAddresses is a viem method to get the user's addresses, it returns a promise
                    connectButton.innerText = "Connected!";
                    return [3 /*break*/, 3];
                case 2:
                    connectButton.innerText = "Please install MetaMask!";
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fund() {
    return __awaiter(this, void 0, void 0, function () {
        var ethAmount, connectedAccount, currentChain, request, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ethAmount = ethAmountInput.value;
                    console.log("Funding with ".concat(ethAmount, "..."));
                    if (!(typeof window.ethereum !== "undefined")) return [3 /*break*/, 5];
                    walletClient = (0, viem_1.createWalletClient)({
                        transport: (0, viem_1.custom)(window.ethereum)
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()]; // requestAddresses is a viem method that returns user's addresses, it returns a promise
                case 1:
                    connectedAccount = (_a.sent()) // requestAddresses is a viem method that returns user's addresses, it returns a promise
                    [0];
                    return [4 /*yield*/, getCurrentChain(walletClient)];
                case 2:
                    currentChain = _a.sent();
                    publicClient = (0, viem_1.createPublicClient)({
                        transport: (0, viem_1.custom)(window.ethereum)
                    });
                    return [4 /*yield*/, publicClient.simulateContract({
                            address: constants_ts_js_1.contractAddress,
                            abi: constants_ts_js_1.abi, // shorthand for abi: abi, // abi is the interface of the smart contract, it tells us how to interact with the smart contract
                            functionName: "fund",
                            account: connectedAccount,
                            // viem doen't currently support the RPC URL or custom chain that we create, so we need to explicitely pass the chain
                            chain: currentChain,
                            value: (0, viem_1.parseEther)(ethAmount), // parseEther is a viem method that converts ether to wei, it returns a promise
                        })];
                case 3:
                    request = (_a.sent()).request;
                    return [4 /*yield*/, walletClient.writeContract(request)]; // writeContract is a viem method that writes to the contract, it returns a promise
                case 4:
                    hash = _a.sent() // writeContract is a viem method that writes to the contract, it returns a promise
                    ;
                    console.log("Transaction hash: ".concat(hash));
                    return [3 /*break*/, 6];
                case 5:
                    connectButton.innerText = "Please install MetaMask!";
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getCurrentChain(client) {
    return __awaiter(this, void 0, void 0, function () {
        var chainId, currentChain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.getChainId()];
                case 1:
                    chainId = _a.sent();
                    currentChain = (0, viem_1.defineChain)({
                        id: chainId,
                        name: "CustomChain",
                        nativeCurrency: {
                            name: "Ether",
                            symbol: "ETH",
                            decimals: 18
                        },
                        rpcUrls: {
                            default: {
                                http: ["http://localhost:8545"]
                            }
                        },
                    });
                    return [2 /*return*/, currentChain];
            }
        });
    });
}
function getbalance() {
    return __awaiter(this, void 0, void 0, function () {
        var balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof window.ethereum !== "undefined")) return [3 /*break*/, 2];
                    publicClient = (0, viem_1.createPublicClient)({
                        transport: (0, viem_1.custom)(window.ethereum)
                    });
                    return [4 /*yield*/, publicClient.getBalance({
                            address: constants_ts_js_1.contractAddress
                        })];
                case 1:
                    balance = _a.sent();
                    console.log((0, viem_1.formatEther)(balance)); // formatEther is a viem method that converts wei to ether, it returns a promise
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function withdraw() {
    return __awaiter(this, void 0, void 0, function () {
        var connectedAccount, currentChain, request, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Withdrawing funds...");
                    if (!(typeof window.ethereum !== "undefined")) return [3 /*break*/, 5];
                    walletClient = (0, viem_1.createWalletClient)({
                        transport: (0, viem_1.custom)(window.ethereum)
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()]; // requestAddresses is a viem method that returns user's addresses, it returns a promise
                case 1:
                    connectedAccount = (_a.sent()) // requestAddresses is a viem method that returns user's addresses, it returns a promise
                    [0];
                    return [4 /*yield*/, getCurrentChain(walletClient)];
                case 2:
                    currentChain = _a.sent();
                    publicClient = (0, viem_1.createPublicClient)({
                        transport: (0, viem_1.custom)(window.ethereum)
                    });
                    return [4 /*yield*/, publicClient.simulateContract({
                            account: connectedAccount,
                            address: constants_ts_js_1.contractAddress,
                            abi: constants_ts_js_1.abi, // shorthand for abi: abi, // abi is the interface of the smart contract, it tells us how to interact with the smart contract
                            functionName: "withdraw",
                            // viem doen't currently support the RPC URL or custom chain that we create, so we need to explicitely pass the chain
                            chain: currentChain,
                            // value: parseEther("0") // Its ok that we wrote this, but we don't need it here because we are not sending any ether with the withdraw function
                        })];
                case 3:
                    request = (_a.sent()).request;
                    console.log("Simulation result:", request);
                    return [4 /*yield*/, walletClient.writeContract(request)]; // writeContract is a viem method that writes to the contract, it returns a promise
                case 4:
                    hash = _a.sent() // writeContract is a viem method that writes to the contract, it returns a promise
                    ;
                    console.log("Withdraw transaction hash:", hash);
                    return [3 /*break*/, 6];
                case 5:
                    connectButton.innerText = "Please install MetaMask!";
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getbalance;
withdrawButton.onclick = withdraw;
