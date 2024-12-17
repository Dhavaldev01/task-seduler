const Post = require('../models/Post');  // Assuming 'Post' is a Mongoose model for your posts

// exports.createPost = async (req, res) => {
//   try {
//     const { title, content, scheduledTime, userId } = req.body;

//     // Log the received request
//     console.log('Received request to create a new post:', req.body);

//     // Parse the scheduled time and validate
//     const parsedScheduledTime = new Date(scheduledTime);

//     // Check if the scheduled time is valid
//     if (isNaN(parsedScheduledTime.getTime())) {
//       return res.status(400).json({ message: 'Invalid scheduled time format.' });
//     }

//     // Check if the scheduled time is in the future
//     if (parsedScheduledTime < new Date()) {
//       return res.status(400).json({ message: 'Scheduled time must be in the future.' });
//     }

//     // Create a new post instance
//     const newPost = new Post({
//       title,
//       content,
//       scheduledTime: parsedScheduledTime.toISOString(),
//       user: userId, 
//       status: 'scheduled',  // Initially set the post status to "scheduled"
//       retries: 0,
//     });

//     // Save the post to the database
//     await newPost.save();
//     console.log(`Post "${title}" created successfully with ID: ${newPost._id}`);
//     console.log(`Post scheduled at ${scheduledTime}.`);

//     // Calculate the delay until the scheduled time
//     const delay = parsedScheduledTime.getTime() - new Date().getTime(); // Delay in milliseconds

//     console.log("Delay:", delay);

//     // Check if delay is valid (positive and in future)
//     if (delay > 0) {
//       console.log(`Post "${title}" will be updated to "publishing" after ${delay / 1000} seconds.`);

//       // Set a timeout to update the post status when the scheduled time arrives
//       setTimeout(async () => {
//         try {
//           // Ensure we don't update if the time has already passed
//           if (new Date().getTime() > parsedScheduledTime.getTime()) {
//             console.log('Scheduled time has passed, updating the post immediately.');
//           }

//           console.log('Post ID:', newPost._id);

//           // Update the post's status to "publishing"
//           const updatedPost = await Post.findByIdAndUpdate(
//             newPost._id,
//             { status: 'publishing' },
//             { new: true }  // Return the updated post
//           );

//           if (!updatedPost) {
//             console.error('Post not found or failed to update');
//             return;
//           }

//           console.log('Updated post:', updatedPost);
//           console.log(`Post "${updatedPost.title}" is now publishing.`);
//         } catch (error) {
//           console.error('Error updating post status to publishing:', error);
//         }
//       }, delay); // Delay in milliseconds
//     } else {
//       console.error('Scheduled time has already passed.');
//     }

//     // Respond with the created post
//     res.status(201).json({
//       message: 'Post scheduled successfully',
//       post: newPost,
//     });
//   } catch (error) {
//     console.error('Post creation error:', error);
//     res.status(400).json({
//       message: 'Error scheduling post',
//       error: error.message,
//     });
//   }
// };



// Get all posts (with user details)


exports.createPost = async (req, res) => {
  try {
    const { title, content, scheduledTime, userId } = req.body;

    // Log the received request
    console.log('Received request to create a new post:', req.body);

    // Parse the scheduled time and validate
    const parsedScheduledTime = new Date(scheduledTime);

    // Check if the scheduled time is valid
    if (isNaN(parsedScheduledTime.getTime())) {
      return res.status(400).json({ message: 'Invalid scheduled time format.' });
    }

    // Check if the scheduled time is in the future
    if (parsedScheduledTime < new Date()) {
      return res.status(400).json({ message: 'Scheduled time must be in the future.' });
    }

    // Create a new post instance
    const newPost = new Post({
      title,
      content,
      scheduledTime: parsedScheduledTime.toISOString(),
      user: userId,
      status: 'scheduled',  // Initially set the post status to "scheduled"
      retries: 0,
    });

    // Save the post to the database
    await newPost.save();
    console.log(`Post "${title}" created successfully with ID: ${newPost._id}`);
    console.log(`Post scheduled at ${scheduledTime}.`);

    // Fixed delay of 400 seconds (5 minutes and 40 seconds)
    const delayInSeconds = 60;  // 400 seconds = 5 minutes 40 seconds
    console.log("Delay in seconds:", delayInSeconds);

    // Check if delay is valid (positive and in future)
    if (delayInSeconds > 0) {
      console.log(`Post "${title}" will be updated to "publishing" after ${delayInSeconds} seconds.`);

      // Set a timeout to update the post status after the delay
      setTimeout(async () => {
        try {
          // Ensure we don't update if the time has already passed
          if (new Date().getTime() > parsedScheduledTime.getTime()) {
            console.log('Scheduled time has passed, updating the post immediately.');
          }

          console.log('Post ID:', newPost._id);

          // Update the post's status to "publishing"
          const updatedPost = await Post.findByIdAndUpdate(
            newPost._id,
            { status: 'publishing' },
            { new: true }  // Return the updated post
          );

          if (!updatedPost) {
            console.error('Post not found or failed to update');
            return;
          }

          console.log('Updated post:', updatedPost);
          console.log(`Post "${updatedPost.title}" is now publishing.`);
        } catch (error) {
          console.error('Error updating post status to publishing:', error);
        }
      }, delayInSeconds * 1000); // Convert delay to milliseconds for setTimeout
    } else {
      console.error('Scheduled time has already passed.');
    }

    // Respond with the created post
    res.status(201).json({
      message: 'Post scheduled successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(400).json({
      message: 'Error scheduling post',
      error: error.message,
    });
  }
};


exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username email');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(400).json({
      message: 'Error fetching posts',
      error: error.message,
    });
  }
};

// Update an existing post
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }  // Ensure that the update follows schema validation
    );

    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({
      message: 'Post updated successfully',
      updatedPost,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(400).json({
      message: 'Post update failed',
      error: error.message,
    });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await post.deleteOne();  // Delete the post
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(400).json({
      message: 'Error deleting post',
      error: error.message,
    });
  }
};
