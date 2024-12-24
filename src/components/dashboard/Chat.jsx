import React, { useEffect, useState } from 'react';
import { AiOutlineMessage, AiOutlinePlus } from 'react-icons/ai'
import { GrEmoji } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import { add_friend, send_message, messageClear } from '../../store/reducers/chatReducer';

const socket = io('http://localhost:5000')

const Chat = () => {
    const dispatch = useDispatch()
    const { sellerId } = useParams()
    const { userInfo } = useSelector(state => state.auth)
    const { fb_messages, currentFd, my_friends, successMessage } = useSelector(state => state.chat)
    const [text, setText] = useState('')

    useEffect(() => {
        if (userInfo?.id) {
            socket.emit('add_user', userInfo.id, userInfo)
        }
    }, [userInfo])

    useEffect(() => {
        if (sellerId && userInfo?.id) {
            dispatch(add_friend({
                sellerId,
                userId: userInfo.id
            }))
        }
    }, [sellerId, userInfo])

    useEffect(() => {
        if (successMessage) {
            setText('')
            dispatch(messageClear())
        }
    }, [successMessage])

    const send = async () => {
        if (text.trim() && sellerId && userInfo?.id) {
            // Log the data being sent
            console.log('Sending message:', {
                userId: userInfo.id,
                text: text.trim(),
                sellerId: sellerId,
                name: userInfo.name
            })
    
            dispatch(send_message({
                userId: userInfo.id,
                text: text.trim(),
                sellerId: sellerId,
                name: userInfo.name
            }))
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
        }
    }

    return (
        <div className='bg-white p-3 rounded-md'>
            <div className='w-full flex'>
                <div className='w-[230px]'>
                    <div className='flex justify-center gap-3 items-center text-slate-600 text-xl h-[50px]'>
                        <span><AiOutlineMessage /></span>
                        <span>Message</span>
                    </div>
                    <div className='w-full flex flex-col text-slate-600 py-4 h-[400px] pr-3 overflow-y-auto'>
                        {my_friends.map((f, i) => (
                            <Link 
                                to={`/dashboard/chat/${f.fdId}`} 
                                key={i}  
                                className={`flex gap-2 justify-start items-center pl-2 py-[5px] ${sellerId === f.fdId ? 'bg-slate-100' : ''}`}
                            >
                                <div className='w-[30px] h-[30px] rounded-full relative'>
                                    <div className='w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0'></div>
                                    <img src={f.image || '/images/user.png'} alt="" className='w-full h-full rounded-full' />
                                </div>
                                <span>{f.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className='w-[calc(100%-230px)]'>
                    {currentFd ? (
                        <div className='w-full h-full'>
                            <div className='flex justify-start gap-3 items-center text-slate-600 text-xl h-[50px]'>
                                <div className='w-[30px] h-[30px] rounded-full relative'>
                                    <div className='w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0'></div>
                                    <img src={currentFd.image || '/images/user.png'} alt="" className='w-full h-full rounded-full' />
                                </div>
                                <span>{currentFd.name}</span>
                            </div>
                            <div className='h-[400px] w-full bg-slate-100 p-3 rounded-md'>
                                <div className='w-full h-full overflow-y-auto flex flex-col gap-3'>
                                    {fb_messages.map((m, i) => (
                                        <div key={i} className={`w-full flex gap-2 ${m.senderId === userInfo.id ? 'justify-end' : 'justify-start'} items-center text-[14px]`}>
                                            <img 
                                                className='w-[30px] h-[30px] rounded-full' 
                                                src="/images/user.png" 
                                                alt="" 
                                            />
                                            <div className={`p-2 ${m.senderId === userInfo.id ? 'bg-cyan-500' : 'bg-purple-500'} text-white rounded-md`}>
                                                <span>{m.message}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex p-2 justify-between items-center w-full'>
                                <div className='w-[40px] h-[40px] border p-2 justify-center items-center flex rounded-full'>
                                    <label className='cursor-pointer' htmlFor="file-input"><AiOutlinePlus /></label>
                                    <input id="file-input" className='hidden' type="file" />
                                </div>
                                <div className='border h-[40px] p-0 ml-2 w-[calc(100%-90px)] rounded-full relative'>
                                    <input 
                                        value={text} 
                                        onChange={(e) => setText(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        type="text" 
                                        placeholder='Type a message...' 
                                        className='w-full rounded-full h-full outline-none p-3' 
                                    />
                                    <div className='text-2xl right-2 top-2 absolute cursor-pointer'>
                                        <span><GrEmoji /></span>
                                    </div>
                                </div>
                                <div 
                                    className={`w-[40px] p-2 justify-center items-center rounded-full ${text.trim() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                    onClick={send}
                                >
                                    <div className='text-2xl'>
                                        <IoSend />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full h-full flex justify-center items-center text-lg font-bold text-slate-600'>
                            <span>Select Seller</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;