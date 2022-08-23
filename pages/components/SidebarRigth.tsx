import React from 'react'
import SearchIcon from '@mui/icons-material/Search';

function SidebarRigth(props) {
  if(props.loadingState=='loaded') return (
    <div className='hidden top-0 pl-4  h-screen md:flex flex-col w-full md:w-1/4'>
      <div className='bg-main py-2 sticky top-0'>
      <div className='bg-secondary  flex items-center rounded-full py-3 px-12'>
        <SearchIcon className="flex-none" />
        <input placeholder="Buscar en Twitter" className='text-lg placeholder:text-lg grow outline-none ml-2' type="text"></input>
       </div>
       </div>

       <div className='bg-secondary  mt-8 rounded-xl'>
        <h1 className=' p-4 font-bold text-2xl'>Que está pasando</h1>
        <p className='hover:bg-white/10  p-4 w-full'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam possimus saepe laboriosam repudiandae reiciendis sapiente aspernatur nemo molestias dolorum quis. Dolor atque, nam, molestias consectetur error corrupti illum magni vero, architecto numquam temporibus? Enim magni, reiciendis nihil repudiandae porro excepturi deleniti autem minima ratione, quia exercitationem rerum suscipit optio tempora?
    
        </p>

        <div className='hover:bg-white/10  p-4 w-full'>
        <h1 className=' p-4 font-bold text-lg'>#Crypto</h1>
        <p className='text-white/30'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam possimus saepe laboriosam repudiandae reiciendis sapiente aspernatur nemo molestias dolorum quis. Dolor atque, nam, molestias consectetur error corrupti illum magni vero, architecto numquam temporibus? Enim magni, reiciendis nihil repudiandae porro excepturi deleniti autem minima ratione, quia exercitationem rerum suscipit optio tempora?</p>
    
        </div>

       </div>
    </div>

  )
}

export default SidebarRigth