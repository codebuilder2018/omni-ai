'use client'
import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import AiMultiModel from './AiMultiModel'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/Firebase'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

function ChatInputBox() {
  const [userInput, setUserInput] =  useState('')
  const [chatId, setChatId] =  useState()
  const {user} = useUser()
  const { messages, setMessages,  aiSelectedModels, setAiSelectedModels } = useContext(AiSelectedModelContext)

  const params = useSearchParams()

  useEffect(() => {
    const id = params.get('chatId')
    if (id) {
        setChatId(id);
    }  else {
        setChatId(uuidv4())
        //below needs to tested
        setMessages({})
    }
  }, [params])

  useEffect(() => {
    if (!chatId) return;
    GetMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    setChatId(uuidv4());

    // 1️⃣ Add user message to all enabled models
    setMessages((prev) => {
        const updated = { ...prev };
        Object.keys(aiSelectedModels).forEach((modelKey) => {
            if(aiSelectedModels[modelKey].enable) {
                updated[modelKey] = [
                    ...(updated[modelKey] ?? []),
                    { role: "user", content: userInput },
                ];
            }
        });
        return updated;
    });

    const currentInput = userInput; // capture before reset
    setUserInput("");

    // 2️⃣ Fetch response from each enabled model
    Object.entries(aiSelectedModels).forEach(async ([parentModel, modelInfo]) => {
        if (!modelInfo.modelId || aiSelectedModels[parentModel].enable == false) return;

        // Add loading placeholder before API call
        setMessages((prev) => ({
        ...prev,
        [parentModel]: [
            ...(prev[parentModel] ?? []),
            {
            role: "assistant",
            content: "loading",
            model: parentModel,
            loading: true,
            },
        ],
        }));

        try {
        const result = await axios.post("/api/ai-multi-model", {
            model: modelInfo.modelId,
            message: [{ role: "user", content: currentInput }],
            parentModel,
        });

        const { aiResponse, model } = result.data;

        // 3️⃣ Add AI response to that model’s messages
        setMessages((prev) => {
            const updated = [...(prev[parentModel] ?? [])];
            const loadingIndex = updated.findIndex((m) => m.loading);

            if (loadingIndex !== -1) {
            updated[loadingIndex] = {
                role: "assistant",
                content: aiResponse,
                model,
                loading: false,
            };
            } else {
            // fallback if no loading msg found
            updated.push({
                role: "assistant",
                content: aiResponse,
                model,
                loading: false,
            });
            }

            return { ...prev, [parentModel]: updated };
        });
        } catch (err) {
        console.error(err);
        setMessages((prev) => ({
            ...prev,
            [parentModel]: [
            ...(prev[parentModel] ?? []),
            { role: "assistant", content: "⚠️ Error fetching response." },
            ],
        }));
        } finally {
            console.log(messages)
        }
    });
    }

    useEffect(() => {
        if (!chatId || !user || Object.keys(messages).length === 0) 
            return;
        SaveMessages()      
    }, [messages])

    const SaveMessages = async () => {
        const docRef = doc(db, 'chatHistory', chatId)

        await setDoc(docRef, {
            chatId: chatId,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            messages: messages,
            lastUpdated: Date.now()
        },  { merge: true } )
    }

    const GetMessages = async () => {
        if (!chatId) return;
        const docRef = doc(db, 'chatHistory', chatId);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data())
        const docData = docSnap.data()
        setMessages(docData?.messages ?? {});
    }

  return (
    <div className='relative min-h-screen'>
        {/* Page Conent */}
        <div>
            <AiMultiModel />
        </div>

        {/* Fixed Chat Input */}
        <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4'>
            <div className='w-full rounded-xl border shadow-md max-w-2xl p-4'>
            <input 
                type='text' 
                value={userInput}
                className='border-0 outline-none w-full' 
                placeholder='Ask me anything...' 
                onChange={(e)=>setUserInput(e.target.value)}
            />
            <div className='flex justify-between items-center mt-3'>
                <Button variant={'ghost'} size={'icon'}>
                    <Paperclip className='h-5 w-5' />
                </Button>
                <div className='flex gap-5'>
                    <Button variant={'ghost'} size={'icon'}>
                        <Mic className='h-5 w-5' />
                    </Button>
                    <Button size={'icon'} className='bg-purple-500' onClick={handleSend}>
                        <Send />
                    </Button>
                </div>
            </div>
            </div>
        </div>
    </div>

  )
}

export default ChatInputBox
