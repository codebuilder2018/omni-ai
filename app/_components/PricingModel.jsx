import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PricingTable } from '@clerk/nextjs'

function PricingModel({children}) {
  return (
    <Dialog>
        <DialogTrigger className='w-full'>
            <div className='w-full'>
                {children}
            </div>
        </DialogTrigger>
        <DialogContent className='min-w-4xl'>
            <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>
                <PricingTable />
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>

  )
}

export default PricingModel
