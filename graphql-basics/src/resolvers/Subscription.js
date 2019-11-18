const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish("count", {
          count
        });
      }, 1000);

      // the string inside asyncIterator is called: channel name
      return pubsub.asyncIterator("count");
    }
  }
};

export { Subscription as default };
