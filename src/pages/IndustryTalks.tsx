import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Heart,
  Share2,
  BookmarkPlus,
  Search,
  Video,
  Building,
  Star
} from 'lucide-react'
import { format } from 'date-fns'

interface IndustryTalk {
  id: string
  title: string
  description: string
  speaker: {
    name: string
    title: string
    company: string
    avatar: string
    rating: number
    expertise: string[]
  }
  scheduledFor: Date
  duration: number // minutes
  attendees: number
  maxAttendees: number
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  isLive: boolean
  isUpcoming: boolean
  recordingUrl?: string
  tags: string[]
  price: number // 0 for free
}

// Mock data for industry talks
const mockTalks: IndustryTalk[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications at Meta',
    description: 'Learn how Meta engineers build and maintain React applications that serve billions of users. We\'ll cover performance optimization, state management, and architectural patterns.',
    speaker: {
      name: 'Sarah Chen',
      title: 'Senior Software Engineer',
      company: 'Meta',
      avatar: '',
      rating: 4.9,
      expertise: ['React', 'JavaScript', 'System Design']
    },
    scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    duration: 60,
    attendees: 234,
    maxAttendees: 500,
    category: 'Frontend Development',
    level: 'Advanced',
    isLive: false,
    isUpcoming: true,
    tags: ['React', 'Performance', 'Architecture'],
    price: 0
  },
  {
    id: '2',
    title: 'Machine Learning in Production: Lessons from Netflix',
    description: 'Discover how Netflix uses machine learning to power recommendations, content optimization, and user experience. Real-world case studies and practical insights.',
    speaker: {
      name: 'Dr. Michael Rodriguez',
      title: 'Principal ML Engineer',
      company: 'Netflix',
      avatar: '',
      rating: 4.8,
      expertise: ['Machine Learning', 'Python', 'Data Science']
    },
    scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    duration: 90,
    attendees: 456,
    maxAttendees: 1000,
    category: 'Machine Learning',
    level: 'Intermediate',
    isLive: false,
    isUpcoming: true,
    tags: ['ML', 'Production', 'Recommendations'],
    price: 29
  },
  {
    id: '3',
    title: 'DevOps Culture at Spotify: From Code to Production',
    description: 'Explore Spotify\'s DevOps practices, CI/CD pipelines, and how they maintain high velocity with reliability. Perfect for aspiring DevOps engineers.',
    speaker: {
      name: 'Emma Thompson',
      title: 'DevOps Lead',
      company: 'Spotify',
      avatar: '',
      rating: 4.7,
      expertise: ['DevOps', 'Kubernetes', 'CI/CD']
    },
    scheduledFor: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday (recorded)
    duration: 75,
    attendees: 678,
    maxAttendees: 800,
    category: 'DevOps',
    level: 'Intermediate',
    isLive: false,
    isUpcoming: false,
    recordingUrl: '/recordings/devops-spotify',
    tags: ['DevOps', 'Kubernetes', 'CI/CD'],
    price: 0
  },
  {
    id: '4',
    title: 'Product Management at Airbnb: From Idea to Impact',
    description: 'Join Airbnb\'s VP of Product for an inside look at product strategy, user research, and how to build products that scale globally.',
    speaker: {
      name: 'James Park',
      title: 'VP of Product',
      company: 'Airbnb',
      avatar: '',
      rating: 4.9,
      expertise: ['Product Management', 'Strategy', 'User Research']
    },
    scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    duration: 60,
    attendees: 123,
    maxAttendees: 300,
    category: 'Product Management',
    level: 'Beginner',
    isLive: false,
    isUpcoming: true,
    tags: ['Product', 'Strategy', 'Leadership'],
    price: 49
  },
  {
    id: '5',
    title: 'LIVE: Cybersecurity Trends 2024 - Q&A with Google Security',
    description: 'Live discussion about emerging cybersecurity threats, best practices, and career opportunities in security. Interactive Q&A session included.',
    speaker: {
      name: 'Alex Kumar',
      title: 'Security Engineer',
      company: 'Google',
      avatar: '',
      rating: 4.8,
      expertise: ['Cybersecurity', 'Threat Analysis', 'Security Architecture']
    },
    scheduledFor: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    duration: 45,
    attendees: 89,
    maxAttendees: 200,
    category: 'Cybersecurity',
    level: 'Intermediate',
    isLive: true,
    isUpcoming: true,
    tags: ['Security', 'Trends', 'Live Q&A'],
    price: 0
  }
]

export function IndustryTalks() {
  const [talks, setTalks] = useState<IndustryTalk[]>(mockTalks)
  const [filteredTalks, setFilteredTalks] = useState<IndustryTalk[]>(mockTalks)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false)

  const categories = ['All', ...Array.from(new Set(talks.map(talk => talk.category)))]
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    let filtered = talks

    if (searchQuery) {
      filtered = filtered.filter(talk =>
        talk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talk.speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talk.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(talk => talk.category === selectedCategory)
    }

    if (selectedLevel !== 'All') {
      filtered = filtered.filter(talk => talk.level === selectedLevel)
    }

    if (showUpcomingOnly) {
      filtered = filtered.filter(talk => talk.isUpcoming)
    }

    setFilteredTalks(filtered)
  }, [talks, searchQuery, selectedCategory, selectedLevel, showUpcomingOnly])

  const handleRegister = (talkId: string) => {
    setTalks(talks.map(talk => 
      talk.id === talkId 
        ? { ...talk, attendees: talk.attendees + 1 }
        : talk
    ))
    // In real app, this would make an API call
    console.log(`Registered for talk ${talkId}`)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-hero p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Industry Insider Talks
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from industry leaders at top tech companies. Get insider insights, 
            ask questions, and accelerate your career with real-world knowledge.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search talks, speakers, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {/* Upcoming Only Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUpcomingOnly}
                onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Upcoming only</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Talks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTalks.map((talk) => (
          <Card key={talk.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {talk.isLive && (
                      <Badge className="bg-red-500 text-white animate-pulse">
                        🔴 LIVE
                      </Badge>
                    )}
                    <Badge className={getLevelColor(talk.level)}>
                      {talk.level}
                    </Badge>
                    <Badge variant="outline">{talk.category}</Badge>
                  </div>
                  <CardTitle className="text-lg mb-2">{talk.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {talk.description}
                  </CardDescription>
                </div>
                {talk.price > 0 && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">${talk.price}</div>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {/* Speaker Info */}
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={talk.speaker.avatar} alt={talk.speaker.name} />
                  <AvatarFallback>
                    {talk.speaker.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-foreground">{talk.speaker.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-muted-foreground">{talk.speaker.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{talk.speaker.title}</p>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>{talk.speaker.company}</span>
                  </div>
                </div>
              </div>

              {/* Talk Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{format(talk.scheduledFor, 'MMM dd, yyyy')}</span>
                  <Clock className="w-4 h-4 ml-4" />
                  <span>{talk.duration} min</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{talk.attendees} / {talk.maxAttendees} attendees</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {talk.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {talk.isUpcoming ? (
                    <Button
                      onClick={() => handleRegister(talk.id)}
                      className="flex items-center space-x-2"
                      disabled={talk.attendees >= talk.maxAttendees}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>
                        {talk.attendees >= talk.maxAttendees ? 'Full' : 'Register'}
                      </span>
                    </Button>
                  ) : talk.recordingUrl ? (
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Watch Recording</span>
                    </Button>
                  ) : null}
                  
                  {talk.isLive && (
                    <Button className="flex items-center space-x-2 bg-red-500 hover:bg-red-600">
                      <Video className="w-4 h-4" />
                      <span>Join Live</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTalks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No talks found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms to find more talks.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}