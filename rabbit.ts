import { connect, Connection, Channel } from 'amqplib';

export const QUEUE_ACELA_TO_NETWORK = 'acela.to_network';
export const QUEUE_ACELA_FROM_NETWORK = 'acela.from_network';

export interface PublishFn<T = any> {
    (event: string, data: any): Promise<T>
};

export interface RabbitConnection {
    connection: Connection,
    channel: Channel,
};

export const rabbit = async (): Promise<RabbitConnection> => {
    const connection = await connect('amqp://rabbit');
    const channel = await connection.createChannel();

    return {
        connection, channel,
    };
};

export const rabbitPublisher = (conn: RabbitConnection):  PublishFn<void> => async (event: string, data: any) => {
    await conn.channel.assertQueue(event, {
        durable: false,
    });

    conn.channel.sendToQueue(event, Buffer.from(JSON.stringify(data)));
}
