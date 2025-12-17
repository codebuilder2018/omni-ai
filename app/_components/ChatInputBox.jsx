import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React from 'react'
import AiMultiModel from './AiMultiModel'

function ChatInputBox() {
  return (
    <div className='relative min-h-screen'>
        {/* Page Conent */}
        <div>
            <AiMultiModel />
        </div>

        {/* Fixed Chat Input */}
        <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4'>
            <div className='w-full rounded-xl border shadow-md max-w-2xl p-4'>
            <input type='text' className='border-0 outline-none' placeholder='Ask me anything...' />
            <div className='flex justify-between items-center mt-3'>
                <Button variant={'ghost'} size={'icon'}>
                    <Paperclip className='h-5 w-5' />
                </Button>
                <div className='flex gap-5'>
                    <Button variant={'ghost'} size={'icon'}>
                        <Mic className='h-5 w-5' />
                    </Button>
                    <Button size={'icon'} className='bg-purple-500'>
                        <Send  />
                    </Button>
                </div>
            </div>
            </div>
        </div>
    </div>

  )
}

export default ChatInputBox
