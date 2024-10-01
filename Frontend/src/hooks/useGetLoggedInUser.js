import axios from "axios";
import { useEffect, useState } from "react";

const useGetLoggedInUser=()=>{
    const [user,setUser]=useState(null);
    const [loader,setLoader]=useState(true);
    useEffect(()=>{
        const getUser=async()=>{
            try {
                const res=await axios.get("http://localhost:8000/api/user",{withCredentials:true});
                if(res.data.success){
                     setUser(res.data?.user);
                }
            } catch (error) {
                console.log("user not found. Do login");
                setUser(null);
            }finally{
                setLoader(false);
            }
        }

        getUser();
    },[]);
    return {user,loader};
}

export default useGetLoggedInUser;