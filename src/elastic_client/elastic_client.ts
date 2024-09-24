import { Client } from 'es7';
import * as dotenv from "dotenv";
const util = require('util');

dotenv.config();

const client = new Client({
  node: process.env.ES_URL,
  auth: {
    username: process.env.ES_USERNAME || '',
    password: process.env.ES_PASSWORD || ''
  }
});

client.search({
    index: '*events_teams_cqd_legs*',
    body: {
        query: {
            match_all: {}
        }
    }
}, (err, result) => {
    if (err) console.log(err)
    else{
        console.log(util.inspect(result.body.hits, {showHidden: false, depth: null, colors: true}))
    }
});