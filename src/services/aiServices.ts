import KnowledgeBase from './knowledgeBase'
import { careerRoadmaps } from './careerRoadmaps'
import LLMService from './llmService'

// Enhanced Career Guidance AI Service with Requirements-Based Matching
export class CareerAIService {
  static generateCareerQuiz() {
    const questions = [
      {
        id: '1',
        question: 'What type of work environment energizes you most?',
        type: 'multiple_choice' as const,
        options: [
          'Collaborative team interaction',
          'Independent work with minimal supervision', 
          'Fast-paced, dynamic environments with constant change',
          'Structured, organized environments with clear processes'
        ],
        traits: ['teamwork', 'independence', 'adaptability', 'organization']
      },
      {
        id: '2',
        question: 'Which activities do you find most engaging?',
        type: 'multiple_choice' as const,
        options: [
          'Solving complex technical problems and coding',
          'Creating and designing user interfaces',
          'Analyzing data and finding patterns',
          'Leading teams and making strategic decisions'
        ],
        traits: ['technical', 'creative', 'analytical', 'leadership']
      },
      {
        id: '3',
        question: 'What motivates you most in your work?',
        type: 'multiple_choice' as const,
        options: [
          'Making a positive impact on users and society',
          'Continuous learning and skill development',
          'Financial success and career advancement',
          'Creative expression and innovation'
        ],
        traits: ['impact', 'learning', 'financial', 'creativity']
      },
      {
        id: '4',
        question: 'How do you prefer to communicate ideas?',
        type: 'multiple_choice' as const,
        options: [
          'Visual presentations and design mockups',
          'Written documentation and technical reports',
          'Verbal discussions and collaborative meetings',
          'Hands-on demonstrations and prototypes'
        ],
        traits: ['visual', 'written', 'verbal', 'practical']
      },
      {
        id: '5',
        question: 'What type of challenges excite you most?',
        type: 'multiple_choice' as const,
        options: [
          'Technical puzzles and programming problems',
          'Strategic planning and business decisions',
          'Creative design and user experience challenges',
          'Data analysis and research discovery'
        ],
        traits: ['technical', 'strategic', 'creative', 'analytical']
      }
,
      {
        id: '6',
        question: 'What is your current experience with mathematics?',
        type: 'multiple_choice' as const,
        options: [
          'Strong - I enjoy calculus, statistics, and linear algebra',
          'Moderate - I can handle basic math and some statistics',
          'Basic - I prefer to avoid complex mathematical concepts',
          'Minimal - Math is not my strong suit'
        ],
        traits: ['math_strong', 'math_moderate', 'math_basic', 'math_minimal']
      },
      {
        id: '7',
        question: 'How do you feel about public speaking and presentations?',
        type: 'multiple_choice' as const,
        options: [
          'Love it - I thrive when presenting to groups',
          'Comfortable - I can present when needed',
          'Nervous but willing - I can improve with practice',
          'Avoid it - I prefer behind-the-scenes work'
        ],
        traits: ['presentation_love', 'presentation_comfortable', 'presentation_willing', 'presentation_avoid']
      },
      {
        id: '8',
        question: 'What is your relationship with technology?',
        type: 'multiple_choice' as const,
        options: [
          'Tech enthusiast - I love learning new programming languages and tools',
          'Practical user - I use technology to solve problems',
          'Casual user - I use basic tools but prefer non-technical work',
          'Reluctant user - I prefer minimal technology involvement'
        ],
        traits: ['tech_enthusiast', 'tech_practical', 'tech_casual', 'tech_reluctant']
      }
    ]

    return questions
  }

  static generateCareerRecommendations(responses: any[]) {
    // Extract user traits from quiz responses
    const userTraits = this.extractUserTraits(responses)
    
    // Get all career paths with requirements
    const allCareerPaths = this.getAllCareerPathsWithRequirements()
    
    // Calculate compatibility scores based on requirements
    const scoredCareers = allCareerPaths.map(career => {
      const compatibilityScore = this.calculateCareerCompatibility(userTraits, career.requirements)
      return {
        ...career,
        compatibilityScore,
        matchReasons: this.generateMatchReasons(userTraits, career.requirements)
      }
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore)

    // Return only top 2 matches for focused recommendations
    return scoredCareers.slice(0, 2)
  }
  private static extractUserTraits(responses: any[]): string[] {
    const traits: string[] = []
    
    responses.forEach((response) => {
      const questionIndex = parseInt(response.questionId) - 1
      const answerIndex = this.generateCareerQuiz()[questionIndex]?.options.indexOf(response.answer)
      
      if (answerIndex !== -1) {
        const questionTraits = this.generateCareerQuiz()[questionIndex]?.traits
        if (questionTraits && questionTraits[answerIndex]) {
          traits.push(questionTraits[answerIndex])
        }
      }
    })
    
    return traits
  }

  private static calculateCareerCompatibility(userTraits: string[], careerRequirements: any): number {
    let score = 0
    let maxScore = 0
    
    // Check each requirement category
    Object.entries(careerRequirements).forEach(([category, requirements]: [string, any]) => {
      const categoryWeight = this.getCategoryWeight(category)
      maxScore += categoryWeight
      
      if (Array.isArray(requirements)) {
        // Check if user has any of the required traits
        const hasRequiredTraits = requirements.some(req => userTraits.includes(req))
        if (hasRequiredTraits) {
          score += categoryWeight
        }
      }
    })
    
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  }

  private static getCategoryWeight(category: string): number {
    const weights = {
      'core_traits': 40,
      'technical_aptitude': 30,
      'communication_style': 20,
      'work_environment': 10
    }
    return weights[category as keyof typeof weights] || 10
  }

  private static generateMatchReasons(userTraits: string[], requirements: any): string[] {
    const reasons: string[] = []
    
    // Check core traits match
    if (requirements.core_traits?.some((trait: string) => userTraits.includes(trait))) {
      reasons.push("🎯 Strong alignment with core personality traits")
    }
    
    // Check technical aptitude
    if (requirements.technical_aptitude?.some((trait: string) => userTraits.includes(trait))) {
      reasons.push("💻 Technical skills match career requirements")
    }
    
    // Check communication style
    if (requirements.communication_style?.some((trait: string) => userTraits.includes(trait))) {
      reasons.push("💬 Communication style fits the role")
    }
    
    // Check work environment
    if (requirements.work_environment?.some((trait: string) => userTraits.includes(trait))) {
      reasons.push("🏢 Preferred work environment aligns")
    }
    
    return reasons.slice(0, 3) // Return top 3 reasons
  }
  private static getAllCareerPathsWithRequirements() {
    return [
      {
        careerPath: 'Full-Stack Software Engineer',
        requirements: {
          core_traits: ['technical', 'learning', 'practical'],
          technical_aptitude: ['tech_enthusiast', 'tech_practical'],
          communication_style: ['written', 'verbal'],
          work_environment: ['teamwork', 'independence']
        },
        interests: ['Web Development', 'Programming', 'Technology', 'Problem Solving'],
        reasoning: 'Your technical aptitude and problem-solving skills make you ideal for full-stack development.',
        pros: ['High demand', 'Competitive salary', 'Remote work opportunities', 'Continuous learning'],
        cons: ['Can be stressful', 'Requires constant skill updates', 'Long hours during deadlines'],
        roadmap: careerRoadmaps['Full-Stack Software Engineer'],
        marketData: {
          demand: 'very_high' as const,
          growth: 22,
          jobOpenings: 50000,
          competitionLevel: 'medium' as const
        },
        salaryRange: {
          min: 70000,
          max: 150000,
          median: 95000,
          currency: 'USD',
          location: 'US Average'
        }
      },
      {
        careerPath: 'Data Scientist',
        requirements: {
          core_traits: ['analytical', 'learning', 'technical'],
          technical_aptitude: ['tech_enthusiast', 'math_strong', 'math_moderate'],
          communication_style: ['written', 'visual'],
          work_environment: ['independence', 'teamwork']
        },
        interests: ['Data Analysis', 'Machine Learning', 'Research', 'Statistics', 'Mathematics'],
        reasoning: 'Your analytical mindset and mathematical aptitude make you perfect for data science.',
        pros: ['High growth field', 'Excellent salary', 'Diverse applications', 'Research opportunities'],
        cons: ['Requires strong math skills', 'Data quality challenges', 'Complex stakeholder management'],
        roadmap: careerRoadmaps['Data Scientist'],
        marketData: {
          demand: 'very_high' as const,
          growth: 35,
          jobOpenings: 25000,
          competitionLevel: 'high' as const
        },
        salaryRange: {
          min: 80000,
          max: 180000,
          median: 120000,
          currency: 'USD',
          location: 'US Average'
        }
      }
,
      {
        careerPath: 'UX/UI Designer',
        requirements: {
          core_traits: ['creative', 'impact', 'learning'],
          technical_aptitude: ['tech_practical', 'tech_casual'],
          communication_style: ['visual', 'verbal'],
          work_environment: ['teamwork', 'adaptability']
        },
        interests: ['Design', 'User Experience', 'Visual Arts', 'Psychology', 'Creativity'],
        reasoning: 'Your creative thinking and user empathy align perfectly with UX design principles.',
        pros: ['Creative fulfillment', 'User impact', 'Growing field', 'Diverse industries'],
        cons: ['Subjective feedback', 'Tight deadlines', 'Requires portfolio maintenance'],
        roadmap: careerRoadmaps['UX/UI Designer'],
        marketData: {
          demand: 'high' as const,
          growth: 18,
          jobOpenings: 15000,
          competitionLevel: 'medium' as const
        },
        salaryRange: {
          min: 60000,
          max: 130000,
          median: 85000,
          currency: 'USD',
          location: 'US Average'
        }
      },
      {
        careerPath: 'Product Manager',
        requirements: {
          core_traits: ['strategic', 'leadership', 'impact'],
          technical_aptitude: ['tech_practical', 'tech_casual'],
          communication_style: ['verbal', 'presentation_love', 'presentation_comfortable'],
          work_environment: ['teamwork', 'adaptability']
        },
        interests: ['Strategy', 'Leadership', 'Business', 'Technology', 'Innovation'],
        reasoning: 'Your strategic thinking and leadership skills make you ideal for product management.',
        pros: ['High impact', 'Leadership opportunities', 'Cross-functional work', 'Strategic influence'],
        cons: ['High pressure', 'Ambiguous requirements', 'Stakeholder management challenges'],
        roadmap: careerRoadmaps['Product Manager'],
        marketData: {
          demand: 'very_high' as const,
          growth: 25,
          jobOpenings: 30000,
          competitionLevel: 'high' as const
        },
        salaryRange: {
          min: 90000,
          max: 200000,
          median: 130000,
          currency: 'USD',
          location: 'US Average'
        }
      },
      {
        careerPath: 'DevOps Engineer',
        requirements: {
          core_traits: ['technical', 'organization', 'learning'],
          technical_aptitude: ['tech_enthusiast', 'tech_practical'],
          communication_style: ['written', 'practical'],
          work_environment: ['independence', 'teamwork']
        },
        interests: ['Infrastructure', 'Automation', 'Cloud Computing', 'System Administration'],
        reasoning: 'Your technical skills and systematic approach make you perfect for DevOps engineering.',
        pros: ['High demand', 'Excellent salary', 'Cutting-edge technology', 'Problem-solving focus'],
        cons: ['On-call responsibilities', 'High-pressure incidents', 'Constant learning required'],
        roadmap: careerRoadmaps['DevOps Engineer'],
        marketData: {
          demand: 'very_high' as const,
          growth: 30,
          jobOpenings: 35000,
          competitionLevel: 'medium' as const
        },
        salaryRange: {
          min: 85000,
          max: 170000,
          median: 115000,
          currency: 'USD',
          location: 'US Average'
        }
      }
,
      {
        careerPath: 'Digital Marketing Specialist',
        requirements: {
          core_traits: ['creative', 'analytical', 'impact'],
          technical_aptitude: ['tech_practical', 'tech_casual'],
          communication_style: ['visual', 'verbal', 'presentation_comfortable'],
          work_environment: ['teamwork', 'adaptability']
        },
        interests: ['Marketing', 'Social Media', 'Content Creation', 'Analytics', 'Psychology'],
        reasoning: 'Your creative and analytical skills combined with communication abilities make you ideal for digital marketing.',
        pros: ['Creative expression', 'Measurable impact', 'Diverse opportunities', 'Growing field'],
        cons: ['Fast-changing landscape', 'Platform dependency', 'Performance pressure'],
        roadmap: careerRoadmaps['Digital Marketing Specialist'],
        marketData: {
          demand: 'high' as const,
          growth: 20,
          jobOpenings: 40000,
          competitionLevel: 'medium' as const
        },
        salaryRange: {
          min: 45000,
          max: 95000,
          median: 65000,
          currency: 'USD',
          location: 'US Average'
        }
      },
      {
        careerPath: 'Cybersecurity Analyst',
        requirements: {
          core_traits: ['technical', 'analytical', 'organization'],
          technical_aptitude: ['tech_enthusiast', 'tech_practical'],
          communication_style: ['written', 'practical'],
          work_environment: ['independence', 'organization']
        },
        interests: ['Security', 'Technology', 'Problem Solving', 'Risk Management', 'Investigation'],
        reasoning: 'Your analytical mindset and technical aptitude make you well-suited for cybersecurity.',
        pros: ['High demand', 'Excellent job security', 'Intellectual challenges', 'Protecting organizations'],
        cons: ['High stress', 'Constant learning required', 'On-call responsibilities'],
        roadmap: careerRoadmaps['Cybersecurity Analyst'],
        marketData: {
          demand: 'very_high' as const,
          growth: 35,
          jobOpenings: 45000,
          competitionLevel: 'low' as const
        },
        salaryRange: {
          min: 75000,
          max: 160000,
          median: 105000,
          currency: 'USD',
          location: 'US Average'
        }
      }
    ]
  }

  // Get all career paths for exploration - WITH COMPLETE ROADMAPS
  static getAllCareerPaths() {
    return this.getAllCareerPathsWithRequirements()
  }
}
// Study AI Service
export class StudyAIService {
  static generateStudyPlan(_userProfile: any) {
    return {
      weeklyGoals: [
        { id: '1', title: 'Complete 5 coding challenges', target: 5, current: 2 },
        { id: '2', title: 'Study 3 hours daily', target: 21, current: 12 },
        { id: '3', title: 'Build 1 project', target: 1, current: 0 }
      ],
      recommendations: [
        'Focus on JavaScript fundamentals this week',
        'Practice data structures and algorithms',
        'Build a portfolio project'
      ]
    }
  }
}

// Enhanced Mentor Matching AI Service with RAG-like Matching
export class MentorAIService {
  static calculateCompatibility(userProfile: any, mentor: any): number {
    let score = 50 // Base compatibility
    const matchDetails: string[] = []

    // 1. EXPERTISE MATCHING (40 points max)
    if (userProfile.interests) {
      let expertiseScore = 0
      const userInterests = userProfile.interests.map((i: any) => i.name.toLowerCase())
      
      mentor.expertise.forEach((exp: any) => {
        const expName = exp.name.toLowerCase()
        
        // Direct matches
        userInterests.forEach((interest: string) => {
          if (expName.includes(interest) || interest.includes(expName)) {
            expertiseScore += exp.level * 5 // Higher level mentors get more points
            matchDetails.push(`Expert in ${exp.name} (Level ${exp.level})`)
          }
        })
      })
      
      score += Math.min(expertiseScore, 40)
    }

    // Store match details for later use
    mentor._matchDetails = matchDetails

    return Math.min(Math.max(score, 0), 100)
  }

  static generateMatchingReasons(score: number, mentor?: any): string[] {
    // Use stored match details if available
    if (mentor && mentor._matchDetails) {
      return mentor._matchDetails.slice(0, 3) // Return top 3 reasons
    }

    // Fallback to score-based reasons
    const reasons: string[] = []
    
    if (score >= 90) {
      reasons.push("🎯 Excellent expertise alignment")
      reasons.push("⭐ Highly rated mentor")
      reasons.push("🚀 Perfect experience level match")
    } else if (score >= 80) {
      reasons.push("✅ Good skill overlap")
      reasons.push("📈 Complementary experience levels")
      reasons.push("💬 Strong communication style")
    } else {
      reasons.push("🎓 Different perspective valuable")
      reasons.push("🔄 Potential for skill development")
      reasons.push("💡 New learning opportunities")
    }

    return reasons
  }
}
// Enhanced Chat AI Service with Advanced Sentiment Analysis and LLM Fallback
export class ChatAIService {
  static generateResponse(message: string, mode: string, _emotionalContext?: any): string {
    // Detect enhanced emotion
    const emotion = this.detectEnhancedEmotion(message)
    
    // First, try to find relevant knowledge
    const knowledgeResults = KnowledgeBase.searchKnowledge(message)
    
    if (knowledgeResults.length > 0) {
      return this.generateKnowledgeBasedResponse(message, knowledgeResults[0], mode, emotion)
    }
    
    // Fallback to general responses if no specific knowledge found
    return this.generateGeneralResponse(message, mode, emotion)
  }

  // Async version with LLM fallback support
  static async generateResponseWithLLM(message: string, mode: string, _emotionalContext?: any): Promise<{
    content: string
    usedLLM: boolean
    provider?: string
    knowledgeUsed: boolean
  }> {
    // Detect enhanced emotion
    const emotion = this.detectEnhancedEmotion(message)
    
    // First, try to find relevant knowledge
    const knowledgeResults = KnowledgeBase.searchKnowledge(message)
    
    // If we have good knowledge base results, use them
    if (knowledgeResults.length > 0) {
      return {
        content: this.generateKnowledgeBasedResponse(message, knowledgeResults[0], mode, emotion),
        usedLLM: false,
        knowledgeUsed: true
      }
    }
    
    // Check if we should use LLM fallback
    if (LLMService.isEnabled()) {
      try {
        const llmResponse = await LLMService.generateResponse(message, {
          mode,
          emotion
        })
        
        return {
          content: llmResponse.content,
          usedLLM: llmResponse.usedLLM,
          provider: llmResponse.provider,
          knowledgeUsed: false
        }
      } catch (error) {
        console.error('LLM fallback error:', error)
        // Fall through to general response
      }
    }
    
    // Final fallback to general responses
    return {
      content: this.generateGeneralResponse(message, mode, emotion),
      usedLLM: false,
      knowledgeUsed: false
    }
  }

  private static generateKnowledgeBasedResponse(
    _message: string, 
    knowledge: any, 
    mode: string, 
    emotion: string
  ): string {
    // Get emotion-specific intro phrase for the mode
    const introPhrase = this.getEmotionModePhrase(emotion, mode)
    
    let response = introPhrase + " "

    // Core knowledge content
    response += `**${knowledge.topic}**: ${knowledge.content}`

    // Add examples if available
    if (knowledge.examples && knowledge.examples.length > 0) {
      response += "\n\n**Examples:**\n"
      knowledge.examples.slice(0, 2).forEach((example: string, index: number) => {
        response += `${index + 1}. ${example}\n`
      })
    }

    // Add resource links if available
    if (knowledge.resources && knowledge.resources.length > 0) {
      response += "\n\n**📚 Helpful Resources:**\n"
      knowledge.resources.slice(0, 4).forEach((resource: string, index: number) => {
        // Extract domain name for display
        const domain = resource.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
        response += `${index + 1}. [${domain}](${resource})\n`
      })
    }

    // Add emotion-specific closing
    response += "\n\n" + this.getEmotionClosingPhrase(emotion, mode)

    return response
  }

  private static generateGeneralResponse(_message: string, mode: string, emotion: string): string {
    // Get emotion-specific intro phrase for the mode
    const introPhrase = this.getEmotionModePhrase(emotion, mode)
    
    const generalResponses = {
      supportive: "While I don't have specific information about this exact topic in my knowledge base, I'm here to support your learning journey. Can you tell me more about what specifically you'd like to understand?",
      analytical: "While this specific topic isn't in my current knowledge base, I can help you break down the problem and suggest a structured approach to finding the information you need.",
      creative: "While I don't have specific details on this topic, let's think creatively about how you might explore it. What if we approached this from a different angle?",
      'goal-focused': "While I don't have specific information on this subject, let's create an action plan to help you find the answers you need."
    }

    const baseResponse = generalResponses[mode as keyof typeof generalResponses] || generalResponses.supportive
    
    return introPhrase + " " + baseResponse + "\n\n" + this.getEmotionClosingPhrase(emotion, mode)
  }

  // Enhanced emotion detection with 4 specific emotions
  static detectEnhancedEmotion(message: string): string {
    const lowerMessage = message.toLowerCase()
    
    // SIGNIFICANTLY EXPANDED Keywords for each emotion
    const enthusiasticKeywords = [
      // Direct enthusiasm
      'excited', 'amazing', 'awesome', 'fantastic', 'love', 'great', 'wonderful', 
      'brilliant', 'perfect', 'excellent', 'thrilled', 'passionate', 'eager', 
      'motivated', 'inspired', 'can\'t wait', 'looking forward', 'pumped',
      // Learning enthusiasm
      'fascinated', 'incredible', 'outstanding', 'superb', 'marvelous', 'spectacular',
      'phenomenal', 'remarkable', 'extraordinary', 'mind-blowing', 'impressive',
      // Positive expressions
      'yes!', 'wow', 'cool!', 'nice!', 'sweet', 'epic', 'legendary', 'fire',
      // Achievement emotions
      'accomplished', 'proud', 'successful', 'victorious', 'triumphant',
      // Interest and curiosity
      'curious', 'intrigued', 'interested', 'keen', 'enthusiastic about'
    ]
    
    const confusedKeywords = [
      // Direct confusion
      'confused', 'don\'t understand', 'unclear', 'lost', 'stuck', 'help me', 
      'struggling', 'difficult', 'complicated', 'hard to understand',
      'puzzled', 'baffled', 'perplexed', 'can\'t figure out',
      // Learning difficulties
      'not understanding', 'don\'t get', 'doesn\'t make sense', 'no idea',
      'clueless', 'bewildered', 'mystified', 'stumped', 'at a loss',
      // Frustration with learning
      'frustrated', 'overwhelmed', 'stressed', 'anxious', 'worried',
      'intimidated', 'discouraged', 'defeated', 'hopeless',
      // Question patterns indicating confusion
      'what does', 'how do', 'why does', 'what is', 'how can', 'what are',
      'explain', 'clarify', 'help', 'assist', 'guide me', 'show me',
      // Negative learning experiences
      'hard', 'tough', 'challenging', 'tricky', 'complex', 'confusing',
      'makes no sense', 'over my head', 'too advanced', 'too fast',
      // Expressions of not knowing
      'no clue', 'haven\'t learned', 'never heard', 'unfamiliar',
      'foreign concept', 'greek to me', 'completely lost'
    ]
    
    const disinterestedKeywords = [
      // Direct disinterest
      'boring', 'uninterested', 'don\'t care', 'whatever', 'meh', 'i guess', 
      'fine', 'sure', 'not really', 'not interested', 'tedious', 
      'dull', 'bland', 'uninspiring', 'pointless', 'waste of time',
      // Reluctance
      'have to', 'forced to', 'supposed to', 'required to', 'need to',
      'should probably', 'might as well', 'i suppose', 'if i must',
      // Negative attitudes
      'hate', 'dislike', 'can\'t stand', 'annoying', 'irritating',
      'stupid', 'useless', 'worthless', 'meaningless', 'irrelevant',
      // Dismissive language
      'who cares', 'so what', 'big deal', 'not important', 'doesn\'t matter',
      'skip this', 'move on', 'get it over with', 'just finish',
      // Procrastination indicators
      'later', 'maybe tomorrow', 'not now', 'postpone', 'delay',
      'put off', 'avoid', 'skip', 'ignore'
    ]
    
    // Enhanced keyword matching with context awareness
    const enthusiasticCount = this.countKeywordMatchesEnhanced(lowerMessage, enthusiasticKeywords)
    const confusedCount = this.countKeywordMatchesEnhanced(lowerMessage, confusedKeywords)
    const disinterestedCount = this.countKeywordMatchesEnhanced(lowerMessage, disinterestedKeywords)
    
    // Determine emotion based on highest count, with minimum threshold
    const maxCount = Math.max(enthusiasticCount, confusedCount, disinterestedCount)
    
    // Lower threshold for better detection
    if (maxCount === 0) return 'neutral'
    
    if (enthusiasticCount === maxCount && enthusiasticCount > 0) return 'enthusiastic'
    if (confusedCount === maxCount && confusedCount > 0) return 'confused'
    if (disinterestedCount === maxCount && disinterestedCount > 0) return 'disinterested'
    
    return 'neutral'
  }
  
  // Enhanced keyword matching with better context awareness
  private static countKeywordMatchesEnhanced(message: string, keywords: string[]): number {
    let totalScore = 0
    
    keywords.forEach(keyword => {
      // Handle multi-word phrases differently
      if (keyword.includes(' ')) {
        // For phrases, check if the entire phrase exists
        if (message.includes(keyword)) {
          totalScore += 2 // Higher weight for phrase matches
        }
      } else {
        // For single words, use word boundary matching
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        if (regex.test(message)) {
          totalScore += 1
        }
      }
    })
    
    // Additional context-based scoring
    // Negative patterns that indicate confusion
    const confusionPatterns = [
      /not understanding/i,
      /don't get/i,
      /doesn't make sense/i,
      /no idea/i,
      /can't figure/i,
      /what (?:is|are|does|do)/i,
      /how (?:do|does|can|to)/i,
      /why (?:is|are|does|do)/i
    ]
    
    // Question patterns that often indicate confusion
    const questionPatterns = [
      /\?/,  // Contains question mark
      /^(what|how|why|when|where|who)/i  // Starts with question word
    ]
    
    // If we're checking confused keywords, boost score for confusion patterns
    if (keywords.includes('confused') || keywords.includes('not understanding')) {
      confusionPatterns.forEach(pattern => {
        if (pattern.test(message)) {
          totalScore += 1
        }
      })
      
      questionPatterns.forEach(pattern => {
        if (pattern.test(message)) {
          totalScore += 0.5
        }
      })
    }
    
    return totalScore
  }

  // Get emotion and mode specific intro phrases
  private static getEmotionModePhrase(emotion: string, mode: string): string {
    const phrases = {
      enthusiastic: {
        supportive: "🎉 I absolutely love your enthusiasm! You're going to do amazing with this topic.",
        analytical: "🔥 Your excitement is contagious! Let me channel that energy into a systematic breakdown.",
        creative: "✨ Your passion is inspiring! Let's dive into this with some creative exploration.",
        'goal-focused': "🚀 That enthusiasm will fuel your success! Let's harness it to achieve your learning goals."
      },
      confused: {
        supportive: "💙 I can sense you're feeling a bit lost, and that's completely okay! Everyone feels confused when learning something new.",
        analytical: "🧠 I understand the confusion - let me break this down step by step to make it crystal clear.",
        creative: "💡 Confusion often leads to the best breakthroughs! Let's approach this from a fresh perspective.",
        'goal-focused': "🎯 Feeling confused is part of the learning process! Let's create a clear path forward."
      },
      neutral: {
        supportive: "😊 I'm here to help you learn about this topic in a comfortable, supportive way.",
        analytical: "📊 Let me provide you with a clear, systematic explanation of this concept.",
        creative: "🌟 Let's explore this topic together with some interesting insights and perspectives.",
        'goal-focused': "🎯 Perfect! Let's focus on getting you the knowledge you need to reach your objectives."
      },
      disinterested: {
        supportive: "🌱 I understand this might not seem exciting right now, but I believe I can help you find the value in it.",
        analytical: "📈 Even if this seems dry, understanding it can be surprisingly useful - let me show you why.",
        creative: "🎨 I know this might seem boring, but let me present it in a way that might spark your interest.",
        'goal-focused': "⚡ This knowledge might be more valuable than it appears - let me show you its practical applications."
      }
    }
    
    return phrases[emotion as keyof typeof phrases]?.[mode as keyof typeof phrases.enthusiastic] || 
           phrases.neutral[mode as keyof typeof phrases.neutral] || 
           phrases.neutral.supportive
  }

  // Get emotion-specific closing phrases
  private static getEmotionClosingPhrase(emotion: string, mode: string): string {
    const closingPhrases = {
      enthusiastic: {
        supportive: "Keep that amazing energy going! You're on the right track! 🌟",
        analytical: "Your enthusiasm combined with systematic learning will take you far! 📈",
        creative: "That passion will fuel incredible innovations! Keep exploring! 🚀",
        'goal-focused': "Channel that excitement into focused practice - you'll achieve great things! 🎯"
      },
      confused: {
        supportive: "Remember, every expert was once a beginner. You've got this! 💪",
        analytical: "Take it one step at a time, and the pieces will fall into place. 🧩",
        creative: "Confusion is just curiosity in disguise - embrace it! 🌈",
        'goal-focused': "Each question brings you closer to mastery. Keep asking! 📚"
      },
      neutral: {
        supportive: "Feel free to ask if you need any clarification! 😊",
        analytical: "Let me know if you'd like me to elaborate on any part. 📋",
        creative: "I'm here if you want to explore this topic further! 🔍",
        'goal-focused': "Ready to tackle the next step when you are! ⏭️"
      },
      disinterested: {
        supportive: "Sometimes the most unexpected topics become our favorites! Give it a chance. 🌻",
        analytical: "The practical benefits might surprise you once you see the full picture. 💎",
        creative: "There's often hidden beauty in topics that seem mundane at first glance. ✨",
        'goal-focused': "This knowledge might be the key that unlocks your next opportunity! 🗝️"
      }
    }
    
    return closingPhrases[emotion as keyof typeof closingPhrases]?.[mode as keyof typeof closingPhrases.enthusiastic] || 
           closingPhrases.neutral[mode as keyof typeof closingPhrases.neutral] || 
           closingPhrases.neutral.supportive
  }

  // Legacy method for backward compatibility
  static detectEmotion(message: string) {
    const enhancedEmotion = this.detectEnhancedEmotion(message)
    
    // Map enhanced emotions to simple sentiment for backward compatibility
    switch (enhancedEmotion) {
      case 'enthusiastic': return 'positive'
      case 'confused': return 'negative'
      case 'disinterested': return 'negative'
      default: return 'neutral'
    }
  }

  // Suggest follow-up questions based on the conversation
  static generateFollowUpSuggestions(lastMessage: string): string[] {
    const knowledgeResults = KnowledgeBase.searchKnowledge(lastMessage)
    
    if (knowledgeResults.length > 0) {
      const knowledge = knowledgeResults[0]
      return [
        `Can you explain more about ${knowledge.relatedTopics?.[0] || 'related concepts'}?`,
        `What are some practical examples of ${knowledge.topic.toLowerCase()}?`,
        `How does this connect to my career goals?`,
        `What should I learn next after mastering this?`
      ]
    }
    
    return [
      "What specific aspect would you like to explore further?",
      "How does this relate to your learning goals?",
      "Can you give me an example of what you're trying to understand?",
      "What's the most challenging part about this topic for you?"
    ]
  }
}

// Opportunity Matching AI Service
export class OpportunityAIService {
  static calculateRelevance(userProfile: any, opportunity: any): number {
    let score = 50 // Base score

    // Match skills
    if (userProfile.skills && opportunity.requirements) {
      const skillMatches = userProfile.skills.filter((skill: any) =>
        opportunity.requirements.some((req: string) =>
          req.toLowerCase().includes(skill.name.toLowerCase())
        )
      )
      score += skillMatches.length * 15
    }

    return Math.min(Math.max(score, 0), 100)
  }
}

export default {
  CareerAIService,
  StudyAIService,
  MentorAIService,
  ChatAIService,
  OpportunityAIService
}