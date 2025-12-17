import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

function AppHeader() {
  return (
    <div className='p-3 w-full shadow flex items-center justify-between'>
      <SidebarTrigger />
    </div>
  )
}

export default AppHeader
