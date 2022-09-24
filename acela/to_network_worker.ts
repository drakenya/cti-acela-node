import {QUEUE_ACELA_TO_NETWORK, rabbit, RabbitConnection} from "../connection/rabbit";
import {consumeToAcelaNetwork} from "./to_network_consumer";
import {createClient} from "redis";
import {redis, RedisClientType} from "../connection/redis";

const toNetworkWorker = async (rabbit: RabbitConnection, redis: RedisClientType) => {
    await redis.connect();

    await rabbit.channel.assertQueue(QUEUE_ACELA_TO_NETWORK, {
        durable: false,
    });
    await rabbit.channel.prefetch(1);

    await rabbit.channel.consume(QUEUE_ACELA_TO_NETWORK, consumeToAcelaNetwork(rabbit, redis));
}

const main = async () => {
    const rabbitConnection = await rabbit();
    const redisConnection = await redis();

    await toNetworkWorker(rabbitConnection, redisConnection);
};

if (require.main === module) {
    main().catch(console.error);
}