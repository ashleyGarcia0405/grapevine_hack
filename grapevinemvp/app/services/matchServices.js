import User from '@/models/User';


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
    const topMatches = {}; // Store top matches for each user

    for (const user of users) {
      topMatches[user._id] = []; // Initialize an array for each user
      const scores = []; // To hold scores for all users

      for (const potentialMatch of users) {
        if (user._id !== potentialMatch._id) { // Avoid matching the user with themselves
          let score = calculateSimilarity(user, potentialMatch);
          scores.push({ user: potentialMatch, score });
        }
      }

      // Sort scores in descending order and take the top 3 matches
      scores.sort((a, b) => b.score - a.score);
      topMatches[user._id] = scores.slice(0, 2).map(match => match.user); // Get top 2 matches
    }

    return topMatches; // Return the top matches for each user
  } catch (error) {
    console.error("Error matching users:", error);
    throw error; // Rethrow the error so it can be caught in the API route
  }
}