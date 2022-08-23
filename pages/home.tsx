

import React from 'react'
import SidebarLeft from './components/SidebarLeft'
import SidebarRigth from './components/SidebarRigth'
import Feed from './components/Feed'
import { useState } from 'react'
import { useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar';
import Web3Modal from 'web3modal'
import {twitterContract} from "../config.js"
import Twitter from "../build/contracts/Twitter.json"
import { ethers } from 'ethers';
import CloseIcon from '@mui/icons-material/Close';
import { Publish, Router } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Profile from './components/Profile'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';


export default function Home() {
  const router = useRouter()
  const [items , setItems] = useState([]) //state variable for tweet list
  const [context , setContext] = useState({
      contract: undefined, //contract object
      current : 0, //current timestamp
      userProfile : { //client user data
        address: undefined,
        profilePic : undefined,
        userName : undefined,
        bio : undefined,
        followers : undefined,
        followersNumber : undefined,
        followed : undefined,
        followedNumber : undefined,
        tweets : undefined

      } , 
      //state variables to interact with the interfaces
      selectedUser : undefined , 
      selectedTwit : undefined,
  })
  const [state , setState] = useState({uploading : false , formInput : "" , loadingState : 'not-loaded'}) 
  const [interfaces , setInterfaces] = useState({ //all the interfaces that can be shown during the execution
      showTwitInterface : false,
      showRetwitInterface : false,
      showProfile : false,
      showOptions : false,
      showProfile : false
  })
  const [notifications , setNotifications] = useState ({ //notifications state variables
      sender : undefined,
      openPublication : false ,
      openLike : false,
      openRetwit : false
  })
  
  // alert from Material UI
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
  // Functions to handle the notifications 
  const handleEvents = (notification : string) => {
    if(notification=="publish"){
      setNotifications({...notifications , openPublication : true})
    }else if(notification=="like"){
      loadPublicationFeed()
      setNotifications({...notifications , openLike : true})
    }else if(notification=="retweet"){
      loadPublicationFeed()
      setNotifications({...notifications , openRetwit : true})
    }else{}
    
  };
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotifications ({...notifications , openPublication : false , openLike : false, openRetwit : false })
  };


  useEffect(()=>{
    loadPublicationFeed()
    if(context.contract){

        context.contract.on("Liked" , (from ,index, timestamp) =>{
          if(items[index].user.address==context.userProfile.address){
            setNotifications({...notifications , sender :from})
            handleEvents("like")


          }
        })

        context.contract.on("Retweeted" , (from ,index, timestamp) =>{
          if(items[index].user.address==context.userProfile.address){
            setNotifications({...notifications , sender :from})
            handleEvents("retweet")

          }
        })
        context.contract.on("Published" , (index , from , timestamp) => {
            loadPublicationFeed()

        })
    }
    if(window.ethereum) window.ethereum.on("accountsChanged", (accounts) => {
      loadPublicationFeed()
    
    })

} , [items])



  
  async function loadPublicationFeed(){  
    // load all the necessary data to initialize the dapp
    console.log("Refreshing...")
    // create a provider and a contract instance with web3modal and ethers.js
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const account = await signer.getAddress()
    
    const tw = new ethers.Contract(twitterContract , Twitter.abi , signer)
    const _current = await tw.currentTime();
    const current  = _current.toNumber()  //current timestamp   
    const data = await tw.tweets() 
    const userData = await tw.getUserProfile(account) //fetch the data of the client
    const registered = await tw.signedUp(account) //check if the client is registered
    if(!registered) router.back() //if is not registered will be driven to the index
    
    const userProfile = user(userData , data , account)
    setContext({...context, contract: tw , current , userProfile })
      
    const tweets = await Promise.all(data.//fetch all the tweets of the platform
        map(async publication =>{
            const userData = await tw.getUserProfile(publication.from)
            const likes = publication.likes.toNumber()
            const RTs = publication.rt.toNumber()
            const id = publication.id.toNumber()
            const hours  = (context.current - publication.timestamp.toNumber()) / 60
            const liked = await tw.liked(context.userProfile.address , id)
            let quoted = publication.text.includes("quoting : ")  ? {    quoting : true,    quoted : data[parseInt(publication.text.split('quoting : ')[1])]} 
                                                                  : {    quoting : false,    quoted : ""}
            const tweetOwner = user(userData , data , account)               
            const tweet = { // map every tweet to this object
                user : tweetOwner, //user object
                text : publication.text,
                quote : quoted,
                RTs,
                likes,
                liked,
                hours,
                id     
            }

            return tweet
        }))
        setItems(tweets)       
        setState({...state , loadingState : "loaded"}) // ready to go
        
}



  const  Like = async (publicationId) => {//function to like a publication
    try{
      await context.contract.like(publicationId);
      loadPublicationFeed()
    }catch{
      console.log("Error")
    }
  }


  const RT = async ( text:string) =>{ //funciton to retweet a publication
    try{
      setState({...state , uploading : true})
      const tx = await context.contract.retweet(context.selectedTwit.publicationId , text)
      await tx.wait()
      setState({...state , uploading : false})
      setInterfaces({...interfaces , showRetwitInterface : false}) 
    }catch{
      console.log("Error")
      setState({...state , uploading : false})
    }
  }

  const Publish = async (text : string) =>{ //function to post a new tweet
    try{
      setState({...state , uploading:true})
      const tx = await context.contract.newTweet(text)
      await tx.wait()
      setInterfaces({...interfaces , showTwitInterface : false})
      loadPublicationFeed()
      setState({...state, uploading: false})
      handleEvents("publish")
    }catch{setState({...state , uploading:false})}

  }

  const follow = async (userName : string) =>{ //function to follow a user
    try{
    setState({...state , uploading:true})
    await context.contract.follow(userName)
    setState({...state , uploading:false})
    }catch{setState({...state , uploading:false})}
  }
  

  


if(state.loadingState=="loaded") return (
    <div   className='flex flex-col min-h-screen items-center w-full'>
      <div className='w-9/12'>
        <div className="w-full flex">       
          <SidebarLeft 
                reload = {loadPublicationFeed}
                showOptions={interfaces.showOptions} 
                loadProfile={() =>{
                  setContext({...context , selectedUser : context.userProfile});
                  setInterfaces({...interfaces , showProfile:true});
                 }
                }
                
                setShowOptions={(state:bool) => {setInterfaces({...interfaces , showOptions : state})}} 
                loadingState={state.loadingState} user={context.userProfile}  onClick={(state:bool) => {setInterfaces({...interfaces , showTwitInterface: state})}} 
                backHome={(state:bool) => {setInterfaces({...interfaces , showProfile : state})}} />

          {interfaces.showProfile ? (
            <Profile 
                userAddress={context.userProfile.address} 
                uploading={state.uploading} 
                follow={follow} selectOn={(state:bool) => {setInterfaces({...interfaces , showProfile : state})}}  
                items={items}
                loadingState={state.loadingState} 
                user={context.selectedUser}/>
              ) : (
            <Feed 
                show={(state:bool) => {setInterfaces({...interfaces , showRetwitInterface : state})}} 
                selectTweet={(twit) => {setContext({...context , selectedTwit: twit})}} 
                like={Like} 
                rt={RT} 
                showDonationsInterface = {(state:bool) => { setInterfaces({...interfaces , showDonationsInterface : state}) }}
                current={context.current} 
                contract={context.contract} 
                uploading={state.uploading} 
                items={items} 
                selectOn={(state:bool) => {setInterfaces({...interfaces , showProfile : state})}} 
                select={(user) => {setContext({...context , selectedUser : user})}} 
                onClick={Publish} userProfile={context.userProfile} 
                loadingState={state.loadingState} />
          )}

          <SidebarRigth loadingState={state.loadingState} />

          
        </div>
      </div>
      {
        interfaces.showTwitInterface && (
          <div className='w-screen h-screen fixed bg-white/20 flex flex-col items-center'>
            <div className=' p-8 bg-main rounded-xl mt-16 justify-between '>
                        <div className=' flex  flex-col w-full'>
                        <div className='flex h-16'>
                          <CloseIcon className='cursor-pointer' onClick={(e) =>{setInterfaces({...interfaces , showTwitInterface : false})}} />
                        </div>
                          <img src={context.userProfile.profilePic} className="mr-8 mb-16 h-20 w-20 rounded-full" />
                        {state.uploading ? (
                           <div className='border-t border-secondary pt-4 '>
                           <input onChange={(e)=>{setState({...state , formInput : e.target.value})}} type="text" className="outline-none placeholder:text-xl text-secondary text-xl" placeholder='¿Que está pasando?'/>
                           <CircularProgress />
                          
                         </div>

                        ):(
                          <div className='border-t border-secondary pt-4 '>
                          <input onChange={(e)=>{setState({...state , formInput : e.target.value})}}type="text" className="outline-none placeholder:text-xl text-xl" placeholder='¿Que está pasando?'/>
                          {state.formInput.length ? ( 
                            <button onClick={(e)=>Publish(state.formInput)} className='rounded-full bg-blue py-2 px-8 text-lg font-semibold'>Twittear</button>
                              ) : (
                             <button className='rounded-full bg-blue/20 py-2 cursor-none px-8 text-lg font-semibold'>Twittear</button>
                          )}
                         
                        </div>

                        )

                        }
                       
                        </div>
                    </div>
          </div>
        )
      }

{
        interfaces.showRetwitInterface && (
          <div className='w-screen h-screen fixed bg-white/20 flex flex-col items-center'>
            <div className=' p-8 bg-main rounded-xl mt-16 justify-between '>
                        <div className=' flex  flex-col w-full'>
                        <div className='flex h-16'>
                          <CloseIcon className='cursor-pointer' onClick={(e) =>{setInterfaces({...interfaces , showRetwitInterface : false})}} />
                        </div>
                          <img src={context.userProfile.profilePic} className="mr-8 mb-16 h-20 w-20 rounded-full" />
                          <div className='px-4'>
                            {/* quoting a twit */}
                            <div className='flex mb-4 flex-col justify-between py-4 px-4 border rounded-md border-bd w-full'>
                              <div className='flex'>
                                <div className ="h-full flex flex-col w-16">
                                  <img src={context.selectedTwit.user.profilePic} className="h-12 w-12 rounded-full" />
                                  
                                </div>
                                <div className='w-full'>
                                  <div className='flex   items-center w-full'>
                                    <h1 className='cursor-pointer hover:underline	 font-bold text-lg'><span>{context.selectedTwit.user.userName}</span></h1> 
                                    <p  className='text-bd cursor-pointer  hover:underline  mx-4'>{context.selectedTwit.user.address.slice(0,10)}...</p> 
                                   </div>
                                   <div>
                                    {context.selectedTwit.text}
                                   </div>
                                   </div>   
                               </div>  
                           </div> 
                            {/* quoting a twit */}
                          </div>
                        {state.uploading ? (
                           <div className='border-t flex justify-between border-secondary pt-4 '>
                           <input onChange={(e)=>{setState({...state , formInput : e.target.value})}} type="text" className="outline-none placeholder:text-xl text-secondary text-xl" placeholder='¿Que está pasando?'/>
                           <CircularProgress />
                          
                         </div>

                        ):(
                          <div className='border-t flex justify-between border-secondary pt-4 '>
                          <input onChange={(e)=>{setState({...state , formInput : e.target.value})}}type="text" className="grow outline-none placeholder:text-xl text-xl" placeholder='¿Que está pasando?'/>
                          {state.formInput.length ? ( 
                            <button onClick={(e)=>RT(state.formInput)} className='rounded-full bg-blue py-2 px-8 text-lg font-semibold'>Twittear</button>
                              ) : (
                             <button className='rounded-full bg-blue/20 flex-none py-2 cursor-none px-8 text-lg font-semibold'>Twittear</button>
                          )}
                        </div>
                        )
                        }
                       
                        </div>
                    </div>
          </div>
        )
      }
     
       <Snackbar open={notifications.openPublication} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Tweet subido
        </Alert>
      </Snackbar>

      <Snackbar open={notifications.openLike} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          A alguien le  ha gustado tu publicacion!
        </Alert>
      </Snackbar>

      <Snackbar open={notifications.openRetwit} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Alguien ha retweeteado tu publicacion!
        </Alert>
      </Snackbar>
    </div>
     
  );
 

  function user(userData ,data , account){
    const user = { //client data object
      address: account,
      profilePic : userData[0],
      userName : userData[1],
      bio : userData[2],
      followers : userData[3],
      followersNumber : userData[3].length,
      followed : userData[4],
      followedNumber : userData[4].length,
      tweets : userData[5].map(tw => (//all his tweets
        {
           text : tw.text,
           quote : tw.text.includes("quoting : ") ? 
         {
             quoting : true,
             quoted : data[parseInt(tw.text.split('quoting : ')[1])]
         } : {
             quoting : false,
             quoted : ""
         },
         RTs : tw.rt.toNumber(),
         likes  : tw.likes.toNumber(),
         hours : (context.current - tw.timestamp.toNumber())/60,
          id : tw.id.toNumber()  }))
         
      
    }
    return user

  }
  
}

