"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  isAuthenticated: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [lastTokenRefresh, setLastTokenRefresh] = useState<number>(0)

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error)
          } else {
            console.log('Initial session:', session?.user?.email || 'No session')
          }
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          console.log('Auth state change:', event, session?.user?.email || 'No user')
          
          if (event === 'TOKEN_REFRESHED') {
            const now = Date.now()
            const timeSinceLastRefresh = now - lastTokenRefresh
            
            // Ignore rapid-fire token refreshes (less than 5 seconds apart)
            if (timeSinceLastRefresh < 5000) {
              console.log('Ignoring rapid token refresh event (too soon)')
              return
            }
            
            setLastTokenRefresh(now)
            console.log('Token refreshed successfully')
          }
          
          if (event === 'SIGNED_OUT') {
            console.log('User signed out')
            setSession(null)
            setUser(null)
            setLoading(false)
            return
          }
          
          if (session) {
            // Log session expiry info for debugging
            if (session.expires_at) {
              const expiresAt = new Date(session.expires_at * 1000)
              const now = new Date()
              const timeUntilExpiry = expiresAt.getTime() - now.getTime()
              const minutesUntilExpiry = Math.floor(timeUntilExpiry / 1000 / 60)
              console.log('Raw session expires_at:', session.expires_at);
              console.log('Session expires in', minutesUntilExpiry, 'minutes at', expiresAt.toLocaleTimeString(),'current time:', now.toLocaleTimeString())
              
              
              // Only log warning if expiry is soon
              if (minutesUntilExpiry < 5) {
                console.warn('⚠️ Session expires soon!')
              }
            }
            
            console.log('✅ Session accepted for user:', session.user.email)
            setSession(session)
            setUser(session.user)
          } else {
            console.log('No session received')
            setSession(null)
            setUser(null)
          }
          
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      })
      return { error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error)
      } else {
        console.log('Sign in successful')
      }
      
      return { error }
    } catch (error) {
      console.error('Sign in exception:', error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
      } else {
        console.log('Sign out successful')
      }
      
      return { error }
    } catch (error) {
      console.error('Sign out exception:', error)
      return { error: error as AuthError }
    }
  }

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
