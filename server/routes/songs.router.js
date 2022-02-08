const express = require('express');
const router = express.Router();

// Connect to PG
const pg = require('pg');

// For talking to the database
const Pool = pg.Pool;

// An instance of a new 'Pool' that will be used in connecting with the database
const pool = new Pool({
    database: 'music_library', // The name of the database
    host: 'Localhost', // Where our database is
    port: 5432, // Port number for database
    max: 10, // The max amount of connections (queries) you can have at one time
    idleTimeoutMillis: 30000 // 30 seconds to try to connect, then cancel query
});

// is not required, but useful for debugging
pool.on('connect', () => {
    console.log('PostgreSQL is connected!');
});
// The pool will emit an error on behalf of any idle clients
// Will be on the terminal
pool.on('error', (error) => {
    console.log('Error with PostgreSQL:', error);
});

let songs = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    // res.send(songs);
    // Check SQL query text in postico first!
    let queryText = 'SELECT * FROM "songs";';
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows)
        })
        .catch((err) => {
            console.log('Error making query', queryText, err);
            res.sendStatus(500);
        });
});

router.post('/', (req, res) => {
    songs.push(req.body);
    res.sendStatus(200);
});

module.exports = router;