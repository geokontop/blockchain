
const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();
console.log(bitcoin);

const previousBlockHash = 'yyyyyyyyyy';
const currentBlockData = [
    {
        amount: 33,
        sender: 'eee',
        recipient: 'www'
    },
    {
        amount: 335,
        sender: 'iii',
        recipient: 'ppp'
    },
    {
        amount: 3388,
        sender: 'uyu',
        recipient: 'ooo'
    }
];
const nonce = 100;


const pow = bitcoin.proofOfWork(previousBlockHash,currentBlockData);

console.log(bitcoin.hashBlock(previousBlockHash,currentBlockData,pow));
// bitcoin.createNewBlock(3267,'UYUUUYFUF','AAAAUUYFUF');
// bitcoin.createNewBlock(3877,'AAAAUUYFUF','BBBBUYFUF');
// bitcoin.createNewBlock(8967,'BBBBUYFUF','OUIUOUOU');
// const te = bitcoin.createNewTransaction(343,'ABCD','EFG');

// console.log(bitcoin);

// bitcoin.createNewBlock(77676,'OOOOOO','KKKKKKK');

// console.log(bitcoin);
// console.log(bitcoin.chain[3].transactions);
