# OKTX Follower

This project  is a powerful and flexible blockchain transaction monitoring and notification system for the OKC blockchain. 
OKTX Follower offers users the ability to subscribe to transaction alerts involving specific smart contract methods, arguments, and users. 
Ensuring real-time updates on crucial events ensures by connecting to the OKC Full Node via a WebSocket. 

## Features

- Monitor OKC blockchain transaction activities
- Subscribe to specific smart contract methods and user interactions
- Receive notifications via Telegram
- React frontend for an interactive user experience
- rest api backend with Express.js
- Deployed on Google App Engine for reliability and ease of use
- Integration with OKC public Node
- Integration with OKLINK to retrieve ABI for the smart contacts

### `npm start-dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### Deployment Google App Engine

- run `gcloud init`
- run `gcloud app deploy`