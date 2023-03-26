const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const axios = require("axios");

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.get("/api", (req, res) => {
  res.json({message: "Hello from server!"});
});

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

app.get("/api/subscription", (req, res) => {
  res.json(subscriptions);
});

const abiData = {}

const retrieveOklinkAbis = async (contractAddress) => {
  try {
    const response = await axios.get(
      `https://www.oklink.com/api/explorer/v1/okexchain/addresses/${contractAddress}/contract`,
      {
        headers: {
          "x-apikey": "LWIzMWUtNDU0Ny05Mjk5LWI2ZDA3Yjc2MzFhYmEyYzkwM2NjfDI3OTA4MzcyMTI4OTE1MTQ="
        }
      });

    const data = response.data.data;
    if (!data) {
      return []
    }
    const result = []

    if (data['contractAbi']) {
      result.push(...JSON.parse(data['contractAbi']))
    }
    if (data['implReadContract']) {
      result.push(...data['implReadContract'])
    }
    if (data['implWriteContract']) {
      result.push(...data['implWriteContract'])
    }
    return result;
  } catch {
    return []
  }
}

app.get("/api/abi/:address", async (req, res) => {
  try {
    const contractAddress = req.params.address
    if (!contractAddress.startsWith("0x") || contractAddress.length < 5) {
      res.json([]);
      return
    }
    const abis = abiData[contractAddress] ? abiData[contractAddress] : await retrieveOklinkAbis(contractAddress)
    if (!abiData[contractAddress]) {
      abiData[contractAddress] = abis
    }
    const allMethods = abis.map(method => method.name).filter(item => item)
    res.json(allMethods);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({message: 'Error fetching data'});
  }
});

app.post("/api/subscription", (req, res) => {
  const newSub = req.body;
  newSub.id = Math.round(Math.random() * 1000000);
  subscriptions.unshift(newSub)
  res.json(newSub);
});

app.delete("/api/subscription/:id", (req, res) => {
  const subscriptionId = req.params.id;
  let index = subscriptions.findIndex(subscription => String(subscription.id) === String(subscriptionId));
  if (index !== -1) {
    subscriptions.splice(index, 1)
    res.status(201).send()
  }
  res.status(404).send();
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});


http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});