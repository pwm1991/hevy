require('dotenv').config();
const log = require('../logger');

const fs = require('fs').promises;
const path = require('path');
const dedent = require('dedent');

HUGO_POSTS_DIR = process.env.WORKOUT_BLOG_POST_PATH;
const createHugoPost = async (workout) => {
    const fileName = workout.id;
    const markdownData = dedent(`---
  title: ${workout.title}
  id: ${workout.id}
  date: ${workout.start_time}
  tags: []
  type: 'hevy'
  totalWeightInKg: ${workout.totalWeightInKg}
  duration: ${workout.duration}
  # Disable SEO for this post
  outputs: ["HTML"]
  robots: "noindex, nofollow"
  ---
  `);
    const filePath = path.join(HUGO_POSTS_DIR, `${fileName}.md`);
    try {
        await fs.writeFile(filePath, markdownData);
        log.info(`Post created: ${filePath}`);
    } catch (error) {
        log.error(`Error creating post: ${error}`);
    }
};
module.exports = createHugoPost;
