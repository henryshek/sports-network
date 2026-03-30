import { useState, useEffect } from 'react'
import { User, Event, Club } from '@/types'
import { Calendar, Users, MessageSquare, Trophy, Zap, ArrowRight } from 'lucide-react'

interface HomeProps {
  user: User
  onNavigate: (page: string) => void
}

export default function Home({ user, onNavigate }: HomeProps) {


  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-lg text-muted">Find sports events, join clubs, and connect with athletes in your area</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'Events', value: '12', color: 'bg-primary/10 text-primary' },
          { icon: Users, label: 'Clubs', value: '5', color: 'bg-success/10 text-success' },
          { icon: MessageSquare, label: 'Messages', value: '8', color: 'bg-warning/10 text-warning' },
          { icon: Trophy, label: 'Joined', value: '3', color: 'bg-error/10 text-error' }
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className={`${stat.color} rounded-xl p-6`}>
              <Icon size={32} className="mb-2" />
              <p className="text-sm opacity-75">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>



      {/* Features Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Why Sports Social?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Quick & Easy', desc: 'Find and join events in seconds' },
            { icon: Users, title: 'Community', desc: 'Connect with athletes near you' },
            { icon: Trophy, title: 'Track Progress', desc: 'Build your sports profile' }
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="text-center">
                <Icon size={40} className="text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
