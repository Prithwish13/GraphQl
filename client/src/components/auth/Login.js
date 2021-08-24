import React, {useState} from "react"
import TextFieldGroup from "../common/TextFieldGroup"
import { useMutation} from "@apollo/client"
import  {LOGIN_USER} from  "../../mutation"

const Login = () => {
    const [email, setEmail] = useState("") 
    const [password, setPassword] = useState("")
    const errors = null
    const [loginUser, {data, loading, error}] = useMutation(LOGIN_USER, {errorPolicy: "all"}) 
    const submitHandler = async (e) =>  {
        e.preventDefault()
        loginUser({
            variables:{
                loginLoginInput: {
                    email,
                    password
                }
            }
        })
        setEmail("")
        setPassword("")
    }
    console.log(data)
    if(data){
        localStorage.setItem("token", data.login)
    }
    if(error){
        console.log(error)
        return <div>
            {error.message}
        </div>
    }

    return (
        <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevConnector account</p>
              <form action="dashboard" onSubmit={submitHandler} >
                <TextFieldGroup
                  name='email'
                  type='email'
                  placeholder='Email Address'
                  value={email}
                  errors={errors}
                  setValue={setEmail}
                />
                
                <TextFieldGroup
                name='password'
                type='password'
                placeholder='Password'
                value={password}
                errors={errors}
                setValue={setPassword}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Login
