# Data Structure

User {
  uid: string,
  coverIdentity: {
    name: string,
    level: number,
    xp: number,
    streak: number,
    createdAt: timestamp
  },
  progress: {
    episodes: Map<episodeId, completionPercentage>,
    missions: Map<missionId, status>,
    vocabulary: Map<termId, masteryLevel>,
    skills: Map<skillId, proficiencyScore>
  },
  preferences: {
    notificationSettings: object,
    displaySettings: object
  }
}

Content {
  episodes: [
    {
      id: string,
      title: string,
      description: string,
      missions: [missionId],
      unlockRequirements: object
    }
  ],
  missions: [
    {
      id: string,
      title: string,
      context: string,
      exercises: [exerciseId],
      rewards: object
    }
  ],
  exercises: [
    {
      id: string,
      type: string, // vocab-drill, conversation, etc.
      content: object,
      difficulty: number,
      vocabulary: [termId]
    }
  ],
  vocabulary: [
    {
      id: string,
      term: string,
      translation: string,
      audio: string,
      usageExamples: [string],
      category: string
    }
  ]
}
