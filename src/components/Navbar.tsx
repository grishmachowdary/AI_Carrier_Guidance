import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Home, 
  BookOpen, 
  Users, 
  GraduationCap, 
  MessageCircle, 
  Users2, 
  Briefcase,
  Menu,
  X,
  Heart,
  Moon,
  Sun,
  Search,
  Video
} from 'lucide-react'
import { useState } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'
import { GlobalSearch } from '@/components/GlobalSearch'
import { NotificationDropdown } from '@/components/NotificationDropdown'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Career Guidance', href: '/career-guidance', icon: GraduationCap },
  { name: 'Find Mentors', href: '/mentor-finder', icon: Users },
  { name: 'Study Buddy', href: '/study-buddy', icon: BookOpen },
  { name: 'AI Chat', href: '/chat', icon: MessageCircle },
  { name: 'Community', href: '/community', icon: Users2 },
  { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
  { name: 'Industry Talks', href: '/industry-talks', icon: Video },
  { name: 'Health', href: '/health', icon: Heart },
]

export function Navbar() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  
  // Mock user data - in real app this would come from auth context
  const user = {
    name: 'Alex Johnson',
    avatar: '',
    level: 5,
    xp: 1250,
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left Side */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-all duration-300">
              <img 
                src="/logo.png" 
                alt="MentorX Logo" 
                className="w-12 h-12 object-contain"
              />
              <span className="text-2xl font-bold text-gradient text-foreground">MentorX</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-4xl mx-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* User Profile & Actions - Right Side */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hover:scale-105 transition-all duration-300 text-muted-foreground hover:text-foreground"
            >
              <Search className="w-4 h-4 mr-2" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden xl:inline-flex ml-2 pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </Button>
            <NotificationDropdown />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hover:scale-105 transition-all duration-300"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <div className="flex items-center space-x-3">
              <div className="badge-primary">
                Level {user.level}
              </div>
              <span className="font-medium text-sm text-foreground">
                {user.xp} XP
              </span>
            </div>
            <Avatar className="w-10 h-10 ring-2 ring-primary/20 hover:scale-105 transition-all duration-300">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="hover:scale-105 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hover:scale-105 transition-all duration-300"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:scale-105 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Mobile User Info */}
              <div className="flex items-center justify-between px-4 py-4 mt-4 border-t border-border">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">Level {user.level} • {user.xp} XP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Global Search Modal */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </nav>
  )
}