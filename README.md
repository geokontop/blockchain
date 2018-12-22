
# Node.js Blockchain demo 
Based on Eric Traub tutorial

## API endpoints

- api/blockchain : get, gets the blockchain
- api/transaction/broadcast: post, posts a transaction to be broadcasted. Returns status code 200 if successful
- api/transaction: 
    - post . Posts transaction to be added to the pending transactions. 
    - get ?id = . Gets transaction details
- api/register_and_broadcast_node : post, Posts the new node to be added and broadcasred
- api/register_node: post, Registers new node
- api/register_bulk: post, Registers new node
- api/mine: get, Mine a new, include the pending transactions in it.
- api/receive_new_block: post, Register new block in the chain. 
- api/consensus: get, Gets the chain consensus. Node chain is updated if different than consensus.
- api/block: get ?hash = . Gets block details
- api/address: get ?address = . Gets transactions and balance for the specified address.

const router = {
    '' : handlers.index,
    'api/block' : handlers.block,
    'api/consensus' : handlers.consensus,
    'api/address' : handlers.address,
    'api/transaction' : handlers.transaction,
    'api/transaction/broadcast' : handlers.transaction_broadcast,
    'api/register_bulk' : handlers.register_bulk,
    'api/register_node' : handlers.register_node,
    'api/register_and_broadcast_node' : handlers.register_and_broadcast_node,
    'api/receive_new_block' : handlers.receive_new_block,
    'api/mine' : handlers.mine,
    'api/blockchain' : handlers.blockchain,
    'ping' : handlers.ping,
    'notFound' : handlers.notFound,
    'favicon.ico' : handlers.favicon,
    'public' : handlers.public
}


## HTML

index.html demonstrates search (Block, Transaction, Address).

## Example use

- Start 5 network nodes, listening on ports 3001 to 3005
    - npm run node_1
    - npm run node_2
    - npm run node_3
    - npm run node_4
    - npm run node_5
- Postman, register network nodes
    - localhost:3001/api/register_and_broadcast_node , payload {"newNode":"localhost:3002"}
    - localhost:3001/api/register_and_broadcast_node , payload {"newNode":"localhost:3003"}
    - localhost:3001/api/register_and_broadcast_node , payload {"newNode":"localhost:3004"}
    - localhost:3001/api/register_and_broadcast_node , payload {"newNode":"localhost:3005"}
- Postman, Broadcast transactions e.g.
    - localhost:3001/api/register_and_broadcast_node, payload {"amount": 100, "sender":"me", "recipient":"mkjhe"}
- Postman, mine new block
    - localhost:3001/api/mine
- Browser localhost:3002 and play
- Stop and restart a node e.g. node_5. Then get consensus from that node
    - localhost:3005/api/cosensus

