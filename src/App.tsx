import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navbar } from '@/components/Navbar'
import { LandingPage } from '@/pages/LandingPage'
import { Dashboard } from '@/pages/Dashboard'
import { CareerGuidance } from '@/pages/CareerGuidance'
import { MentorFinder } from '@/pages/MentorFinder'
import { StudyBuddy } from '@/pages/StudyBuddy'
import { AIChat } from '@/pages/AIChat'
import { Community } from '@/pages/Community'
import { Opportunities } from '@/pages/Opportunities'
import { Health } from '@/pages/Health'
import { IndustryTalks } from '@/pages/IndustryTalks'
import { initializeMockData } from '@/services/mockData'
import { NotificationService } from '@/services/notificationService'
import { useEffect } from 'react'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

function App() {
  useEffect(() => {
    // Initialize mock data on app start
    initializeMockData()
    
    // Initialize notification service
    NotificationService.init()
    
    // Request notification permission
    NotificationService.requestPermission()
    
    // Simulate some notifications for demo
    setTimeout(() => {
      NotificationService.simulateMentorMessage('Sarah Chen')
    }, 3000)
    
    setTimeout(() => {
      NotificationService.simulateAchievement('Quick Learner')
    }, 8000)
    
    setTimeout(() => {
      NotificationService.simulateOpportunity('Frontend Developer Internship at Google')
    }, 15000)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
          <Navbar />
          <main 
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
            style={{
              backgroundImage: 'url(/bg.png)',
              minHeight: 'calc(100vh - 80px)' // Subtract navbar height
            }}
          >
            {/* Light overlay for better readability */}
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[0.5px]" />
            
            <div className="relative z-10 py-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/career-guidance" element={<CareerGuidance />} />
                <Route path="/mentor-finder" element={<MentorFinder />} />
                <Route path="/study-buddy" element={<StudyBuddy />} />
                <Route path="/chat" element={<AIChat />} />
                <Route path="/community" element={<Community />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/health" element={<Health />} />
                <Route path="/industry-talks" element={<IndustryTalks />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
