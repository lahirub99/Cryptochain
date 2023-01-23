const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
   
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    //this.publisher.on("error", (error) => console.error(`Error : ${error}`));
    //this.subscriber.on("error", (error) => console.error(`Error : ${error}`));
    
      //await this.publisher.connect();
    
    this.subscribeToChannels();

    this.subscriber.on(
      'message',
      (channel, message) => this.handleMessage(channel, message)
    );
  }

  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}`);

    const parsedMessage = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage);
    }
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel);
    });
  }

  publish({ channel, message}) {
    this.subscriber.unsubscribe(channel, () => { 
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }
}

module.exports = PubSub;


/* //My code - Redis

const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor( blockchain ) {
        this.blockchain = blockchain;
        this.publisher = redis.createClient({ legacyMode: true});
        this.subscriber = redis.createClient({ legacyMode: true});

        this.subscriber.on('error', (err) => console.log('Redis Client Error', err));
        this.subscriber.connect();
        this.publisher.on('error', (err) => console.log('Redis Client Error', err));
        this.publisher.connect();

        this.subscribeToChannels();

        // this.subscriber.subscribe(CHANNELS.TEST, (message) => {
        //     this.handleMessage(CHANNELS.TEST, message); // 'message'
        // });

        /*
        // this.subscriber.on(
        //     'message',
        //     (message, channel) => this.handleMessage(channel, message));
        // console.log('ASD'); //
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);

        const parsedMessage = JSON.parse(message);
        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels() {
        Object.values( CHANNELS ).forEach(
            channel => {
                this.subscriber.subscribe(channel, (message) => {
                    this.handleMessage(channel, message);
                });
                //this.subscriber.subscribe(channel);
            }
        );
    }

    publish({channel, message}) {   // Publishes a given message in a specific Channel
        this.publisher.publish(channel, message);
    }

    broadcastChain() {
        // Behaviours:
        //    1. Boadcast the Blockchain
        //    2. Update the Blockchain if there's newer version
        // 
       this.publish({
        channel: CHANNELS.BLOCKCHAIN,
        message: JSON.stringify( this.blockchain.chain )
       });
    }
}
*/

/* Test for Messege sending
const testPubSub = new PubSub();
setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 2000);
//testPubSub.publisher.publish(CHANNELS.TEST, 'foo');
*/

module.exports = PubSub;
//*/

/* // Copied Code - Redis

const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST'
};

class PubSub {
  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscriber.subscribe(CHANNELS.TEST);

    this.subscriber.on(
      'message',
      (channel, message) => this.handleMessage(channel, message)
    );
  }

  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}`);
  }
}

const testPubSub = new PubSub();

setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 1000);
*/

/* Copied Code - PubNub
const PubNub = require('pubnub');

const credentials = {
  publishKey: 'pub-c-169c7147-37e6-4884-9e9b-4e048f782033',
  subscribeKey: 'sub-c-f525e5bf-ff98-49e8-9d58-16f36a22dac1',
  secretKey: 'sec-c-NGE4MGQ4MmItNmQ1Ni00OWFkLWJmODUtNDE3NGY0NzExYWE2'
};

const CHANNELS = {
  TEST: 'TEST'
};

class PubSub {
  constructor() {
    this.pubnub = new PubNub(credentials);

    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

    this.pubnub.addListener(this.listener());
  }

  listener() {
    return {
      message: messageObject => {
        const { channel, message } = messageObject;

        console.log(`Message received. Channel: ${channel}. Message: ${message}`);
      }
    };
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }
}

const testPubSub = new PubSub();
testPubSub.publish({ channel: CHANNELS.TEST, message: 'hello pubnub' });

module.exports = PubSub;
*/

 /* // My code- PubNub 

const PubNub = require('pubnub');

const credentials = {
    publicKey: 'pub-c-169c7147-37e6-4884-9e9b-4e048f782033',
    subscribeKey: 'sub-c-f525e5bf-ff98-49e8-9d58-16f36a22dac1',
    secretKey: 'sec-c-NGE4MGQ4MmItNmQ1Ni00OWFkLWJmODUtNDE3NGY0NzExYWE2'
};

const CHANNELS = {
    TEST: 'TEST'
};

class PubSub {
    constructor() {
        this.pubnub = new PubNub(credentials); 

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener( this.listener() );
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            }
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }
}
const testPubSub = new PubSub();
testPubSub.publish({ channel: CHANNELS.TEST, message: 'Hello PubNub'});

module.exports = PubSub;
// */
