`use strict`;

const {init, start} = require('./server');

const run = async () => {
    const server = await init();
    start(server);
};

run();