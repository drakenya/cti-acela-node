import {RabbitConnection} from "../connection/rabbit";
import {factoryCreateCommand} from "./messages";
import {LOCK_KEY_ACELA_TO_NETWORK, RedisClientType} from "../connection/redis";

const delay = (time: number) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

const MAX_WAITING_TIME = 2000; // 2 seconds
const WAIT_TIME = 50; // 50ms

export const consumeToAcelaNetwork = (rabbit: RabbitConnection, redis: RedisClientType) => async (msg: any) => {
    const data = JSON.parse(JSON.parse(msg.content.toString()));
    const message = factoryCreateCommand(data.opCode, data.data);

    console.log(`Sending message to Acela network: 0x${message.getCommandValue().toString(16)}`, message);
    await redis.set(LOCK_KEY_ACELA_TO_NETWORK, message.getCommandValue());

    let totalWaitTime = 0;
    while (await redis.get(LOCK_KEY_ACELA_TO_NETWORK) && totalWaitTime <= MAX_WAITING_TIME) {
        totalWaitTime += WAIT_TIME;
        await delay(WAIT_TIME);
    }

    rabbit.channel.ack(msg);
}