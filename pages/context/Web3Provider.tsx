import {useContext , createContext} from "react"

const Context = createContext()

export function useContext(){
    return useContext(Context)
}


export function ContextProvider({children}) {
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
  return (
    <Context.Provider value={{}}>
        {children}
    </Context.Provider>
  )
}


