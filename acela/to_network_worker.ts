import {QUEUE_ACELA_TO_NETWORK, rabbit, RabbitConnection} from "../rabbit";
import {consumeToAcelaNetwork} from "./to_network_consumer";

const toNetworkWorker = async (rabbit: RabbitConnection) => {
    await rabbit.channel.assertQueue(QUEUE_ACELA_TO_NETWORK, {
        durable: false,
    });

    await rabbit.channel.consume(QUEUE_ACELA_TO_NETWORK, consumeToAcelaNetwork(rabbit));
}

const main = async () => {
    const r = await rabbit();
    await toNetworkWorker(r);
};

if (require.main === module) {
    main().catch(console.error);
}