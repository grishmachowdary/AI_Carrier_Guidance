import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar, 
  BookOpen, 
  Users, 
  MessageCircle,
  Flame,
  Star,
  ArrowRight,
  Briefcase,
  Heart,
  Zap,
  Video
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { OpportunityService, type DynamicOpportunity } from '@/services/opportunityService'
import { useUserData } from '@/hooks/useUserData'

// Mock data - in real app this would come from API/context
const mockUserData = {
  name: 'User',
  level: 5,
  xp: 1250,
  xpToNext: 1500,
  streak: 7,
  longestStreak: 15,
  completedMilestones: 12,
  totalMilestones: 20,
  weeklyGoal: {
    target: 5,
    current: 3,
    description: 'Study sessions this week'
  },
  recentAchievements: [
    { id: '1', name: 'Quick Learner', description: 'Completed 5 sessions in a day', icon: '⚡', unlockedAt: new Date() },
    { id: '2', name: 'Mentor Connector', description: 'Connected with your first mentor', icon: '🤝', unlockedAt: new Date() },
    { id: '3', name: 'Streak Master', description: 'Maintained a 7-day streak', icon: '🔥', unlockedAt: new Date() }
  ],
  upcomingMilestones: [
    { id: '1', title: 'Complete React Fundamentals', progress: 75, estimatedHours: 2 },
    { id: '2', title: 'Practice Technical Interviews', progress: 40, estimatedHours: 5 },
    { id: '3', title: 'Build Portfolio Project', progress: 20, estimatedHours: 12 }
  ],
  recentActivity: [
    { type: 'study', description: 'Completed JavaScript Arrays quiz', time: '2 hours ago' },
    { type: 'mentor', description: 'New message from Sarah Chen', time: '4 hours ago' },
    { type: 'achievement', description: 'Unlocked "Quick Learner" badge', time: '1 day ago' },
    { type: 'community', description: 'Posted progress update', time: '2 days ago' }
  ]
}

const quickActions = [
  { title: 'Continue Learning', description: 'Resume your current study session', icon: BookOpen, href: '/study-buddy', color: 'bg-blue-500' },
  { title: 'Find Mentors', description: 'Connect with industry experts', icon: Users, href: '/mentor-finder', color: 'bg-green-500' },
  { title: 'AI Chat', description: 'Get personalized guidance', icon: MessageCircle, href: '/chat', color: 'bg-purple-500' },
  { title: 'Career Quiz', description: 'Discover your ideal path', icon: Target, href: '/career-guidance', color: 'bg-orange-500' },
  { title: 'Industry Talks', description: 'Learn from tech leaders', icon: Video, href: '/industry-talks', color: 'bg-indigo-500' },
  { title: 'Health Hub', description: 'Monitor your physical and mental wellness', icon: Heart, href: '/health', color: 'bg-red-500' }
]

export function Dashboard() {
  const [topOpportunities, setTopOpportunities] = useState<DynamicOpportunity[]>([])
  const { user } = useUserData()

  useEffect(() => {
    loadTopOpportunities()
  }, [user])

  const loadTopOpportunities = async () => {
    try {
      const userProfile = user ? {
        careerPath: user.profile.careerGoals?.[0] || 'Full-Stack Software Engineer',
        experienceLevel: user.profile.experienceLevel,
        skills: user.profile.skills?.map(s => s.name) || []
      } : { 
        careerPath: 'Full-Stack Software Engineer', 
        experienceLevel: 'junior',
        skills: ['JavaScript', 'React', 'Node.js']
      }
      
      const opportunities = await OpportunityService.fetchDynamicOpportunities(userProfile)
      setTopOpportunities(opportunities.slice(0, 3)) // Top 3 matches
    } catch (error) {
      console.error('Failed to load opportunities:', error)
    }
  }
  const progressToNext = (mockUserData.xp / mockUserData.xpToNext) * 100
  const weeklyProgress = (mockUserData.weeklyGoal.current / mockUserData.weeklyGoal.target) * 100

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="glass-hero p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-3">
              Welcome back, <span className="text-gradient">{mockUserData.name}</span>! 👋
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: '#000000' }}>
              Ready to continue your learning journey? You're doing great!
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <div className="badge-primary">
              <Star className="w-4 h-4 mr-2" />
              Level {mockUserData.level}
            </div>
            <div className="badge-warning">
              <Flame className="w-4 h-4 mr-2" />
              {mockUserData.streak} day streak
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold" style={{ color: '#000000' }}>Experience Points</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gradient mb-3">{mockUserData.xp} XP</div>
            <Progress value={progressToNext} className="h-2 mb-3" />
            <p className="text-sm" style={{ color: '#000000' }}>
              {mockUserData.xpToNext - mockUserData.xp} XP to Level {mockUserData.level + 1}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold" style={{ color: '#000000' }}>Learning Streak</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">{mockUserData.streak} days</div>
            <p className="text-sm" style={{ color: '#000000' }}>
              Best: <span className="font-semibold">{mockUserData.longestStreak} days</span>
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold" style={{ color: '#000000' }}>Milestones</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-3">
              {mockUserData.completedMilestones}/{mockUserData.totalMilestones}
            </div>
            <Progress 
              value={(mockUserData.completedMilestones / mockUserData.totalMilestones) * 100} 
              className="h-2" 
            />
          </CardContent>
        </Card>

        <Card className="glass-card hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold" style={{ color: '#000000' }}>Weekly Goal</CardTitle>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-3">
              {mockUserData.weeklyGoal.current}/{mockUserData.weeklyGoal.target}
            </div>
            <Progress value={weeklyProgress} className="h-2 mb-3" />
            <p className="text-sm" style={{ color: '#000000' }}>
              {mockUserData.weeklyGoal.description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card animate-scale-in">
        <CardHeader>
          <CardTitle className="heading-tertiary flex items-center">
            <Zap className="w-6 h-6 mr-3 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription className="" style={{ color: '#000000' }}>
            Jump into your learning activities with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid-cards">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  asChild
                  variant="outline"
                  className="card-interactive h-auto p-6 flex flex-col items-center space-y-4 border-2 hover:border-primary/30"
                >
                  <Link to={action.href}>
                    <div className={`w-14 h-14 ${action.color} rounded-xl flex-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold" style={{ color: '#000000' }}>{action.title}</div>
                      <div className="text-sm mt-1" style={{ color: '#000000' }}>{action.description}</div>
                    </div>
                  </Link>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid-features">
        {/* Recent Achievements */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="heading-tertiary flex items-center">
              <Award className="w-6 h-6 mr-3 text-yellow-500" />
              Recent Achievements
            </CardTitle>
            <CardDescription className="" style={{ color: '#000000' }}>
              Your latest accomplishments and milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUserData.recentAchievements.map((achievement) => (
              <div key={achievement.id} className="glass-subtle p-4 hover-lift">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex-center text-2xl shadow-lg">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: '#000000' }}>{achievement.name}</div>
                    <div className="text-sm" style={{ color: '#000000' }}>{achievement.description}</div>
                  </div>
                  <div className="badge-success">New</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="btn-secondary w-full">
              View All Achievements
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="heading-tertiary flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-500" />
              Upcoming Milestones
            </CardTitle>
            <CardDescription className="" style={{ color: '#000000' }}>
              Your next learning goals and objectives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockUserData.upcomingMilestones.map((milestone) => (
              <div key={milestone.id} className="space-y-3">
                <div className="flex-between">
                  <div className="font-semibold" style={{ color: '#000000' }}>{milestone.title}</div>
                  <div className="badge-secondary">
                    {milestone.estimatedHours}h left
                  </div>
                </div>
                <Progress value={milestone.progress} className="h-3" />
                <div className="text-sm" style={{ color: '#000000' }}>
                  {milestone.progress}% complete
                </div>
              </div>
            ))}
            <Button variant="outline" className="btn-secondary w-full">
              View Learning Path
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Opportunities */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="heading-tertiary flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-purple-500" />
            🎯 Smart Opportunities
          </CardTitle>
          <CardDescription className="" style={{ color: '#000000' }}>
            AI-matched opportunities based on your profile and career goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topOpportunities.length > 0 ? (
            <>
              {topOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="glass-subtle p-4 hover-lift">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold" style={{ color: '#000000' }}>{opportunity.title}</h4>
                        <div className="badge-success">
                          {opportunity.relevanceScore}% match
                        </div>
                      </div>
                      <p className="text-sm mb-3" style={{ color: '#000000' }}>{opportunity.organization}</p>
                      <div className="flex items-center space-x-4 text-sm" style={{ color: '#000000' }}>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span className="capitalize">{opportunity.type}</span>
                        </div>
                        <div className="capitalize">{opportunity.level}</div>
                        {opportunity.remote && <span className="badge-primary">Remote</span>}
                      </div>
                    </div>
                    <Button size="sm" className="btn-primary">
                      View Details
                    </Button>
                  </div>
                  {opportunity.aiInsights && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                      <div className="flex items-start space-x-2">
                        <Zap className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">{opportunity.aiInsights.matchReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Button asChild variant="outline" className="btn-secondary w-full">
                <Link to="/opportunities">
                  View All Opportunities
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="" style={{ color: '#000000' }}>Loading personalized opportunities...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}