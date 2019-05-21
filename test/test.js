/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 5/17/19
 * Time: 2:39 PM
 */


'use strict';

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

const eventReader = require('../dist');

describe('EventReader test', () => {
    /**
     * Contract 'ExchangeRates' has been deployed on Rinkeby network at address 0x49bb5e1f298bf1177bf1189ced15c8619478e475 for testing.
     * (https://rinkeby.etherscan.io/address/0xcb54c756fd0c151aca1b2bff2c773175620e933a)
     * We have two events named 'SetRate' raised at block 4412859 and 4413161 for this test
     */
    const contractAbi = require('./contracts/ExchangeRates.json').abi;
    const contractAddress = '0x49bb5e1f298bf1177bf1189ced15c8619478e475';

    // My testing infura project endpoint to access Rinkeby network
    const web3Provider = 'https://rinkeby.infura.io/v3/b3b525e45cc443988517e68d986d4df3';

    // Create a EventReader instance
    const reader = new eventReader.EventReader(web3Provider);

    describe('Test read function', () => {
        it('returns right data', async () => {
            const ret = await reader.read(contractAddress, contractAbi, "SetRate", function (data) {
                return new Promise(((resolve, reject) => {
                    if (data.returnValues.ccy1 === 'VND' || data.returnValues.ccy2 === 'VND') {
                        resolve({
                            ccy1: data.returnValues.ccy1,
                            ccy2: data.returnValues.ccy2
                        });
                    }
                    else {
                        reject('Non-VND pair: skip!');
                    }
                }))
            });
            expect(ret.length).to.equal(2);
            expect(ret[0]).to.be.deep.equal({
                block: 4412859,
                address: '0x49bb5e1f298bf1177bf1189ced15c8619478e475',
                txHash: '0x1e5e3b582d804a85bfa1abb3e1efea224a25b1bc85d5ec51bbf297854c0486c0',
                result: {
                    ccy1: 'USD',
                    ccy2: 'VND'
                }
            });
            expect(ret[1]).to.be.deep.equal({
                block: 4413161,
                address: '0x49bb5e1f298bf1177bf1189ced15c8619478e475',
                txHash: '0xef85cf3b62df879082862698eb2cc043d2fd2ff786b5e8ec68bb0e8b84d5a92f',
                error: 'Non-VND pair: skip!'
            });
        });

        it('pass invalid contract address param: promise must reject', async () => {
            // Pass '0x00' as the contract address
            await expect(reader.read('0x00', contractAbi, "SetRate", function (data) {
                return new Promise(((resolve, reject) => {
                    resolve('Ok');
                }))
            })).to.be.rejected;
        });

        it('fromBlock check', async () =>{
            const ret = await reader.read(contractAddress, contractAbi, "SetRate", function (data) {
                return new Promise(((resolve, reject) => {
                    resolve('Ok');
                }))
            }, 4412860);
            expect(ret.length).to.equal(1);
        });

        it('toBlock check', async () =>{
            const ret = await reader.read(contractAddress, contractAbi, "SetRate", function (data) {
                return new Promise(((resolve, reject) => {
                    resolve('Ok');
                }))
            }, null, 4412859);
            expect(ret.length).to.equal(1);
        });

        it('fromBlock and toBlock check', async () =>{
            const ret = await reader.read(contractAddress, contractAbi, "SetRate", function (data) {
                return new Promise(((resolve, reject) => {
                    resolve('Ok');
                }))
            }, 4412860, 4413160);
            expect(ret.length).to.equal(0);
        });


    });
});