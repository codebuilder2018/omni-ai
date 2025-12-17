'use client'
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { db } from '@/config/Firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { DefaultModel } from '@/shared/AiModels'
import { UserDetailContext } from '@/context/UserDetailContext'

function Provider({children,  ...props}) {
  const {user} = useUser()
  const [aiSelectedModels,setAiSelectedModels]=useState(DefaultModel)
  const [userDetail,setUserDetail]=useState()

  useEffect(()=>{
    if(user)
    {
      CreateNewUser();
    }
  },[user])
  
  const CreateNewUser = async()=> {
    //If user exists
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress)
    const userSnap=await getDoc(userRef);

    if(userSnap.exists())
    {
      console.log('Existing User');
      const userInfo = userSnap.data();
      setAiSelectedModels(userInfo?.selectedModelPref);
      setUserDetail(userInfo);
      return ;
    } else {
      //New User
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg: 5, //free user
        plan: 'free',
        credits:100 //paid user
      }
      await setDoc(userRef, userData)
      setUserDetail(userData);
      console.log('New User data saved')
    }

    
  }

  return (
    <NextThemesProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...props}
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <AiSelectedModelContext.Provider value={{ aiSelectedModels, setAiSelectedModels }}>
          <SidebarProvider>
            <AppSidebar />
            <div className='w-full'>
              <AppHeader />
              {children}
            </div>
          </SidebarProvider>
        </AiSelectedModelContext.Provider>
      </UserDetailContext.Provider>
    </NextThemesProvider>
  )
}

export default Provider
