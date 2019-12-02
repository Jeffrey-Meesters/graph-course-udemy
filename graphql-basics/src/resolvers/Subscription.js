const Subscription = {
  comment: {
    subscribe(parent, args, { db, pubsub }, info) {
      const { postId } = args;

      const post = db.posts.find(post => post.id === postId && post.published);

      if (!post) {
        throw new Error("Post not found");
      }

      return pubsub.asyncIterator(`comment_${postId}`);
    }
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator("post");
    }
  }
};

export { Subscription as default };
