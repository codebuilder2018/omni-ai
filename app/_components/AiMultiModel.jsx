'use client'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import AiModelList from '@/shared/AiModelList'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Loader, Lock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { useUser } from '@clerk/nextjs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function AiMultiModel() {
  const [aiModelList, setAiModelList] = useState(AiModelList)
  const { messages, setMessages,  aiSelectedModels, setAiSelectedModels } = useContext(AiSelectedModelContext)
  const {user} = useUser()

  const onToggleChange=(model,value)=>{
    setAiModelList((prev)=>
        prev.map((m)=>
        m.model===model ? { ...m, enable: value } : m
        )
    )
    /*setAiSelectedModels((prev)=>
        prev.map((m)=>m.model===model?{...m,enable:value}:m)   
    )*/
   setAiSelectedModels((prev) => ({
        ...prev,
        [model]: {
            ...(prev?.[model] ?? {}),
            enable: value
        }
    }))
  }

  //console.log(aiSelectedModels)

  const onSelecteValue= async(parentModel,value)=>{
    setAiSelectedModels((prev)=>({
        ...prev,
        [parentModel]:{
        modelId:value
        }
    }))
  }


  return (
    <div className='flex flex-1 h-[75vh] border-b'>
        {aiModelList.map((model, index) => (
            <div key={index} className={`flex flex-col border-r h-full overflow-auto ${model.enable?'flex-1 min-w-[400px]':'w-[100px] flex-none'}`}>
                <div className='w-full flex justify-between items-center borber-b p-4 h-[50px] gap-2 shadow'>
                    <div className='flex items-center gap-4'>
                        <Image src={model.icon} alt={model.model}
                        width={24} height={24}
                        />
                        {model.enable &&
                            <Select 
                                disabled={model.premium}
                                defaultValue={aiSelectedModels[model.model].modelId} 
                                onValueChange={(value)=>onSelecteValue(model.model,value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={aiSelectedModels[model.model].modelId} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className='px-3'>
                                        <SelectLabel>Free</SelectLabel>
                                    {model.subModel.map((subModel,index)=> subModel.premium == false && (
                                        <SelectItem key={index} value={subModel.id}>{subModel.name}</SelectItem>
                                    ))}                                        
                                    </SelectGroup>
                                    <SelectGroup className='px-3'>
                                        <SelectLabel>Premium</SelectLabel>
                                    {model.subModel.map((subModel,index)=> subModel.premium == true && (
                                        <SelectItem key={index} value={subModel.id} disabled>{subModel.name}<Lock className='h-4 w-4'/></SelectItem>
                                    ))}                                        
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        }
                    </div>
                    <div>
                        {model.enable ? (
                            <Switch checked={model.enable} onCheckedChange={(v)=>onToggleChange(model.model, v)}/>
                        ) : (
                            <MessageSquare onClick={(v)=>onToggleChange(model.model, true)}/>
                        )}
                        
                    </div>
                </div>
                {model.premium && model.enable &&
                    <div className='flex items-center justify-center h-full'>
                        <Button><Lock/>Upgrade to unlock</Button>
                    </div>
                }
                { model.enable && <div className='flex-1 p-4'>
                    <div className='flex-1 p-4 space-y-2'>
                        {messages[model.model]?.map((m,i)=>(
                        <div key={i}
                            className={`p-2 rounded-md ${
                            m.role=="user"
                                ? "bg-blue-100 text-blue-900"
                                : "bg-gray-100 text-gray-900"
                            }`}
                        >
                            {m.role=='assistant'&&(
                                <span className='text-sm text-gray-400'>{m.model??model.model}</span>
                            )}
                            <div className='flex gap-3 items-center'>
                                {m.content == "loading" && <><Loader className='animate-spin'/><span>Thinking...</span></>}
                             </div>
                                {m?.content != "loading" && m?.content &&
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {m.content}
                                    </ReactMarkdown>
                                }
                           
                        </div>
                        ))}
                    </div>
                </div> }
            </div>
        ))}
    </div>
  )
}

export default AiMultiModel
