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
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-all duration-300">
              <img 
                src="/logo.png" 
                alt="MentorX Logo" 
                className="w-10 h-10 object-contain flex-shrink-0"
              />
              <span className="text-xl font-bold text-foreground hidden sm:block">MentorX</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden xl:flex items-center justify-center flex-1 max-w-5xl mx-6">
            <div className="flex items-center space-x-1 bg-muted/30 rounded-full p-1">
              {navigation.slice(0, 6).map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-full font-medium transition-all duration-300 text-xs whitespace-nowrap ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-background/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden 2xl:inline">{item.name}</span>
                  </Link>
                )
              })}
              
              {/* More Menu for remaining items */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs text-muted-foreground hover:text-foreground"
                >
                  <span>More</span>
                </Button>
                <div className="navbar-dropdown absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                  {navigation.slice(6).map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`navbar-dropdown-item ${
                          isActive(item.href) ? 'bg-primary/10 text-primary' : 'text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Large screens navigation (for screens between lg and xl) */}
          <div className="hidden lg:flex xl:hidden items-center justify-center flex-1 max-w-4xl mx-4">
            <div className="flex items-center space-x-0.5">
              {navigation.slice(0, 4).map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center justify-center p-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                    title={item.name}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                )
              })}
              
              {/* Dropdown for remaining items */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-muted-foreground hover:text-foreground"
                  title="More options"
                >
                  <Menu className="w-4 h-4" />
                </Button>
                <div className="navbar-dropdown absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                  {navigation.slice(4).map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`navbar-dropdown-item ${
                          isActive(item.href) ? 'bg-primary/10 text-primary' : 'text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Actions & User Profile - Right Side */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="hover:scale-105 transition-all duration-300 hidden sm:flex"
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Notifications */}
            <div className="hidden sm:block">
              <NotificationDropdown />
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hover:scale-105 transition-all duration-300"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* User Stats - Hidden on smaller screens */}
            <div className="hidden lg:flex items-center space-x-2 ml-2">
              <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                L{user.level}
              </div>
              <span className="text-xs text-muted-foreground font-medium hidden xl:inline">
                {user.xp} XP
              </span>
            </div>

            {/* User Avatar */}
            <Avatar className="w-8 h-8 ring-2 ring-primary/20 hover:scale-105 transition-all duration-300 ml-2">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:scale-105 transition-all duration-300 ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-2">
              {/* Search Bar for Mobile */}
              <Button
                variant="outline"
                onClick={() => {
                  setIsSearchOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="w-full justify-start text-muted-foreground"
              >
                <Search className="w-4 h-4 mr-3" />
                <span>Search everything...</span>
                <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
              </Button>

              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex flex-col items-center space-y-2 p-3 rounded-lg font-medium transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs text-center leading-tight">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
              
              {/* Mobile User Info */}
              <div className="flex items-center justify-between p-4 mt-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">Level {user.level} • {user.xp} XP</p>
                  </div>
                </div>
                <div className="sm:hidden">
                  <NotificationDropdown />
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