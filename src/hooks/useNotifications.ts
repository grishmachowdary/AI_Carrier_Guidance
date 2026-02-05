import { useState, useEffect } from 'react'
import { NotificationService, type Notification } from '@/services/notificationService'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load initial notifications
    setNotifications(NotificationService.getNotifications())
    setUnreadCount(NotificationService.getUnreadCount())

    // Subscribe to changes
    const unsubscribe = NotificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications)
      setUnreadCount(NotificationService.getUnreadCount())
    })

    return unsubscribe
  }, [])

  const markAsRead = (id: string) => {
    NotificationService.markAsRead(id)
  }

  const markAllAsRead = () => {
    NotificationService.markAllAsRead()
  }

  const clearAll = () => {
    NotificationService.clearAll()
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll
  }
}