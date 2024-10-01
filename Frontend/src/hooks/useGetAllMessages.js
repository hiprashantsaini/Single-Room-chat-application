import axios from "axios";
import { useEffect, useState } from "react";

const useGetAllMessages=()=>{
    const [messages,setMessages]=useState([]);
    useEffect(()=>{
        const getAllMessages=async()=>{
            try {
                const res=await axios.get("http://localhost:8000/api/allchats");
                if(res.data.success){
                    setMessages(res.data?.messages);
                }
            } catch (error) {
                console.log(error)
            }
        }
        getAllMessages();
    },[]);

    console.log("messages :",messages)


    return [messages,setMessages];
}

export default useGetAllMessages;