import type { Metadata } from 'next'
import RadioArchivePage from '@/components/RadioArchivePage'

export const metadata: Metadata = {
  title: 'Radio Tan Haw — Archive',
  description: 'Short musical episodes by Tan Haw',
}

export default function RadioPage() {
  return <RadioArchivePage />
}
