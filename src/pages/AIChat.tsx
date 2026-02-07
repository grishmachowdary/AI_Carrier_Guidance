import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Heart, 
  Brain, 
  Lightbulb,
  Target,
  Smile,
  Frown,
  Meh,
  BookOpen,
  Zap,
  TrendingUp,
  Users,
  RefreshCw,
  Sparkles,
  Star,
  HelpCircle,
  Coffee,
  ExternalLink,
  Settings
} from 'lucide-react'
import { ChatAIService } from '@/services/aiServices'
import KnowledgeBase from '@/services/knowledgeBase'
import { LLMSettings } from '@/components/LLMSettings'

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  emotionalContext?: {
    sentiment: 'positive' | 'neutral' | 'negative'
    emotions: string[]
    confidence: number
    enhancedEmotion?: string
  }
  coachingMode?: string
  knowledgeUsed?: boolean
  resourcesIncluded?: boolean
  followUpSuggestions?: string[]
  usedLLM?: boolean
  llmProvider?: string
}

const coachingModes = [
  { 
    id: 'supportive', 
    name: 'Supportive', 
    icon: Heart, 
    color: 'bg-pink-500', 
    description: 'Encouraging and empathetic guidance with emotional support' 
  },
  { 
    id: 'analytical', 
    name: 'Analytical', 
    icon: Brain, 
    color: 'bg-blue-500', 
    description: 'Data-driven insights with systematic problem-solving' 
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    icon: Lightbulb, 
    color: 'bg-yellow-500', 
    description: 'Innovative solutions and out-of-the-box thinking' 
  },
  { 
    id: 'goal-focused', 
    name: 'Goal-Focused', 
    icon: Target, 
    color: 'bg-green-500', 
    description: 'Achievement-oriented coaching with actionable steps' 
  }
]

const quickStartQuestions = [
  "I'm so excited to learn about machine learning! Can you help me?", // Enthusiastic
  "I'm really confused about React hooks, can you explain them?", // Confused  
  "What are the fundamentals of programming?", // Neutral
  "I guess I should learn about APIs or whatever...", // Disinterested
  "How do I prepare for technical interviews?", // Neutral - will show resources
  "I'm struggling with JavaScript closures, they're so hard to understand!", // Confused
  "This is amazing! I love how React components work!", // Enthusiastic - will show resources
  "What study techniques work best for programming?" // Neutral - will show resources
]

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "🎓 Welcome to your AI Mentor! I'm powered by a comprehensive knowledge base covering programming, web development, data science, career development, and study techniques. I can adapt my coaching style to match your needs and provide detailed, educational responses. What would you like to learn about today?",
      sender: 'ai',
      timestamp: new Date(),
      coachingMode: 'supportive',
      knowledgeUsed: false
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedMode, setSelectedMode] = useState('supportive')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickStart, setShowQuickStart] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Use enhanced emotion detection
    const detectedEmotion = ChatAIService.detectEnhancedEmotion(userMessage)
    
    const emotionalContext = {
      sentiment: ChatAIService.detectEmotion(userMessage) as 'positive' | 'neutral' | 'negative',
      emotions: [detectedEmotion, 'helpful'],
      confidence: 0.85,
      enhancedEmotion: detectedEmotion
    }

    // Try to use LLM fallback if enabled
    try {
      const result = await ChatAIService.generateResponseWithLLM(userMessage, selectedMode, emotionalContext)
      const followUpSuggestions = ChatAIService.generateFollowUpSuggestions(userMessage)
      
      // Check if resources are included
      const knowledgeResults = KnowledgeBase.searchKnowledge(userMessage)
      const resourcesIncluded = result.knowledgeUsed && knowledgeResults[0]?.resources && knowledgeResults[0].resources.length > 0

      return {
        id: Date.now().toString(),
        content: result.content,
        sender: 'ai',
        timestamp: new Date(),
        emotionalContext,
        coachingMode: selectedMode,
        knowledgeUsed: result.knowledgeUsed,
        resourcesIncluded,
        followUpSuggestions: followUpSuggestions.slice(0, 3),
        usedLLM: result.usedLLM,
        llmProvider: result.provider
      }
    } catch (error) {
      // Fallback to synchronous method if async fails
      const response = ChatAIService.generateResponse(userMessage, selectedMode, emotionalContext)
      const followUpSuggestions = ChatAIService.generateFollowUpSuggestions(userMessage)
      
      const knowledgeResults = KnowledgeBase.searchKnowledge(userMessage)
      const knowledgeUsed = knowledgeResults.length > 0
      const resourcesIncluded = knowledgeUsed && knowledgeResults[0]?.resources && knowledgeResults[0].resources.length > 0

      return {
        id: Date.now().toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        emotionalContext,
        coachingMode: selectedMode,
        knowledgeUsed,
        resourcesIncluded,
        followUpSuggestions: followUpSuggestions.slice(0, 3),
        usedLLM: false
      }
    }
  }

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage
    if (!messageToSend.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setShowQuickStart(false)
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(messageToSend)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input simulation
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        setInputMessage("How do I improve my programming skills?")
      }, 3000)
    }
  }

  const getSentimentIcon = (sentiment: string, enhancedEmotion?: string) => {
    // Use enhanced emotion if available
    if (enhancedEmotion) {
      switch (enhancedEmotion) {
        case 'enthusiastic': return <Star className="w-4 h-4 text-yellow-500" />
        case 'confused': return <HelpCircle className="w-4 h-4 text-orange-500" />
        case 'disinterested': return <Coffee className="w-4 h-4 text-gray-500" />
        case 'neutral': return <Meh className="w-4 h-4 text-blue-500" />
        default: return <Meh className="w-4 h-4 text-gray-500" />
      }
    }
    
    // Fallback to basic sentiment
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4 text-green-500" />
      case 'negative': return <Frown className="w-4 h-4 text-red-500" />
      default: return <Meh className="w-4 h-4 text-gray-500" />
    }
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "🎓 Chat cleared! I'm ready to help you with any questions about programming, career development, study techniques, or technology. What would you like to explore?",
      sender: 'ai',
      timestamp: new Date(),
      coachingMode: selectedMode,
      knowledgeUsed: false
    }])
    setShowQuickStart(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl text-center border border-blue-100">
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6" style={{ color: '#000000' }}>
          🤖 AI Mentor <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Chat</span>
        </h1>
        <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#000000' }}>
          Your intelligent learning companion with advanced emotion detection (Enthusiastic, Confused, Neutral, Disinterested) and personalized coaching responses. Powered by comprehensive knowledge with curated resource links for deeper learning.
        </p>
      </div>

      {/* Knowledge Base Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg rounded-xl border border-gray-200 text-center hover:shadow-xl transition-all duration-300 group">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
              {KnowledgeBase.getCategories().length}
            </div>
            <div className="text-sm font-semibold text-gray-700">Knowledge Areas</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg rounded-xl border border-gray-200 text-center hover:shadow-xl transition-all duration-300 group">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">50+</div>
            <div className="text-sm font-semibold text-gray-700">Topics Covered</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg rounded-xl border border-gray-200 text-center hover:shadow-xl transition-all duration-300 group">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">4</div>
            <div className="text-sm font-semibold text-gray-700">Coaching Modes</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg rounded-xl border border-gray-200 text-center hover:shadow-xl transition-all duration-300 group">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">∞</div>
            <div className="text-sm font-semibold text-gray-700">Learning Paths</div>
          </CardContent>
        </Card>
      </div>

      {/* Coaching Mode Selection */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
            Choose Your AI Coaching Style
          </CardTitle>
          <CardDescription>
            Select the coaching approach that matches your current learning needs and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coachingModes.map((mode) => {
              const Icon = mode.icon
              return (
                <div
                  key={mode.id}
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                    selectedMode === mode.id 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xl transform scale-105' 
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  {/* Selection Indicator */}
                  {selectedMode === mode.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    selectedMode === mode.id ? 'bg-white/20' : mode.color
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <h3 className={`font-bold text-lg mb-2 ${
                      selectedMode === mode.id ? 'text-white' : 'text-gray-900'
                    }`}>
                      {mode.name}
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                      selectedMode === mode.id ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      {mode.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resource Links Feature */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center" style={{ color: '#000000' }}>
            📚 Curated Learning Resources
          </CardTitle>
          <CardDescription style={{ color: '#000000' }}>
            Get direct links to the best learning resources for every topic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <ExternalLink className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Official Documentation</div>
              <div className="text-xs text-gray-600 mt-1">MDN, React Docs, Python.org</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Interactive Tutorials</div>
              <div className="text-xs text-gray-600 mt-1">FreeCodeCamp, Codecademy, Khan Academy</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Practice Platforms</div>
              <div className="text-xs text-gray-600 mt-1">LeetCode, HackerRank, Kaggle</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Emotion Detection Demo */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center" style={{ color: '#000000' }}>
            🎭 Advanced Emotion Detection
          </CardTitle>
          <CardDescription style={{ color: '#000000' }}>
            Our AI detects 4 specific emotions and adapts responses accordingly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Enthusiastic</div>
              <div className="text-xs text-gray-600 mt-1">Excited, passionate, eager</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
              <HelpCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Confused</div>
              <div className="text-xs text-gray-600 mt-1">Lost, struggling, unclear</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
              <Meh className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Neutral</div>
              <div className="text-xs text-gray-600 mt-1">Balanced, calm, focused</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
              <Coffee className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Disinterested</div>
              <div className="text-xs text-gray-600 mt-1">Bored, unengaged, reluctant</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LLM Settings */}
      {showSettings && (
        <div className="animate-in slide-in-from-top duration-300">
          <LLMSettings />
        </div>
      )}

      {/* Quick Start Questions */}
      {showQuickStart && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center" style={{ color: '#000000' }}>
              🚀 Quick Start - Popular Questions
            </CardTitle>
            <CardDescription style={{ color: '#000000' }}>
              Click any question to get started with our AI mentor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {quickStartQuestions.map((question, index) => (
                <div
                  key={index}
                  className="group cursor-pointer bg-white border border-blue-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all duration-200"
                  onClick={() => handleSendMessage(question)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 leading-relaxed">
                        {question}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-0">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">AI Mentor</div>
                  <div className="text-sm text-gray-600">
                    Mode: {coachingModes.find(m => m.id === selectedMode)?.name} • Knowledge-Powered
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={clearChat}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Chat
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSettings(!showSettings)}
                className={showSettings ? 'bg-blue-50 border-blue-300' : ''}
              >
                <Settings className="w-4 h-4 mr-2" />
                LLM Settings
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {message.sender === 'ai' ? (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600">U</AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className={`rounded-lg p-4 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                      : 'bg-gray-50 border'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                    
                    {message.sender === 'ai' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {message.emotionalContext && getSentimentIcon(
                              message.emotionalContext.sentiment, 
                              message.emotionalContext.enhancedEmotion
                            )}
                            <span className="text-xs text-gray-500">
                              {message.emotionalContext?.enhancedEmotion || message.emotionalContext?.sentiment} detected
                            </span>
                            {message.knowledgeUsed && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <BookOpen className="w-3 h-3 mr-1" />
                                Knowledge Used
                              </Badge>
                            )}
                            {message.resourcesIncluded && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Resources Included
                              </Badge>
                            )}
                            {message.usedLLM && (
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                LLM {message.llmProvider ? `(${message.llmProvider})` : ''}
                              </Badge>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {message.coachingMode}
                          </Badge>
                        </div>
                        
                        {/* Follow-up Suggestions */}
                        {message.followUpSuggestions && message.followUpSuggestions.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-600 mb-2">💡 Follow-up questions:</div>
                            <div className="space-y-1">
                              {message.followUpSuggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-2 text-xs text-left justify-start w-full hover:bg-blue-50"
                                  onClick={() => handleSendMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <Avatar className="w-8 h-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  </Avatar>
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about programming, career development, study techniques, or technology..."
                  className="w-full p-3 pr-12 border border-gray-200 rounded-lg bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  style={{ minHeight: '60px', maxHeight: '120px' }}
                />
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVoiceInput}
                className={`h-12 w-12 ${isListening ? 'bg-red-500 text-white' : 'hover:bg-blue-50'}`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={!inputMessage.trim() || isTyping}
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            {isListening && (
              <div className="mt-3 flex items-center space-x-2 text-sm text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>Listening... (simulated voice input)</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Categories */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
            Available Knowledge Areas
          </CardTitle>
          <CardDescription>
            I have comprehensive knowledge in these areas and can provide detailed, educational responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {KnowledgeBase.getCategories().map((category, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1 hover:bg-blue-50 cursor-pointer">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}