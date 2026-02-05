import { useState, useEffect, useRef } from 'react'
import { Search, X, Users, Briefcase, MessageSquare, BookOpen, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'mentor' | 'opportunity' | 'community' | 'course' | 'career'
  url: string
  metadata?: {
    company?: string
    location?: string
    expertise?: string[]
    salary?: string
    category?: string
  }
}

// Mock search data - in real app this would come from API
const mockSearchData: SearchResult[] = [
  {
    id: '1',
    title: 'Sarah Chen - Senior Software Engineer',
    description: 'Full-stack developer with 8 years experience at Google and Meta',
    type: 'mentor',
    url: '/mentor-finder',
    metadata: {
      company: 'Meta',
      expertise: ['React', 'Node.js', 'System Design']
    }
  },
  {
    id: '2',
    title: 'Frontend Developer Internship',
    description: 'Summer internship program at Microsoft for React developers',
    type: 'opportunity',
    url: '/opportunities',
    metadata: {
      company: 'Microsoft',
      location: 'Seattle, WA',
      salary: '$7,000/month'
    }
  },
  {
    id: '3',
    title: 'How to ace technical interviews?',
    description: 'Community discussion about preparing for FAANG interviews',
    type: 'community',
    url: '/community',
    metadata: {
      category: 'Career Advice'
    }
  },
  {
    id: '4',
    title: 'React Fundamentals Course',
    description: 'Complete guide to React hooks, state management, and best practices',
    type: 'course',
    url: '/study-buddy',
    metadata: {
      expertise: ['React', 'JavaScript']
    }
  },
  {
    id: '5',
    title: 'Data Science Career Path',
    description: 'Complete roadmap for becoming a data scientist with Python and ML',
    type: 'career',
    url: '/career-guidance',
    metadata: {
      expertise: ['Python', 'Machine Learning', 'Statistics']
    }
  }
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'mentor': return Users
    case 'opportunity': return Briefcase
    case 'community': return MessageSquare
    case 'course': return BookOpen
    case 'career': return GraduationCap
    default: return Search
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'mentor': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
    case 'opportunity': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
    case 'community': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
    case 'course': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
    case 'career': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    // Simulate API call
    const timer = setTimeout(() => {
      const filtered = mockSearchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.metadata?.expertise?.some(skill => 
          skill.toLowerCase().includes(query.toLowerCase())
        )
      )
      setResults(filtered)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!isOpen) {
          // This would be handled by parent component
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
        <Card className="mx-4 shadow-2xl">
          <CardContent className="p-0">
            {/* Search Input */}
            <div className="flex items-center border-b border-border px-4 py-4">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search mentors, opportunities, courses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  {results.map((result) => {
                    const Icon = getTypeIcon(result.type)
                    return (
                      <Link
                        key={result.id}
                        to={result.url}
                        onClick={onClose}
                        className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-foreground truncate">
                                {result.title}
                              </h3>
                              <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                                {result.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {result.description}
                            </p>
                            {result.metadata && (
                              <div className="flex flex-wrap gap-1">
                                {result.metadata.company && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.metadata.company}
                                  </Badge>
                                )}
                                {result.metadata.location && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.metadata.location}
                                  </Badge>
                                )}
                                {result.metadata.salary && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.metadata.salary}
                                  </Badge>
                                )}
                                {result.metadata.expertise?.slice(0, 2).map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : query.trim() ? (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No results found for "{query}"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try searching for mentors, opportunities, or courses
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Start typing to search</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Find mentors, opportunities, courses, and more
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Press ESC to close</span>
                <span>⌘K to search</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}