'use client'

import { FontProvider } from '@/context/font-context'
import { ThemeProvider } from '@/context/theme-context'
import ContentSection from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export default function SettingsAppearance() {
  return (
    <ThemeProvider>
      <FontProvider>
        <ContentSection
          title='Appearance'
          desc='Customize the appearance of the app. Automatically switch between day
          and night themes.'
        >
          <AppearanceForm />
        </ContentSection>
      </FontProvider>
    </ThemeProvider>
  )
}
