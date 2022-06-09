const knex = require('../../knex/knex');

function prepareDb1() {
    let tasks = [];
    // migrate
    tasks.push(knex.migrate.latest().then(() => { console.log(' ... 1. db migrates - done!') }));

    return tasks;
};

function prepareDb2(tables) {
    let tasks = [];
    // truncate 
    tables.forEach((table) => {
        tasks.push(knex(table).truncate().then(() => { console.log(' ... 2. truncate: ' + table) }));
    });

    return tasks;
};

function prepareDb3() {
    let tasks = [];
    // seed 
    tasks.push(knex.seed.run().then(() => { console.log(' ... 3. db seed - done!') }));

    return tasks;
};

function beforeAll(tables) {
    return Promise.all(prepareDb1()).then(() => {
        // return Promise.all(prepareDb2(tables)).then(() => {
        return Promise.all(prepareDb3());
        // });
    })
};
exports.beforeAll = beforeAll;
