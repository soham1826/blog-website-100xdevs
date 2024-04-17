import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom"
import { signUpInput } from "@kulsoham/medium-common";
import axios from "axios";
import {BACKEND_URL} from "../../config"
import { useNavigate } from "react-router-dom";


const Auth = ({type}:{type:"signin"|"signup"}) => { 
    const navigate = useNavigate();
    const[postInputs , setPostInputs] = useState<signUpInput>({
        username:"",
        email:"",
        password:""
    })

    const handleSignup = async()=>{
        try {
            const res = await axios.post(`${BACKEND_URL}/user/signup`,postInputs);
            if(res){
                console.log(res.data)
                localStorage.setItem("token",res.data.user.token)
                navigate("/")

            }
        } catch (error) {
            console.log(error)
        }
        

    }
    const handleSignin = async()=>{
        try {
            const res = await axios.post(`${BACKEND_URL}/user/signin`,postInputs);
            if(res){
                console.log(res.data)
                localStorage.setItem("token",res.data.token)
                navigate("/blogs")

            }
        } catch (error) {
            console.log(error)
        }
        

    }
  return (

    <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
                <div>
                <div className="text-5xl flex justify-center font-bold">{type == "signup" ? "Create an account": "Sign in to account "}</div>
                <div className="text-2xl text-slate-400 flex justify-center gap-2 mt-2">{type=="signup" ? "Already have an account ?":"Don't have an account ? "}
                <Link to={type == "signin"?"/signup":"/signin"} className=" underline">{type == "signin"? "Sign up" : "Sign in"}</Link>
                </div>
                    {type == "signup"?<LabelledInput placeholder="John" label="Username" onChange={(e)=>{
                        setPostInputs({
                            ...postInputs,
                            username:e.target.value
                        })
                    }}/>:<></>}
                    
                    <LabelledInput placeholder="john@email.com" label="Email" onChange={(e)=>{
                        setPostInputs({
                            ...postInputs,
                            email:e.target.value
                        })
                    }}/>
                    <LabelledInput placeholder="Your secret" label="Password" onChange={(e)=>{
                       setPostInputs({
                        ...postInputs,
                        password:e.target.value
                    })
                    }}/>
                    
                    <button type="button" onClick={type=="signup"? handleSignup:handleSignin} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-md w-full px-5 py-3 mt-4 mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">{type == "signup" ? "Sign up" : "Sign In"}</button>
                </div>
              
        </div>
        
    </div>
  )
}

interface labelledInputtype{
   label:string,
   placeholder:string,
   onChange:(e:ChangeEvent<HTMLInputElement>)=> void;
}

function LabelledInput({label ,placeholder, onChange}:labelledInputtype)
{
    return(
        <div>
            <label htmlFor={label} className="block mb-2 mt-4 text-md font-medium text-gray-900">{label}</label>
            <input type="text"  id= {label} className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg block w-full p-3" placeholder={placeholder} required  onChange={onChange}/>
        </div>
    )
}
export default Auth