import React from 'react'
import Publication from './Publication'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { userAgent } from 'next/server';
import User from "../../types"
import { useState } from 'react';
import { ListItem } from '@mui/material';

function Profile(props) {
    const [followed , setFollowed] = useState([])
    const [followers , setFollowers] = useState([])
    const [showFollows , setShowFollows] = useState("none")

    function selectUserOn(user : User){
        props.select(user)
        props.selectOn(true)

    }
    

    async function loadFollows(option : string){
        const followed = props.user.followed.map(followed => {
            for(let x of props.items){
                if(x.user.address == followed ) return x.user
            }
        })

        const followers = props.user.followers.map(follower => {
            for(let y of props.items){
                if(y.user.address == follower ) return y.user
            }
        })
        
                         
        
        
        setFollowers(followers)
        setFollowed(followed)
        setShowFollows(option)
     
    }

  return (
    <div className='flex min-h-screen border-x   border-bd flex-col grow md:w-3/4'>
            {/* HEADER */}
            <div className='w-full bg-main/20 backdrop-blur-md flex  items-center sticky top-0  p-2  '>
                <div className='p-2 rounded-full cursor-pointer hover:bg-secondary' 
                onClick={(e) =>{if(showFollows==="none"){props.selectOn(false)} else{setShowFollows("none")}}}>
                    <ArrowBackIcon />
                </div>
                <div className=''>
                    <h1 className='font-bold mx-4 text-2xl '>{props.user.userName}</h1>
                    <p className='mx-4 text-bd font-semibold'>{props.user.tweets.length} tweets</p>
                </div>
               
            </div>

            {/* HEADER */}

            {/* BODY */}
         
            {(showFollows!== "none") ?(
                <div className='w-full '>
                    <div className='flex border-b border-bd w-full'>
                        <div onClick={(e)=> {setShowFollows("followers")}} className={`  ${showFollows == 'followers' ? 'font-bold': ''} cursor-pointer text-lg flex justify-center items-center hover:bg-secondary  w-1/2`} ><p className={`${showFollows=="followers" && "border-b-4 border-blue"} py-4 `}>Seguidores</p></div>
                        <div onClick={(e) => {setShowFollows("followed")}} className={` ${showFollows == 'followed' ? 'font-bold': ''} cursor-pointer text-lg flex justify-center items-center hover:bg-secondary  w-1/2` } ><p className={`${showFollows=="followed" && " border-b-4 border-blue"} py-4`}>Siguiendo</p></div>
                    </div>
                    {(showFollows== "followers")?(
                        <div className='w-full'>
                            {followers.map((follower , i) =>(
                                <div  key={i} className='w-full hover:bg-secondary flex p-4'>
                                   
                                    <div className ="h-full flex flex-col w-16">
                                        <img src={follower.profilePic} className="h-14 w-14 rounded-full" />
           
                                    </div>
                                    <div className='flex flex-col ml-4   justify-center w-full '>
                                        <h1  className='cursor-pointer 	flex w-full justify-between font-bold text-lg'><span className='hover:underline'>{follower.userName}</span><button className='bg-white text-main font-bold py-2 px-8 rounded-full'>Seguir</button></h1> 
                                        <p  className='text-bd cursor-pointer  hover:underline  mx-4'>{follower.address.slice(0,10)}...</p>
                                        <p>{follower.bio}</p>
                                        
                                    </div>
                             
                                    
                                </div>
                            ) )}
                        </div>

                    ):(
                        <div className='w-full'>
                            {followed.map((followed , i) =>(
                                <div key={i} className='w-full hover:bg-secondary flex p-4'>
                                    <div className ="h-full flex flex-col w-16">
                                        <img src={followed.profilePic} className="h-14 w-14 rounded-full" />
           
                                    </div>
                                    <div className='flex flex-col ml-4   justify-center w-full'>
                                        <h1  className='cursor-pointer 	flex w-full justify-between font-bold text-lg'><span className='hover:underline'>{followed.userName}</span><button className='bg-white text-main font-bold py-2 px-8 rounded-full'>Seguir</button></h1> 
                                        <p  className='text-bd cursor-pointer  hover:underline  mx-4'>{followed.address.slice(0,10)}...</p>
                                        <p>{followed.bio}</p>
                                    </div>
                                </div>
                            ) )}
                        </div>

                    )}

                </div>
            ) : (
               <>
                <div className='w-full layout p-8'>
                <img className="relative top-24 rounded-full h-32 w-32" src={props.user.profilePic} />

                </div>
            <div className='bg-main  p-4 w-full flex flex-col border-b border-secondary'>
                <div className='flex mb-16 justify-end'>
                    {!props.uploading ? (<>
                        {props.user.followers.includes(props.userAddress) ? (<button className='bg-main h-12 text-white border border-bd text-lg font-bold rounded-full py-2  px-8'>Siguiendo</button>) : (<button onClick={(e) => {props.follow(props.user.userName)}} className='bg-white h-12 text-main text-lg font-bold rounded-full py-2  px-8'>Seguir</button>)}
                        
                       </> ) : ( <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                      </Box>)
                    }
                    </div>
                <h1 className='font-bold text-2xl'>{props.user.userName}</h1>
                <p className='text-bd font-semibold'>{props.user.address}</p>
                <p className='mt-8'>{props.user.bio}</p>
                <div className='flex mt-4 space-x-4'>
                    <p onClick={(e)=>{loadFollows("followed")}} className='hover:underline cursor-pointer font-bold'>{props.user.followedNumber} <span className='text-bd mx-1'>Siguiendo</span></p>
                    <p onClick={(e) => {loadFollows("followers")}} className='hover:underline cursor-pointer font-bold'>{props.user.followersNumber} <span className='text-bd mx-1'>Seguidores</span></p>
                    
                </div>
            </div>
           
           
            {props.user.tweets
                .slice(0)
                .reverse()
                .map((item , i)=>(
                    <Publication key={i} loadingState={props.loadingState} select={selectUserOn} quote={item.quote} publicationId={item.id}   hours={item.hours} liked={item.liked} likes={item.likes} retweets={item.RTs} user={props.user}  text={item.text} />
                )

            )}
            </>
            
            )
            
            
            }
            {/* BODY */}
            
    </div>
       
  )
}

export default Profile