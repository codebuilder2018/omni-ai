'use client'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function Home() {
  const {setTheme} = useTheme()
  return (
    <div>
      <h2>Hi! Every one...</h2>
      <Button onClick={()=> setTheme('dark')}>Dark Theme</Button>
      <Button onClick={()=> setTheme('light')}>Light Theme</Button>
    </div>
  );
}
