const Web3 = require("web3");
const OKC_WEBSOCKET_URL = "wss://exchainws.okex.org:8443"
const abiDecoder = require('abi-decoder');
const {subscriptions, getAbiByAddress, incrementSubscriptionTriggered} = require("./server-repository");

const options = {
    timeout: 30000,
    clientConfig: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
    },
    reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 15,
        onTimeout: false,
    },
};

const web3 = new Web3(new Web3.providers.WebsocketProvider(OKC_WEBSOCKET_URL, options));
const subscription = web3.eth.subscribe("newBlockHeaders", (err, res) => {
    if (err) console.error(err);
});

const findTriggeredSubscriptions = function (transaction) {
    const result = []
    for (const txSubscription of subscriptions) {
        if (txSubscription.address.toLowerCase() !== transaction.to.toLowerCase()) {
            continue
        }
        if (txSubscription.conditions && txSubscription.conditions.length > 0) {
            const hasFails = txSubscription.conditions.find(condition => ifConditionFail(transaction, condition))
            if (hasFails) {
                continue
            }
        }
        result.push(txSubscription)
    }
    return result;
}

const ifConditionFail = function (transaction, condition) {
    if (condition.config.name === 'from') {
        return transaction.from !== condition.value
    }
    if (condition.config.name === 'methodName') {
        const decodedInput = abiDecoder.decodeMethod(transaction.input);
        if (!decodedInput) {
            return true
        }
        return decodedInput.name !== condition.value
    }
    if (condition.config.name === 'args') {
        // TODO use ABI to implement
        return true
    }
    return false;
}

const transactionToSubscriptionsConstruct = (transactionsTriggers) => {
    const triggeredSubscriptionById = {}
    for (const transactionsTrigger of transactionsTriggers) {
        const transaction = transactionsTrigger.transaction
        const triggeredSubscriptions = transactionsTrigger.triggeredSubscriptions
        for (const triggeredSubscription of triggeredSubscriptions) {
            if (triggeredSubscriptionById[triggeredSubscription.id]) {
                triggeredSubscriptionById[triggeredSubscription.id].transactions.push(transaction)
            } else {
                triggeredSubscriptionById[triggeredSubscription.id] = {
                    subscription: triggeredSubscription,
                    transactions: [transaction]
                }
            }
        }
    }
    return Object.values(triggeredSubscriptionById)
}

const triggerNotifications = (subscriptionTriggers) => {
    for (const subscriptionTrigger of subscriptionTriggers) {
        const subscription = subscriptionTrigger.subscription
        incrementSubscriptionTriggered(subscription, subscriptionTrigger.transactions.length)
    }
}

const init = async function () {
    console.log("init")
    subscription.on("data", async (data) => {
        try {
            let methodIDs = abiDecoder.getMethodIDs();
            for (const prop of Object.getOwnPropertyNames(methodIDs)) {
                delete methodIDs[prop];
            }
            abiDecoder.getABIs().splice(0, abiDecoder.getABIs().length)

            const block = await web3.eth.getBlock(18280038, true)
            const transactions = block.transactions
            console.log(data.number)
            const transactionsTriggers = []
            for (const transaction of transactions) {
                if (getAbiByAddress(transaction.to)) {
                    abiDecoder.addABI(getAbiByAddress(transaction.to))
                }
                transactionsTriggers.push({
                    transaction,
                    triggeredSubscriptions: findTriggeredSubscriptions(transaction)
                })
            }
            const subscriptionTriggers = transactionToSubscriptionsConstruct(transactionsTriggers);
            triggerNotifications(subscriptionTriggers)
        } catch (err) {
            console.error(err);
        }
    });
};

module.exports = {
    init
}