const Hapi = require('@hapi/hapi');
const routes = require('./routes');

process.stdout.write("Starting Bookshelf API.");
for (let i=0; i<3; ++i) { process.stdout.write("."); }

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    server.route(routes);
    await server.start();
    console.log(` URI: ${server.info.uri}`);
};
console.log("Bookshelf API is running!!!");
init();