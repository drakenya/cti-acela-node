import {createClient} from "redis";

export const LOCK_KEY_ACELA_TO_NETWORK = 'lock.acela-to_network';

export type RedisClientType = ReturnType<typeof createClient>;

export const redis = async (): Promise<RedisClientType> => {
    return await createClient({url: 'redis://redis'});
}