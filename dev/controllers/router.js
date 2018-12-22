/*
 * Routing overview
 * 
 */

// Dependencies
const handlers = require('./handlers')

// Define a request router
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

module.exports = router;