import { MaintenanceError } from '@/features/errors/maintenance-error'

export const metadata = {
  title: '503 - Service Temporarily Unavailable',
  description: 'Our system is currently undergoing scheduled maintenance',
}

export default function MaintenancePage() {
  return <MaintenanceError />
}
