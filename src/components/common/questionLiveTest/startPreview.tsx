'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from '@tanstack/react-router'

export default function StartPage() {
    const router = useRouter()
  
    const handleStartPreview = () => {
      router.push('/?preview=true')
    }
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Assessment Preview</h1>
          <Button onClick={handleStartPreview} size="lg">
            Start Preview
          </Button>
        </div>
      </div>
    )
  }