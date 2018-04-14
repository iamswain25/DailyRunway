const driver = require('bigchaindb-driver');
const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/', global.PROJECT_CONFIG.bigchaindb);
const swain = new driver.Ed25519Keypair();
const metadata = {};

exports.create = (assetdata) => {
    return new Promise((resolve) => {
        const tx = driver.Transaction.makeCreateTransaction(
            assetdata,
            metadata,

            // A transaction needs an output
            [driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(swain.publicKey))
            ],
            swain.publicKey
        );
        const signedTx = driver.Transaction.signTransaction(tx, swain.privateKey)
        conn.postTransactionCommit(signedTx)
            .then(retrievedTx =>{ 
                global.LOG.debug(retrievedTx)
                resolve(retrievedTx);
            })
            .catch((err)=>{
                global.LOG.error(err.message);
            });
    });

}
