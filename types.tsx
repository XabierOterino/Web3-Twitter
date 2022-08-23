// DECLARATION OF TYPES USED (TYPESCRIPT)
export type Address = 0x104884177a0f5014595051B138ffae31e119d64B
export interface Twit{
    user : User,
    text : string,
    quote ,
    RTs : number,
    likes : number,
    liked : number,
    hours : number,
    id : number

}
export interface User{
    address: Address,
    profilePic : string,
    userName : string,
    bio : string,
    followers : Address[],
    followersNumber : number,
    followed :  Address[],
    followedNumber :  number,
    tweets : Twit[]
}


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