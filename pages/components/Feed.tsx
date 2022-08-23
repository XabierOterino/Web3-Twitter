import React, { useEffect } from 'react'
import {twitterContract} from "../../config.js"
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Twitter from "../../build/contracts/Twitter.json"
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import type { User , Twit} from "../../types"

// import { IpfsImage } from 'react-ipfs-image';
import Publication from './Publication.tsx';
export default function Feed(props) {

    const [formInput , setFormInput] = useState('')
    
    
    function Retweet( selectedTweet :Twit){
        props.show(true)
        props.selectTweet(selectedTweet)

    }
    function selectUserOn(user : User){
        props.select(user)
        props.selectOn(true)
        console.log("Selected")
        console.log(user)

    }
    
    function selectUserOff(){
        props.selectOn(false)
    }
    if(props.loadingState=='loaded' ) return (
        <div className='flex min-h-screen border-x   border-bd flex-col w-full grow md:w-3/4'>
            <div className='w-full bg-main/20 backdrop-blur-md flex flex-row justify-between sticky top-0 items-center p-4  '>
                <h1 className='font-bold text-2xl '>Inicio</h1>
                <div className='p-2 cursor-pointer rounded-full hover:bg-secondary'> <AutoFixHighIcon/></div>
               
            </div>
            {
                props.userProfile && (
                    <div className='w-full p-4 border-b justify-between  border-bd'>
                        <div className=' flex  w-full'>
                            <img src={props.userProfile.profilePic} className="flex-none mr-8 h-12 w-12 rounded-full" />
                            <input onChange={(e)=>setFormInput(e.target.value)} type="text" className="grow outline-none placeholder:text-xl text-xl" placeholder='¿Que está pasando?'/>
                            {props.uploading ? (
                                <Box sx={{ display: 'flex' }}>
                                <CircularProgress />
                              </Box>
                                ):(
                                    <>
                                {formInput.length ? (
                                    <button onClick={(e)=>props.onClick(formInput)} className='flex-none py-1 px-4 shrink-1 rounded-full bg-blue md:py-2 md:px-8 md:text-lg font-semibold'>Twittear</button>
                                ) :(
                                    <button  className='flex-none  py-1 px-4 shrink-1 rounded-full bg-blue/60 md:py-2 md:px-8 md:text-lg font-semibold'>Twittear</button>
                                )}
                                
                                </>
                                ) }
                        </div>
                    </div>
                )
            }
            {props.items
                .slice(0)
                .reverse()
                .map((item , i)=>(
                <Publication key={i} like={props.like} rt={Retweet} loadingState={props.loadingState} current={props.current} items={props.items}contract={props.contract} select={selectUserOn} quote={item.quote} publicationId={item.id}   hours={item.hours} liked={item.liked} likes={item.likes} retweets={item.RTs} user={item.user}  text={item.text} />
            )

            )}

        </div>
    )
}

