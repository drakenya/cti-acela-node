import {rabbit, rabbitPublisher, PublishFn, QUEUE_ACELA_TO_NETWORK} from "../connection/rabbit";
import {factoryCreateCommand} from "./messages";

async function asyncConsumeMessage(publish: PublishFn) {
    const opCode = parseInt(process.argv[2]);
    const data = process.argv[3] ? parseInt(process.argv[3]) : null;
    const command = factoryCreateCommand(opCode, data);

    console.log('Sending message to queue:', command);
    await publish(QUEUE_ACELA_TO_NETWORK, JSON.stringify(command));
};

async function main () {
    const r = await rabbit();
    await asyncConsumeMessage(rabbitPublisher(r));

    await r.channel.close();
    await r.connection.close();
};

if (require.main === module) {
    main().catch(console.error);
};