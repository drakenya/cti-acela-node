import {RabbitConnection} from "../rabbit";
import {factoryCreateCommand} from "./messages";

export const consumeToAcelaNetwork = (rabbit: RabbitConnection) => (msg: any) => {
    const data = JSON.parse(JSON.parse(msg.content.toString()));
    const message = factoryCreateCommand(data.opCode, data.data);

    console.log('Sending message to Acela network:', message, '0x'+message.getCommandValue().toString(16));

    rabbit.channel.ack(msg);
}