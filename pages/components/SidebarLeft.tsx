import React from 'react'
import TwitterIcon from '@mui/icons-material/Twitter';
import HomeIcon from '@mui/icons-material/Home';
import TagIcon from '@mui/icons-material/Tag';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PersonIcon from '@mui/icons-material/Person';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Person } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { useRouter } from 'next/router'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
export default function SidebarLeft(props) {
    
    const router = useRouter()
    if(props.loadingState=='loaded') return (
    <div className='sidebar-left  pt-4 h-screen sticky top-0 w-auto md:w-1/4 flex flex-col justify-between md:pr-4'>
        <div>
            <TwitterIcon onClick={(e) => {props.backHome(false) ;  props.reload;}} className="cursor-pointer mx-3 mb-8" fontSize="large"/>
        <div className='option-panel flex flex-col items-start'>
            <div className='cursor-pointer hover:bg-secondary flex mb-2 text-xl space-x-3 rounded-full p-2'>
                <HomeIcon className="mx-2" fontSize="large"/>
                <h2 className='hidden md:flex'>Inicio</h2>
            </div>
            <div className='cursor-pointer hover:bg-secondary flex mb-2 text-xl space-x-3 rounded-full p-2'>
                <TagIcon className="mx-2"  fontSize="large"/>
                <h2 className='hidden md:flex'>Explorar</h2>
            </div>
            <div className='cursor-pointer hover:bg-secondary flex mb-2 text-xl space-x-3 rounded-full p-2'>
                <PeopleIcon  className="mx-2" fontSize="large"/>
                <h2 className='hidden md:flex'>Comunidades</h2>
            </div>
            <div className='cursor-pointer hover:bg-secondary flex mb-2 text-xl space-x-3 rounded-full p-2'>
                <NotificationsNoneIcon className="mx-2"  fontSize="large"/>
                <h className='hidden md:flex'>Notificaciones</h>
            </div>
            <div className='cursor-pointer hover:bg-secondary flex mb-2 text-xl space-x-3 rounded-full p-2'>
                <EmailOutlinedIcon  className="mx-2" fontSize="large"/>
                <h2 className='hidden md:flex'>Mensajes</h2>
                
            </div>
            <div onClick={props.loadProfile} className='cursor-pointer hover:bg-secondary flex mb-2 text-xl space-x-3 rounded-full p-2'>
                <PersonIcon className="mx-2"  fontSize="large"/>
                <h2 className='hidden md:flex'>Perfil</h2>

            </div>
            <div className='cursor-pointer hover:bg-secondary flex mb-4 text-xl space-x-3 rounded-full p-2'>
                <MoreHorizIcon className="mx-2"  fontSize="large"/>
                <h2 className='hidden md:flex'>Más opciones</h2>
            </div>
            <div className='  justify-center p-2 w-full'>
                <button onClick={props.onClick} className='bg-blue hidden md:flex justify-center p-4 text-xl font-bold md:w-full rounded-full'>Twittear</button>
                <button onClick={props.onClick} className='bg-blue flex justify-center md:hidden p-4 text-xl  rounded-full'><HistoryEduIcon fontSize='large'/> </button>
            </div>
        </div>
                </div>
            <div className='flex flex-col justify-end h-72 w-full'>
            <div onClick={(e) => {props.setShowOptions(!props.showOptions)}} className=' cursor-pointer w-full hidden md:flex p-2 items-center justify-between rounded-full hover:bg-secondary'>
                {props.showOptions && (
                    <div className=' rounded-lg w-72  bg-main flex flex-col absolute bottom-36 shadow-inner  shadow-bd'>
                        <div className=' mt-2 border-b border-bd p-4 flex justify-between w-full'>
                            <img className="h-12 mr-2 rounded-full w-12" src={props.user.profilePic}/>
                            <div className='flex flex-col'>
                                <p className='font-bold'>{props.user.userName}</p>
                                <p className='text-bd font-semibold'>{props.user.address.slice(0,10)}...</p>
                            </div>
                            <div className='flex flex-col justify-center'>
                                <DoneIcon style={{fill: "light-blue"}}/>
                            </div>
                        </div>
                        
                        <div onClick={(e)=>{router.back()}}className='w-ful mb-2 l p-4 hover:bg-secondary'>Cerrar sesion</div>


                    </div>
                )}
                <img className="h-12 rounded-full w-12" src={props.user.profilePic}/>
                <div className='md:flex hidden flex-col'>
                    <p className='font-bold truncate'>{props.user.userName}</p>
                    <p className='text-bd font-semibold'>{props.user.address.slice(0,10)}...</p>
                </div>
                <MoreHorizIcon className="mx-2 hidden md:flex"  fontSize="large"/>
            </div>
            </div>
            
        
    </div>
  )
}

