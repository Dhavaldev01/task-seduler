// In your services/socialMediaService.js (or similar)
exports.publishPost = async (content) => {
    try {
      console.log(`Attempting to publish post with content: "${content}"`);
      
      // Simulate a 70% success rate for publishing
      const isSuccess = Math.random() > 0.3;  // 70% chance of success
  
      if (isSuccess) {
        console.log('Post published successfully!');
      } else {
        console.log('Post failed to publish.');
      }
  
      return isSuccess;
    } catch (error) {
      console.error('Error while trying to publish the post:', error);
      return false;
    }
  };
  