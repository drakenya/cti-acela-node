import { rabbit, RabbitConnection } from "./rabbit";
import { ConsumeMessage } from 'amqplib';

const consumeTest = (rabbit: RabbitConnection) => (msg: any) => {
    const data: any = JSON.parse(JSON.parse(msg.content.toString()));

    console.log(data);

    rabbit.channel.ack(msg);
}

const worker = async (rabbit: RabbitConnection) => {
    await rabbit.channel.assertQueue('test', {
        durable: false,
    });

    rabbit.channel.consume('test', consumeTest(rabbit));
}

const main = async () => {
    const r = await rabbit();
    await worker(r);
}

if (require.main === module) {
    main().then(console.log).catch(console.error);
}