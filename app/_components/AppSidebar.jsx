'use client'
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SignInButton, useUser } from "@clerk/nextjs"
import { Moon, Sun, User2, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import CreditUsuage from "./CreditUsuage"

export function AppSidebar() {
  const {theme, setTheme} = useTheme()
  const {user} = useUser()
  return (
    <Sidebar>
      <SidebarHeader >
        <div className="p-3">
            <div className="flex justify-between items-center">
                <div className="flex items-cnter gap-3">
                    <Image src={'/logo.svg'} alt="logo" width={60} height={60}
                        className="w-[40px] h-[40px]"
                    />
                    <h2 className="font-bold text-xl">Omni Ai</h2>
                </div>
                <div>
                    {theme =='light' ? (
                        <Button variant="ghost" onClick={()=>setTheme('dark')}><Sun /></Button>
                        ) : (
                            <Button variant="ghost" onClick={()=>setTheme('light')}><Moon /></Button>
                        )
                    }
                </div>
            </div>
            { user ? (
                <Button className='mt-7 w-full'>+ New Chat</Button>
              ) : (
                <SignInButton mode='modal'>
                  <Button className='mt-7 w-full'>Sign In</Button>
                </SignInButton>
              )
            }
            
        </div>
     </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <div className="p-3">
                <h2 className="font-bold text-lg">Chat</h2>
                { !user && <p className='text-sm text-gray-400'>Sign in to start chat with Omni Ai</p> }
            </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className='p-3 mb-10'>
        { !user ? (
            <SignInButton mode='modal'>
              <Button className='w-full'>Sign In / Sign Up</Button>
            </SignInButton>
          ) : (
            <div>
              <CreditUsuage />
              <Button className="w-full mb-3" ><Zap/>Upgrade Plan</Button>
              <Button className="flex" variant="ghost">
                <User2/><h2>Settings</h2>
              </Button>
            </div>
          )
        }
           
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}