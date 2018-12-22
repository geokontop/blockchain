
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const bc1 ={
    "chain": [
        {
            "index": 1,
            "timestamp": 1545160085175,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1545161056334,
            "transactions": [
                {
                    "amount": 5,
                    "sender": "some sender",
                    "recipient": "some recipient",
                    "transactionId": "5bf5413002fa11e984c497004c3bd26f"
                },
                {
                    "amount": 15,
                    "sender": "some sender",
                    "recipient": "some recipient",
                    "transactionId": "6b4e8ba002fa11e984c497004c3bd26f"
                },
                {
                    "amount": 25,
                    "sender": "some sender",
                    "recipient": "some recipient",
                    "transactionId": "6fe503b002fa11e984c497004c3bd26f"
                },
                {
                    "amount": 35,
                    "sender": "some sender",
                    "recipient": "some recipient",
                    "transactionId": "73fde75002fa11e984c497004c3bd26f"
                },
                {
                    "amount": 45,
                    "sender": "some sender",
                    "recipient": "some recipient",
                    "transactionId": "78276cc002fa11e984c497004c3bd26f"
                }
            ],
            "nonce": 184330,
            "hash": "0000bc3a4584994a4a15c04a57a9d512612ea5b656c90b00abb2c3e6339836ba",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1545161098283,
            "transactions": [
                {
                    "amount": 4,
                    "sender": "some sender",
                    "recipient": "some recipient",
                    "transactionId": "901cd90002fa11e984c497004c3bd26f"
                },
                {
                    "amount": 14,
                    "sender": "some sender",
                    "recipient": "some recipient",
                    "transactionId": "9398924002fa11e984c497004c3bd26f"
                },
                {
                    "amount": 24,
                    "sender": "some sender",
                    "recipient": "some recipient",
                    "transactionId": "974c4b7002fa11e984c497004c3bd26f"
                }
            ],
            "nonce": 11379,
            "hash": "0000e2db4cd40b72fa06f2551dee1fc534c063edce5961286215d9d1a222cd35",
            "previousBlockHash": "0000bc3a4584994a4a15c04a57a9d512612ea5b656c90b00abb2c3e6339836ba"
        }
    ],
    "pendingTransactions": [],
    "currentNodeUrl": "localhost:3001",
    "networkNodes": []
}

console.log('VALID:', bitcoin.chainIsValid(bc1.chain));
