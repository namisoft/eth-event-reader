/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 5/17/19
 * Time: 10:19 AM
 */
/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 5/17/19
 * Time: 10:47 AM
 */
import Web3 from "web3";
export declare class EventData {
    readonly returnValues: any;
    readonly event: string;
    readonly signature: string;
    readonly txHash: string;
    readonly address: string;
    readonly block: number;
    constructor(returnValues: any, event: string, signature: string, txHash: string, address: string, block: number);
}
export interface EventHandlingResult {
    readonly block: number;
    readonly address: string;
    readonly txHash: string;
    readonly result?: any;
    readonly error?: any;
}
export declare type EventHandler = (data: EventData) => Promise<any>;
export declare class EventReader {
    private _web3;
    constructor(web3Provider: string);
    readonly web3: Web3 | undefined;
    read(contractAddress: string, contractAbi: any, eventName: string, handler: EventHandler, fromBlock?: number, toBlock?: number): Promise<EventHandlingResult[]>;
}
