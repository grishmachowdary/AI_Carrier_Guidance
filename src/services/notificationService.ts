export interface Notification {
  id: string
  title: string
  message: string
  type: 'streak' | 'mentor' | 'achievement' | 'reminder' | 'opportunity'
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export class NotificationService {
  private static notifications: Notification[] = []
  private static listeners: ((notifications: Notification[]) => void)[] = []

  // Request permission for browser notifications
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  // Show browser notification
  static async showBrowserNotification(title: string, message: string, icon?: string) {
    const hasPermission = await this.requestPermission()
    
    if (hasPermission) {
      const notification = new Notification(title, {
        body: message,
        icon: icon || '/logo.png',
        badge: '/logo.png',
        tag: 'mentorx-notification',
        requireInteraction: false,
        silent: false
      })

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000)

      return notification
    }
  }

  // Add notification to in-app list
  static addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }

    this.notifications.unshift(newNotification)
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50)
    }

    // Save to localStorage
    localStorage.setItem('mentorx-notifications', JSON.stringify(this.notifications))
    
    // Notify listeners
    this.notifyListeners()

    // Show browser notification
    this.showBrowserNotification(notification.title, notification.message)
  }

  // Get all notifications
  static getNotifications(): Notification[] {
    return this.notifications
  }

  // Get unread count
  static getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  // Mark notification as read
  static markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      localStorage.setItem('mentorx-notifications', JSON.stringify(this.notifications))
      this.notifyListeners()
    }
  }

  // Mark all as read
  static markAllAsRead() {
    this.notifications.forEach(n => n.read = true)
    localStorage.setItem('mentorx-notifications', JSON.stringify(this.notifications))
    this.notifyListeners()
  }

  // Clear all notifications
  static clearAll() {
    this.notifications = []
    localStorage.removeItem('mentorx-notifications')
    this.notifyListeners()
  }

  // Subscribe to notification changes
  static subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Notify all listeners
  private static notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications))
  }

  // Load notifications from localStorage
  static loadNotifications() {
    try {
      const stored = localStorage.getItem('mentorx-notifications')
      if (stored) {
        this.notifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  // Initialize notification service
  static init() {
    this.loadNotifications()
    this.setupStreakReminders()
    this.setupDailyReminders()
  }

  // Setup streak reminders
  private static setupStreakReminders() {
    // Check if user hasn't been active today
    const checkStreak = () => {
      const lastActivity = localStorage.getItem('last-activity')
      const today = new Date().toDateString()
      
      if (lastActivity !== today) {
        const currentHour = new Date().getHours()
        
        // Send reminder at 7 PM if no activity today
        if (currentHour === 19) {
          this.addNotification({
            title: '🔥 Don\'t break your streak!',
            message: 'You haven\'t studied today. Keep your learning streak alive!',
            type: 'streak',
            actionUrl: '/study-buddy'
          })
        }
      }
    }

    // Check every hour
    setInterval(checkStreak, 60 * 60 * 1000)
  }

  // Setup daily reminders
  private static setupDailyReminders() {
    const sendDailyReminder = () => {
      const hour = new Date().getHours()
      
      // Morning motivation at 9 AM
      if (hour === 9) {
        this.addNotification({
          title: '🌅 Good morning!',
          message: 'Start your day with a quick study session or career planning.',
          type: 'reminder',
          actionUrl: '/dashboard'
        })
      }
      
      // Evening reflection at 8 PM
      if (hour === 20) {
        this.addNotification({
          title: '🌙 Evening reflection',
          message: 'How was your learning today? Check your progress and plan tomorrow.',
          type: 'reminder',
          actionUrl: '/dashboard'
        })
      }
    }

    // Check every hour
    setInterval(sendDailyReminder, 60 * 60 * 1000)
  }

  // Simulate mentor message notification
  static simulateMentorMessage(mentorName: string) {
    this.addNotification({
      title: `💬 New message from ${mentorName}`,
      message: 'You have a new message from your mentor. Check it out!',
      type: 'mentor',
      actionUrl: '/mentor-finder'
    })
  }

  // Simulate achievement notification
  static simulateAchievement(achievementName: string) {
    this.addNotification({
      title: '🏆 Achievement Unlocked!',
      message: `Congratulations! You've earned "${achievementName}"`,
      type: 'achievement',
      actionUrl: '/dashboard'
    })
  }

  // Simulate opportunity notification
  static simulateOpportunity(opportunityTitle: string) {
    this.addNotification({
      title: '💼 New Opportunity Match!',
      message: `"${opportunityTitle}" matches your profile. Apply now!`,
      type: 'opportunity',
      actionUrl: '/opportunities'
    })
  }
}