const cron = require('node-cron');
const Post = require('../models/Post');
const { publishPost } = require('../serivce/media-service');
const MAX_RETRIES = 3;

// Cron job that runs every minute
cron.schedule('* * * * *', async () => {
  console.log('Running scheduled task to publish posts...');

  try {
    const posts = await Post.find({
      status: 'scheduled',
      scheduledTime: { $lte: new Date() },
    }).populate('user');

    if (posts.length === 0) {
      console.log('No posts found for publishing at this time.');
    } else {
      console.log(`Found ${posts.length} post(s) to check for publishing.`);
    }

    for (const post of posts) {
      console.log(`Attempting to publish post: ${post._id}`);

      // Attempt to publish the post (this function will return true or false)
      const success = await publishPost(post.content);

      if (success) {
        // If successful, update the post status to "published"
        post.status = 'published';
        post.publishedTime = new Date();
        await post.save();
        console.log(`Post "${post.title}" published successfully at ${new Date()}`);
      } else {
        // If failed, increment retry count and check if max retries are reached
        post.retries += 1;

        if (post.retries >= MAX_RETRIES) {
          post.status = 'failed';
          console.log(`Post "${post.title}" failed after ${MAX_RETRIES} attempts.`);
        } else {
          console.log(`Retrying post "${post.title}", attempt ${post.retries}`);
        }

        await post.save();
      }
    }
  } catch (error) {
    console.error('Error in post scheduler:', error);
  }
});
