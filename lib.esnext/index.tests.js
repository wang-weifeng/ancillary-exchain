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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.equals = void 0;
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const ethers_1 = require("ethers");
const _1 = require(".");
const Tests = {
    // Blocks should only be tested after 1121818, per Telegram discussion
    Blocks: [
        {
            hash: '0x19e5ebcc8d2c1ca40c04ee74164616ebd1d099a69820f83d206d5a5d2f38941e',
            parentHash: '0x24fd17014507aaad94a89688bae98860ef5f022c73d1c5f6c7820f10573ed45f',
            number: 5150897,
            timestamp: 1629226634,
            nonce: '0x0000000000000000',
            difficulty: 0,
            gasLimit: ethers_1.BigNumber.from("0xffffffff"),
            gasUsed: ethers_1.BigNumber.from("0x00"),
            miner: '0x7a503503558C8281B3d00455dDb3497b958F23da',
            extraData: '0x',
            transactions: []
        }
    ],
    Transactions: [
        {
            hash: '0x569390a6ea347950ca460ea1f70e8fa79b01ec37615ef4c709c1bbd9e3ee3fc1',
            type: 0,
            accessList: null,
            blockHash: '0x34a360f9eec4a394cc4a0bb43dd13ff747a709b3384be317e9b69366c49d1dae',
            blockNumber: 5150948,
            transactionIndex: 0,
            from: '0x8522395fdca22e59b6F8d0bA2579ACd5877f50b7',
            gasPrice: ethers_1.BigNumber.from("0x05f5e100"),
            gasLimit: ethers_1.BigNumber.from('0x7b0c'),
            to: '0x8522395fdca22e59b6F8d0bA2579ACd5877f50b7',
            value: ethers_1.BigNumber.from('0x01'),
            nonce: 4,
            data: '0x',
            r: '0x92be234a54bc1300f0fd8698e1e916857c4a05894625c82f6ca3f15999de8050',
            s: '0x5a441e023331b8d2763c4e5f93700b84b3cf7af6e4f96e72db50c0cb4e0ec5e1',
            v: 165,
            creates: null,
            chainId: 65,
        }
    ],
    TransactionReceipts: [
        {
            to: '0x8522395fdca22e59b6F8d0bA2579ACd5877f50b7',
            from: '0x8522395fdca22e59b6F8d0bA2579ACd5877f50b7',
            contractAddress: null,
            transactionIndex: 0,
            gasUsed: ethers_1.BigNumber.from('0x5208'),
            logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            blockHash: '0x34a360f9eec4a394cc4a0bb43dd13ff747a709b3384be317e9b69366c49d1dae',
            transactionHash: '0x569390a6ea347950ca460ea1f70e8fa79b01ec37615ef4c709c1bbd9e3ee3fc1',
            logs: [],
            blockNumber: 5150948,
            cumulativeGasUsed: ethers_1.BigNumber.from('0x5208'),
            status: 1,
            type: 0,
            byzantium: true
        }
    ],
};
function _equals(path, actual, expected) {
    if (expected === null) {
        assert_1.default.equal(actual, expected, `expected null: ${path}!null`);
    }
    else if (ethers_1.BigNumber.isBigNumber(expected)) {
        assert_1.default.ok(ethers_1.BigNumber.isBigNumber(actual), `expected BigNumber instance: ${path}!BigNumber`);
        assert_1.default.ok(expected.eq(actual), `BigNumber not equal: ${path}!a.eq(e)`);
    }
    else if (typeof (expected) === "object") {
        assert_1.default.ok(typeof (actual) === "object", `expected object: ${path}!object`);
        for (const key in expected) {
            _equals(`${path}@${key}/`, actual[key], expected[key]);
        }
    }
    else if (Array.isArray(expected)) {
        assert_1.default.ok(Array.isArray(actual), `expected an array: ${path}!array`);
        assert_1.default.equal(expected.length, actual.length, `array length mismatch: ${path}a.length!=e.length`);
        expected.forEach((item, index) => {
            _equals(`${path}#${index}/`, actual[index], expected[index]);
        });
    }
    else {
        assert_1.default.equal(actual, expected, `not equal: ${path}a!=b`);
    }
}
function equals(actual, expected) {
    _equals("/", actual, expected);
    return true;
}
exports.equals = equals;
describe("Test BscscanProvider JsonRpcProvider", function () {
    const provider = new _1.JsonRpcProvider("https:/\/exchaintestrpc.okex.org");
    // A secret we can use in our testcases for wallets and such
    const secret = (function () {
        try {
            return JSON.parse(fs_1.default.readFileSync(path_1.resolve(__dirname, "../env.json")).toString()).secret;
        }
        catch (error) {
            console.log("No secret", error);
        }
        return null;
    })();
    if (secret) {
        it("Sends a transaction", function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(60000);
                const wallet = new ethers_1.ethers.Wallet(secret, provider);
                console.log("Wallet:", wallet.address);
                const tx = yield wallet.sendTransaction({ to: wallet.address, value: 1 });
                //console.log(tx);
                yield tx.wait();
            });
        });
    }
    Tests.Blocks.forEach((test) => {
        it(`fetches block #${test.number}`, function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(60000);
                const block = yield provider.getBlock(test.number);
                //console.log("BLOCK", block);
                equals(block, test);
            });
        });
    });
    Tests.Transactions.forEach((test) => {
        it(`fetches transaction: ${test.hash.substring(0, 10)}`, function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(60000);
                const tx = yield provider.getTransaction(test.hash);
                console.log("TX", tx);
                assert_1.default.ok(typeof (tx.confirmations) === "number", "missing confirmations");
                equals(tx, test);
            });
        });
    });
    Tests.TransactionReceipts.forEach((test) => {
        it(`fetches transaction Receipt: ${test.transactionHash.substring(0, 10)}`, function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(60000);
                const receipt = yield provider.getTransactionReceipt(test.transactionHash);
                //console.log("REC", receipt);
                assert_1.default.ok(typeof (receipt.confirmations) === "number", "missing confirmations");
                equals(receipt, test);
            });
        });
    });
});
describe("Test BscscanProvider WebSocketProvider", function () {
    const provider = new _1.WebSocketProvider('wss:/\/exchaintestws.okex.org:8443');
    // A secret we can use in our testcases for wallets and such
    const secret = (function () {
        try {
            return JSON.parse(fs_1.default.readFileSync(path_1.resolve(__dirname, "../env.json")).toString()).secret;
        }
        catch (error) {
            console.log("No secret", error);
        }
        return null;
    })();
    if (secret) {
        it("Sends a transaction WebSocketProvider", function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(60000);
                const wallet = new ethers_1.ethers.Wallet(secret, provider);
                console.log("Wallet:", wallet.address);
                const tx = yield wallet.sendTransaction({ to: wallet.address, value: 1 });
                //console.log(tx);
                yield tx.wait();
            });
        });
    }
    Tests.Blocks.forEach((test) => {
        it(`fetches block #${test.number} WebSocketProvider`, function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(60000);
                const block = yield provider.getBlock(test.number);
                //console.log("BLOCK", block);
                equals(block, test);
            });
        });
    });
    Tests.Transactions.forEach((test) => {
        it(`WebSocketProvider fetches transaction: ${test.hash.substring(0, 10)}`, function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(60000);
                const tx = yield provider.getTransaction(test.hash);
                console.log("TX", tx);
                assert_1.default.ok(typeof (tx.confirmations) === "number", "missing confirmations");
                equals(tx, test);
            });
        });
    });
    Tests.TransactionReceipts.forEach((test) => {
        it(`WebSocketProvider fetches transaction Receipt: ${test.transactionHash.substring(0, 10)}`, function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(60000);
                const receipt = yield provider.getTransactionReceipt(test.transactionHash);
                //console.log("REC", receipt);
                assert_1.default.ok(typeof (receipt.confirmations) === "number", "missing confirmations");
                equals(receipt, test);
            });
        });
    });
});
//# sourceMappingURL=index.tests.js.map