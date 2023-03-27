const abiData = {}

const subscriptions = []

const getAbiByAddress = (address) => {
  return abiData[address.toLowerCase()]
}

const saveAbiByAddress = (address, abiArray) => {
  return abiData[address.toString().toLowerCase()] = abiArray
}


const incrementSubscriptionTriggered = (subscription, increment) => {
  subscription.triggered = subscription.triggered + increment;
}


module.exports = {
  getAbiByAddress,
  saveAbiByAddress,
  incrementSubscriptionTriggered,
  subscriptions
}