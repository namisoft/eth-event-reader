"use strict";
/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 5/17/19
 * Time: 10:19 AM
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 5/17/19
 * Time: 10:47 AM
 */
const web3_1 = __importDefault(require("web3"));
class EventData {
    constructor(returnValues, event, signature, txHash, address, block) {
        this.returnValues = returnValues;
        this.event = event;
        this.signature = signature;
        this.txHash = txHash;
        this.address = address;
        this.block = block;
    }
}
exports.EventData = EventData;
class EventReader {
    constructor(web3Provider) {
        this._web3 = undefined;
        this._web3 = new web3_1.default(web3Provider);
    }
    get web3() {
        return this._web3;
    }
    read(contractAddress, contractAbi, eventName, handler, fromBlock, toBlock) {
        return new Promise((resolve, reject) => {
            if (this._web3 === undefined) {
                reject("Web3 provider unset!");
            }
            else {
                // Get contract instance
                const contract = new this._web3.eth.Contract(contractAbi, contractAddress, {
                    from: '',
                    gasPrice: this._web3.defaultGasPrice,
                    gas: this._web3.defaultGas,
                    data: ""
                });
                contract.getPastEvents('allEvents', {
                    fromBlock: fromBlock ? fromBlock : 0,
                    toBlock: toBlock ? toBlock : 'latest'
                }).then(events => {
                    let handlingPromises = [];
                    for (let evt of events) {
                        if (evt.event === eventName) {
                            handlingPromises.push(handler(new EventData(evt.returnValues, eventName, evt.signature.toLocaleLowerCase(), evt.transactionHash.toLowerCase(), evt.address.toLocaleLowerCase(), evt.blockNumber)).then(v => ({
                                block: evt.blockNumber,
                                address: evt.address.toLocaleLowerCase(),
                                txHash: evt.transactionHash.toLocaleLowerCase(),
                                result: v
                            }))
                                .catch(err => ({
                                block: evt.blockNumber,
                                address: evt.address.toLocaleLowerCase(),
                                txHash: evt.transactionHash.toLocaleLowerCase(),
                                error: err
                            })));
                        }
                    }
                    Promise.all(handlingPromises.values()).then((handlingResults) => {
                        // Promise return
                        resolve(handlingResults);
                    }).catch((err) => {
                        reject(`Error in promises union: ${err.toString()}`);
                    });
                }).catch((err) => {
                    reject(`Error in calling contract.getPastEvents('${eventName}'): ${err.toString()}`);
                });
            }
        });
    }
}
exports.EventReader = EventReader;
