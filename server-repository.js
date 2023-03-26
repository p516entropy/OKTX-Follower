const abiData = {}

const subscriptions = [{
  id: 1,
  triggered: 12222,
  address: "1231231231231231231231231231231234",
  selectedChannels: ['telegram'],
  conditions: []
}, {
  id: 2,
  triggered: 5,
  address: "34534534534",
  selectedChannels: ['telegram'],
  conditions: [{
    config: {
      label: "qq"
    },
    value: 1
  }, {
    config: {
      label: "sdfsdf"
    },
    value: 1
  }]
}]

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