/*
 * Handlers overview
 * 
 */


// Dependencies
const http = require('http')
const helpers = require('../services/helpers')
const fs = require('fs')
const path = require('path')
const Blockchain = require('../blockchain');
const currentUrl = process.argv[3];

// const rp = require('request-promise');

const bitcoin = new Blockchain();
// Define the handlers
const handlers = {};

/* 
 * HTML handlers
 * 
 */

// Index handler
handlers.index = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        console.log(__dirname)
        const templatesDir = path.join(__dirname ,'/../block-explorer/');
        console.log(templatesDir)
        fs.readFile(templatesDir + 'index.html','utf8',(err,str)=>{
            if(!err && str && str.length> 0){
                callback(200,str,'html');
            }else{
                callback(501,undefined, 'html');
            }
        });
    }else{
        callback(502,undefined, 'html')
    }      
}

// Favicon
handlers.favicon = (data,callback)=>{
    // Reject any request that isn't a GET
    if(data.method){
        // Read the favicon's data
        helpers.getStaticAsset('favicon.ico',(err,data)=>{
            if(!err && data){
                callback(200, data,'favicon');
            }else{
                callback(500);
            }
        })
    }else{
        callback(495);
    }
}

// Public assets
handlers.public = (data,callback)=>{
    // Reject any request that isn't a GET
    if(data.method){
        // Get the filename been requested
        const trimmedAssetName = data.trimmedPath.replace('public/','').trim();
        if(trimmedAssetName.length > 0){
            // Read the asset's data
            helpers.getStaticAsset(trimmedAssetName,(err,data)=>{
                if(!err && data){
                    // Determine the content type (default to plain text)
                    let contentType = 'plain';

                    if(trimmedAssetName.indexOf('.css') > -1){
                        contentType = 'css';
                    }

                    if(trimmedAssetName.indexOf('.png') > -1){
                        contentType = 'png';
                    }

                    if(trimmedAssetName.indexOf('.jpg') > -1){
                        contentType = 'jpg';
                    }

                    if(trimmedAssetName.indexOf('.ico') > -1){
                        contentType = 'favicon';
                    }

                    // Callback the data
                    callback(200, data, contentType)
                }
            })
        }
    }else{
        callback(995);
    }
}

/* 
 * JSON API handlers
 * 
 */

/*--------- consensus -----------*/
// consensus handler
handlers.consensus =function(data, callback){
    const acceptableMethods = ['get'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._consensus[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._consensus ={};
// consensus submethods
handlers._consensus.get = function(data,callback){
    // Create a new transaction
        let newLongestChain = false;
        let i = 0;
        let chains = [];
    bitcoin.networkNodes.forEach(nodeUrl => {
        const uri = "http://" + nodeUrl + '/api/blockchain';
        const req = http.get(uri,(res)=>{
            i++;
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                const parsedData = JSON.parse(rawData);
                chains.push(parsedData.chain);
                if (i==bitcoin.networkNodes.length) {
                    chains.forEach(chain =>{
                        if (chain.length > bitcoin.chain.length){
                            bitcoin.chain = chain;
                            newLongestChain = true;
                            console.log('chain is updated');
                        }
                    });
                    if(newLongestChain){
                        callback(201,{'note':'new longer chain'});
                    } else{
                        callback(200,{'note':'chain is fine'});
                    }
                }
                } catch (e) {
                console.error(e.message);
                }
            });
        })
    });
    
};
   

/*--------- address -----------*/
// address handler
handlers.address =function(data, callback){
    const acceptableMethods = ['get'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._address[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._address ={};
// address submethods
handlers._address.get = function(data,callback){
    // Get the address 
    const address = data.queryStringObject.address;

    const res = bitcoin.getAddressData(address);
    if(res.addressTransactions){
        console.log(res);
        callback(200, res);
    }else{
        callback(404, {note:'The address has no transactions'});
    }
};
   

/*--------- block -----------*/
// block handler
handlers.block =function(data, callback){
    const acceptableMethods = ['get'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._block[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._block ={};
// block submethods
handlers._block.get = function(data,callback){
    // Get the block hash
    const blockHash = data.queryStringObject.hash;

    const block = bitcoin.getBlock(blockHash);
    if(block){
        console.log(block);
        callback(200, block);
    }else{
        callback(404, {'note':'Such a block does not exist'});
    }
};
   

/*--------- transaction_broadcast -----------*/
// transaction_broadcast handler
handlers.transaction_broadcast =function(data, callback){
    const acceptableMethods = ['post'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._transaction_broadcast[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._transaction_broadcast ={};
// transaction_broadcast submethods
handlers._transaction_broadcast.post = function(data,callback){
    // Create a new transaction
    const newTransaction = bitcoin.createNewTransaction(data.payload.amount, data.payload.sender, data.payload.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);
    const post_data = JSON.stringify({
        newTransaction: newTransaction
    });
    // Breadcast new transaction
    bitcoin.networkNodes.forEach(node=>{
        const requestOptions = {
            host : node.split(':')[0],
            port: node.split(':')[1],
            method: 'POST',
            path: '/api/transaction',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
        const post_req = http.request(requestOptions,(res)=>{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                // console.log('Response: ' + chunk);
            });
        });
        // post the data
        post_req.write(post_data);
        post_req.end();
    });

    callback(200);
};
   

/*--------- register_and_broadcast_node -----------*/
// register_and_broadcast_node handler
handlers.register_and_broadcast_node =function(data, callback){
    const acceptableMethods = ['post'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._register_and_broadcast_node[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._register_and_broadcast_node ={};
// register_and_broadcast_node submethods
handlers._register_and_broadcast_node.post = function(data,callback){
    
    if(bitcoin.networkNodes.indexOf(data.payload.newNode) == -1 && data.payload.newNode != bitcoin.currentNodeUrl) bitcoin.networkNodes.push(data.payload.newNode);
    
    bitcoin.networkNodes.forEach(node=>{
        const post_data = JSON.stringify({
            newNode: data.payload.newNode
        });
        const requestOptions = {
            host : node.split(':')[0],
            port: node.split(':')[1],
            method: 'POST',
            path: '/api/register_node',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
        const post_req = http.request(requestOptions,(res)=>{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                // console.log('Response: ' + chunk);
            });
        });
        // post the data
        post_req.write(post_data);
        post_req.end();
    });

    const post_data_bulk = JSON.stringify({
        nodesBulk: [...bitcoin.networkNodes, currentUrl]
    });

    const requestOptionsBulk = {
        host : data.payload.newNode.split(':')[0],
        port: data.payload.newNode.split(':')[1],
        method: 'POST',
        path: '/api/register_bulk',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data_bulk)
        }
    };
    const post_req_bulk = http.request(requestOptionsBulk,(res)=>{
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
            // console.log('Response: ' + chunk);
        });
    });
    // post the data
    post_req_bulk.write(post_data_bulk);
    post_req_bulk.end();

    callback(415);
};
   
/*--------- register_node -----------*/
// register_node handler
handlers.register_node =function(data, callback){
    const acceptableMethods = ['post'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._register_node[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._register_node ={};
// register_node submethods
handlers._register_node.post = function(data,callback){
    if(bitcoin.networkNodes.indexOf(data.payload.newNode) == -1 && data.payload.newNode != bitcoin.currentNodeUrl) bitcoin.networkNodes.push(data.payload.newNode);

    callback(200,'ok');
};

/*--------- register_bulk -----------*/
// register_bulk handler
handlers.register_bulk =function(data, callback){
    const acceptableMethods = ['post'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._register_bulk[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._register_bulk ={};
// register_bulk submethods
handlers._register_bulk.post = function(data,callback){
    data.payload.nodesBulk.forEach(node => {
        if(node != currentUrl && bitcoin.networkNodes.indexOf(node)== -1) bitcoin.networkNodes.push(node)
    });
    callback(200);
};

/*--------- mine -----------*/
// mine handler
handlers.mine =function(data, callback){
    const acceptableMethods = ['get'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._mine[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._mine ={};
// mine submethods
handlers._mine.get = function(data,callback){

    const lastBlock = bitcoin.getLastBlock();

    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index']+1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash,currentBlockData, nonce);
    
    bitcoin.createNewTransaction(12.5, '00', 'recipient some');
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    //------------------

    const post_data = JSON.stringify({
        newBlock: newBlock
    });
    // Breadcast new transaction
    bitcoin.networkNodes.forEach(node=>{
        const requestOptions = {
            host : node.split(':')[0],
            port: node.split(':')[1],
            method: 'POST',
            path: '/api/receive_new_block',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
        
        const post_req = http.request(requestOptions,(res)=>{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                // console.log('Response: ' + chunk);
            });
        });
        // post the data
        post_req.write(post_data);
        post_req.end();
    });
    //--------------------
    callback(200,{"note":"blockchain",
                    block: newBlock});

};

/*--------- receive_new_block -----------*/
// receive_new_block handler
handlers.receive_new_block =function(data, callback){
    const acceptableMethods = ['post'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._receive_new_block[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._receive_new_block ={};
// receive_new_block submethods
handlers._receive_new_block.post = function(data,callback){

    const newBlock = data.payload.newBlock;

    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 == newBlock['index'];
    if(correctHash && correctIndex){
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        callback(200,{'note':'new block excepted and added'})
    }else{
        callback(405, {'note':'new block rejected'})
    }

    // callback(200,{"note":"blockchain",
    //                 block: newBlock});

};

/*--------- transaction -----------*/
// transaction handler
handlers.transaction =function(data, callback){
    const acceptableMethods = ['post', 'get'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._transaction[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._transaction ={};
// transaction submethods
handlers._transaction.post = function(data,callback){
    // Get the transaction
    const newTransaction = data.payload.newTransaction;
    // Save new transaction
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);

    callback(200, {"note":`Transactioni will be added in block ${blockIndex}.`});
};

handlers._transaction.get = function(data,callback){
    // Get the transactionId
    const transactionId = data.queryStringObject.id;

    const resObj = bitcoin.getTransaction(transactionId);

    if(resObj.transaction) callback(200, resObj);
    else callback(404, {note: 'Transaction does not exist'})
    
};
   
/*--------- blockchain -----------*/
// blockchain handler
handlers.blockchain =function(data, callback){
    const acceptableMethods = ['get'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._blockchain[data.method](data,callback);
    }else{
        callback(405);
    }
}

handlers._blockchain = {};
// blockchain submethods
handlers._blockchain.get = function(data,callback){
    callback(200,bitcoin);
};



// Ping handler
handlers.ping =function(data, callback){
    // Callback a http status code, and a payload object
    callback(201,{"a":"pong"});
}

// Not found handler
handlers.notFound = function(data, callback){
    callback(404);
}

module.exports = handlers;