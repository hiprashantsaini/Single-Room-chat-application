import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetLoggedInUser from "../hooks/useGetLoggedInUser";
import Loader from "./Loader";

const ProtectedRoute=({children})=>{
    const navigate=useNavigate();
     const {user,loader}=useGetLoggedInUser();
     console.log("Is get called");
     useEffect(()=>{
        if(!user && !loader){
            navigate('/signin')
        }
     },[user,loader,navigate]);

     if(loader){
        return(
            <Loader/>
        )
     }
    return(
        <>{children}</>
    )
}

export default ProtectedRoute;