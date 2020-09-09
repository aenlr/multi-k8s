const keys = require('./keys');

// Express App setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres setup
const { Pool } = require('pg');
const pgClient = new Pool({
    ...keys.pg    
});

pgClient.on('error', () => {
    console.error('Lost postgres connection');
});

pgClient.query('CREATE TABLE IF NOT EXISTS vals (num INT)')
    .catch(err => console.error('Error creating vals table:', err));

// Redis setup
const redis = require('redis');
const redisClient = redis.createClient({
    ...keys.redis,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// Express Route handlers
app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT num FROM vals');
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send(values);
        }
    });
});

app.post('/values', async (req, res) => {
    const { index } = req.body;
    if (index > 40 || index < 0) {
        res.status(422).send('Refusing to compute fib(' + index + ')');
    } else {
        redisClient.hset('values', index, 'Nothing yet!');
        redisPublisher.publish('insert', index);
        pgClient.query('INSERT INTO vals(num) VALUES($1)', [index]);
        res.send({ working: true });
    }
});

app.listen(5000, err => {
    console.log('Listening on port 5000');
});

