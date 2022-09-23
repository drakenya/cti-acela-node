import { rabbit, rabbitPublisher, PublishFn } from "./rabbit";

async function asyncTest(publish: PublishFn) {
    console.log('testing here');
    console.log(process.argv.slice(2));

    for await (const value of process.argv.slice(2)) {
        await publish('test', JSON.stringify(value));
    }
    // for (const value of process.argv.slice(2)) {
    //     await publish('test', JSON.stringify(value));
    // }
    // process.argv.slice(2).forEach((value: string) => {
    //     publish('test', JSON.stringify(value));
    // });
    console.log('me me');
};

async function main () {
    console.log('yes');

    const r = await rabbit();
    const pub = rabbitPublisher(r);

    await asyncTest(rabbitPublisher(r));

    await r.channel.close();
    await r.connection.close();
    
};

if (require.main === module) {
    main();
    console.log('hi');
};