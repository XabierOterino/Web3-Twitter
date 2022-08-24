import React, { Component } from 'react'
import TwitterIcon from '@mui/icons-material/Twitter';
import { useRouter } from 'next/router'
import { ethers } from 'ethers';
import Web3Modal from 'web3modal'
import {twitterContract} from "../config.js"
import { useState } from 'react';
import Twitter from "../build/contracts/Twitter.json"
import CloseIcon from '@mui/icons-material/Close';
import { Router } from '@mui/icons-material';
import {create as ipfsClient} from 'ipfs-http-client'
import { useEffect } from 'react';
import {config} from "dotenv"
config()
const projectId = process.env.PROJECT_ID;
const projectSecret = process.env.PROJECT_SECRET;
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsClient({
    host: 'infura-ipfs.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});



export default function index(props) {

    useEffect(()=>{
      
      if(window.ethereum) window.ethereum.on("accountsChanged", (accounts) => {
        setShowForm(false)
        setFormInput({userName:'' , bio:'' , picture : ''})
      
      })


    },[])
    const [showForm , setShowForm] = useState(false)
    const [formInput , setFormInput] = useState({userName:'' , bio:'' , picture : ''})
    const router = useRouter()

  

    
    async function connect(){
      if(window.ethereum){
        try{
         await window.ethereum.request({ method: 'eth_requestAccounts' });
         const web3Modal = new Web3Modal()
         const connection = await web3Modal.connect()
         const provider = new ethers.providers.Web3Provider(connection)
         const signer = provider.getSigner()
         const account = await signer.getAddress()
         const tw = new ethers.Contract(twitterContract , Twitter.abi , signer)
         const registered = await tw.signedUp(account)
         if (registered){
            router.push("/home")
         }else{
            alert("Esta cuenta no está registrada")
         }
         
        }catch(e){}
      }else{
        console.log("Metamask not installed ...")
      }
    }


    async function upload(e){
      const file = e.target.files[0]
        try {
          const added = await client.add(
            file,
            {
              progress: (prog) => console.log(`received: ${prog}`)
            }
          )
          const url = `https://cf-ipfs.com/ipfs/${added.path}`
          setFormInput({...formInput , picture : url})
          console.log(url)
        } catch (error) {
          console.log('Error uploading file: ', error)
        }  
      
    
    }



    async function register(){
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const account = await signer.getAddress()
      const tw = new ethers.Contract(twitterContract , Twitter.abi , signer)
      const registered = await tw.signedUp(account)
      if(!registered){
        try{
          const tx = await tw.signUp( formInput.picture , formInput.userName , formInput.bio )
          await tx.wait()
          router.push("/home")
        }catch(e){
          console.log("Couldnt register")
        }
      }else{
        alert("Already registered")
      }

      

    }

   return (
      <div className='w-full h-screen flex flex-col bg-main'>
          <div className='flex flex-col-reverse md:flex-row w-full'>
            <div className=" flex items-center justify-center grow  layout  md:h-screen">
                <TwitterIcon className=' sm:hidden  place-self-center w-1/2 h-1/2 '/>
            </div>  
            <div className=' signup flex-none py-8 pl-8 pr-16 bg-main h-screen' >
              <TwitterIcon className='' sx={{ fontSize: 50 }} />
              <div className='w-full mt-16 '>
                <h1 className='font-bold text-7xl'>Lo que está </h1>
                  <div className='flex flex-col semi:flex-row'>
                    <h1 className='font-bold mt-4 semi:mr-4 text-7xl'>pasando  </h1>
                    <h1 className='font-bold mt-4 text-7xl'> ahora</h1>
                  </div>
              </div>
              <h1 className='font-bold text-4xl mt-16'>Únete a Twitter hoy mismo.</h1>
              <button onClick={(e)=>{setShowForm(true)}} className='font-semibold py-2 mt-32 px-8 rounded-full bg-blue text-xl'>Regístrate con tu wallet de ...</button>
              <p className='font-semibold text-xl mt-32'>¿Ya tienes una cuenta?</p>
              <button onClick={(e)=>{connect()}} className='font-semibold py-2 mt-8 px-24 text-blue hover:bg-blue/10 rounded-full border border-bd text-xl'>Iniciar sesión</button>
            </div>
          </div>
          <footer className='w-full px-8 py-4 space-x-2 flex flex-wrap '>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>
            <p className='text-bd font-semibold hover:underline'>lorem ipsum</p>

          </footer>
         
          {showForm && (
            <div className='flex flex-col items-center h-screen bg-white/10 w-full fixed'>
              <div className='semi:mt-16 bg-main semi:rounded-2xl semi:h-auto register w-full h-screen'>
                  <CloseIcon className='cursor-pointer m-4' onClick={(e) => setShowForm(false)} />
                    <div className='py-8 px-24'>
                      <h1 className='text-4xl font-bold'>Crea tu cuenta</h1>
                      <input onChange={(e)=>setFormInput({...formInput , userName:e.target.value})} placeholder='Nombre' type="text-field" className="outline-blue placeholder:text-lg   w-full mt-8 py-2 px-8 rounded border border-bd " />
                      <input onChange={(e)=>setFormInput({...formInput , bio:e.target.value})}  placeholder='Biografia' type="text-field" className="outline-blue placeholder:text-lg w-full mt-8 py-2 px-8 rounded border border-bd " />
                      <p className='mt-8 font-semibold '>Foto de perfil:</p>
                      <input onChange={upload} className=' bg-blue upload mt-2 rounded py-2 px-8 w-full' type="file" />
                      {formInput.picture.length && 
                        (
                          <div className='flex justify-center'> 
                          <img className="h-32 rounded-full mt-4 w-32" src={formInput.picture} />
                          </div>
                        )
                      }
                      {(!formInput.userName.length ||  !formInput.bio.length ||  !formInput.picture.length ) ? (
                        <button className='w-full mt-16 font-bold py-4 rounded-full text-secondary bg-white/40'>Siguiente</button>)
                         : (<button onClick={()=> register()} className='w-full mt-16 font-bold py-4 rounded-full text-main bg-white'>Siguiente</button>)}

                     </div>
                  </div>

               </div>
          )}         
        </div>
   
    )
  
}
