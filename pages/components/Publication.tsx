import React, { useEffect } from 'react'
import Image from 'next/image';
// import { IpfsImage } from 'react-ipfs-image';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useState } from 'react';
import Web3Modal from 'web3modal'
import { ethers } from 'ethers';
import Link from 'next/link';

function Publication(props : any) {
  const [quotedUser , setquotedUser] = useState({profilePic : "#" , userName : "" , bio : ""})

  useEffect (()=>{
    getUserProfile()

  },[])
  
  async function getUserProfile(){
    if(props.quote.quoting==true){
      try{
      console.log("Address is :",props.quote.quoted.from)
      console.log("Contract is : " , props.contract)
      const response = await props.contract.getUserProfile(props.quote.quoted.from);
      console.log(response)
      const user = {
        address : props.quote.quoted.from,
        profilePic : response[0],
        userName : response[1],
        bio : response[2],
        followers : response[3],
        followersNumber : response[3].length,
        followed : response[4],
        followedNumber : response[4].length,
        tweets : response[5].map( tw => ({
              text : tw.text,
              quote : tw.text.includes("quoting : ") ? 
            {
                quoting : true,
                quoted : props.items[parseInt(tw.text.split('quoting : ')[1])]
            } : {
                quoting : false,
                quoted : ""
            },
            RTs : tw.rt.toNumber(),
            likes  : tw.likes.toNumber(),
            hours : (props.current - tw.timestamp.toNumber())/3600,
             id : tw.id.toNumber()  }))
      }
      setquotedUser(user)
      }catch(e){
        console.log("Error : ", e)
      }
    }
   
     
    }
    
    
  


  if(props.loadingState=='loaded') return (
    <div className='flex flex-col justify-between py-4 px-4 border-b border-bd w-full'>
        <div className='flex'>
          <div className ="h-full flex flex-col w-16">
            <img src={props.user.profilePic} className="h-12 w-12 rounded-full" />
           
          </div>
          <div className='w-full'>
            <div className='flex   items-center w-full'>
              <h1 onClick={(e)=>{props.select(props.user)}} className='cursor-pointer hover:underline	 font-bold text-lg'><span>{props.user.userName}</span></h1> 
              <p  className='text-bd cursor-pointer  hover:underline  mx-4'>{props.user.address.slice(0,10)}...</p>
              {
               props.hours<1?(<span className='mx-4 text-bd '>
                 {((props.hours)*60).toFixed(0)} min.
                 </span>
               ):props.hours<=24 ? (
                <span className='mx-4 text-bd '>
                 {(props.hours).toFixed(0)} h
                 </span>
               ):(
                <span className='mx-4 text-bd '>
                  Hace {(props.hours /24).toFixed(0) } días
                 </span>
               )
               }
            </div>
            <div>
            {
              props.quote.quoting ? (
                <div>
                <div>
                {props.text.split('quoting : ')[0]}
                </div>
                <div className='p-4'>
                  <div className='bg-main border border-bd rounded-md flex flex-col justify-between py-4 px-4  w-full'>
                    

                      {/* empuieza */}






                      <div className='flex'>
          <div className ="h-full flex flex-col w-16">
            <img src={quotedUser.profilePic} className="h-12 w-12 rounded-full" />
           
          </div>
          <div className='w-full'>
            <div className='flex   items-center w-full'>
              <h1 onClick={(e)=>{props.select(quotedUser)}} className='cursor-pointer hover:underline	 font-bold text-lg'><span>{quotedUser.userName}</span></h1> 
              {/* <p  className='text-bd cursor-pointer hover:underline  mx-4'>{quotedUser.address.slice(0,10)}...</p> */}
              {
               props.hours<1?(<span className='mx-4 text-bd '>
                 {((props.hours)*60).toFixed(0)} min.
                 </span>
               ):props.hours<=24 ? (
                <span className='mx-4 text-bd '>
                 {(props.hours).toFixed(0)} h
                 </span>
               ):(
                <span className='mx-4 text-bd '>
                  Hace {(props.hours/24).toFixed(0) } días
                 </span>
               )
               }
            </div>
               {props.quote.quoted.text}

            
           
            </div>
            </div>
        </div>
   



                      {/* acaba */}




                  </div>
                  </div>
                 
                ) : (
                  <div>
                {props.text}
                </div>
                )
              }
           
            </div>
            </div>
        </div>
        
        <div className='flex justify-evenly w-full '>
            
              {props.liked ? (
                <div className='cursor-pointer flex items-center'>
                  <div  className='p-2 rounded-full hover:bg-red/20'><FavoriteIcon  style={{fill: "red"}} className=''/></div>  <span className='text-red'>{props.likes}</span>
                </div>
              ) : (
                <div onClick={(e) => {props.like(props.publicationId)}} className='cursor-pointer flex items-center'>
                  <div  className='p-2 rounded-full hover:bg-red/20'><FavoriteBorderIcon/></div><span>{props.likes}</span>
                </div>
              )}
           
            <div onClick={(e) => {props.rt({publicationId : props.publicationId , user : {userName : props.user.userName , bio: props.user.bio ,  address:  props.user.address, profilePic: props.user.profilePic} , text:props.text}
              
              )}} className='cursor-pointer flex items-center'><div className='p-2 hover:bg-green/20 rounded-full hover:bg-secondary'><SwapCallsIcon/></div>  <span>{props.retweets}</span></div>
              <Link href="/wallet">
                  <div div className='cursor-pointer flex items-center'><div className='p-2 hover:bg-blue/20 rounded-full hover:bg-secondary'><VolunteerActivismIcon/></div> </div>
              </Link> 
             </div>
        
    </div>
  )
}

export default Publication