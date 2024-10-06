
// /app/services/matchService.js

import User from '@/models/User';
import Group from '@/models/Groups'; // Make sure you have a Group model


function calculateSimilarity(user1, user2) {
  let score = 0;

  const commonSkills = user1.skills.filter(skill => user2.skills.includes(skill));
  score += commonSkills.length * 2;

  if (user1.projectInterest === user2.projectInterest) {
    score += 3;
  }

  const commonInterests = user1.interests.filter(interest => user2.interests.includes(interest));
  score += commonInterests.length; 

  return score;
}

export async function matchServices() {
  try {
    const users = await User.find(); 
    const groups = [];
    
    while (users.length >= 4) {
      let group = [];
      let seedUser = users.pop();
      group.push(seedUser);
      
      for (let i = 0; i < 3; i++) {
        let bestMatch = null;
        let highestScore = -1;

        for (const user of users) {
          let score = calculateSimilarity(seedUser, user);
          if (score > highestScore) {
            bestMatch = user;
            highestScore = score;
          }
        }

        if (bestMatch) {
          group.push(bestMatch);
          users.splice(users.indexOf(bestMatch), 1);
        }
      }

      groups.push(group);
      
      // Save the group to the database
      const groupToSave = new Group({ members: group.map(user => user._id) });
      await groupToSave.save();
    }

    return groups;
  } catch (error) {
    console.error("Error matching users:", error);
    throw error; // Rethrow the error so it can be caught in the API route
  }
}