const {MongoClient, ServerApiVersion} = require('mongodb');
const env = require("dotenv")

env.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gwokf.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`;
let _db;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const mongoConnect = (callback) => {
    client
        .connect()
        .then(client => {
            _db = client.db();
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    } else {
        throw new Error('Database not found');
    }

}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;