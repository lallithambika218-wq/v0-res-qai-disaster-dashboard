import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ResQAI - Dashboard | Disaster Response AI',
  description: 'AI-powered disaster management dashboard for real-time risk analysis, resource allocation, and shelter recommendations.',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
