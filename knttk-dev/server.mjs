import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

import fs from 'fs'
import path from 'path'

import {Server} from 'socket.io'
import {createServer} from 'node:http'
import express from 'express'

import { fileURLToPath } from 'url';
import bodyParser from 'body-parser'
import {Router} from 'express'

import session from 'express-session'
import 'localstorage-polyfill'

import request from 'request'
import { channel } from 'diagnostics_channel'
import { url } from 'node:inspector'


// >> Server
const __dirname = path.dirname(fileURLToPath(import.meta.url));


// const dbPromise = open({
//     filename: "data.db",
//     driver: sqlite3.Database
// })


const app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: 'n4m35P4C3#key#xc08FG1',
  resave: false,
  saveUninitialized: false
}))

app.set('view engine', 'ejs');

const urlencodedParser = bodyParser.urlencoded({
    extended: false,
});

const server = createServer(app)
const router = Router()
const io = new Server(server)


app.get('/', urlencodedParser, async(req, res) => {

    res.render('main')


})

app.get('/auth', urlencodedParser, async(req, res) => {
    res.render('auth-login')
})


const setup = async () => {
    // const db = await dbPromise;
    // await db.migrate();
    server.listen(5173, () => {
        console.log('Listening on port 5173...')
    })

}


setup()