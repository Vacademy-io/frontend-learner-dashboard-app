'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { PanelLeft } from 'lucide-react'
import { QuestionNavigator } from './question-navigator'

// interface SidebarProps {
//   className?: string
// }

// export function Sidebar({ className }: SidebarProps) {
//   const [open, setOpen] = React.useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-40 md:hidden">
//           <PanelLeft className="h-4 w-4" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-80">
//         <QuestionNavigator />
//       </SheetContent>
//       <div className={cn("hidden md:block", className)}>
//         <QuestionNavigator />
//       </div>
//     </Sheet>
//   )
// }




interface SidebarProps {
  className?: string
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ className, isOpen, onClose }: SidebarProps) {
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-80">
          <QuestionNavigator onClose={onClose} />
        </SheetContent>
      </Sheet>
      <div className={cn("hidden md:block", className)}>
        <QuestionNavigator onClose={onClose} />
      </div>
    </>
  )
}

