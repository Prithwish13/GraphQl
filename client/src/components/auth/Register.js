import React, {useState} from "react"
import TextFieldGroup from "../common/TextFieldGroup"
import {useQuery, useMutation} from "@apollo/client"
import  {ADD_USER} from  "../../mutation"
import  {FETCH_COMPANIES} from  "../../query"
import classname from "classname"
const Register = () => {
 const [name, setName] = useState("")
 const [email, setEmail] = useState("") 
 const [password, setPassword] = useState("")
 const [companyId, setCompanyId] = useState("")
 const [addUser] = useMutation(ADD_USER) 
 const {loading, error, data} = useQuery(FETCH_COMPANIES)
 const errors = null
 console.log(companyId)
 const handleSubmit = async(e) => {
     e.preventDefault()
     addUser({ 
         variables: {
            createUserUserInput: {
                name,
                email,
                password,
                companyId
            }
         }
     })
     setName("")
     setEmail("")
     setPassword("")
 }

 if(loading) {
   return <div>Loading...</div>
 }
 return (
    <div className="register">
    <div className="container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Sign Up</h1>
          <p className="lead text-center">Create your  account</p>
          <form action="create-profile" onSubmit={handleSubmit}>
            <TextFieldGroup
              type="text"
              placeholder="Name"
              value={name}
              name={name}
              setValue={setName}
              errors={errors}
            />
            <TextFieldGroup
              type="email"
              placeholder="Email Address"
              value={email}
              name="email"
              setValue={setEmail}
              errors={errors}
              info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
            />
            <TextFieldGroup
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              setValue={setPassword}
              errors={errors}
            />
             <select className={classname("form-control form-control-lg",{
                  'is-invalid':error
              })} name="companyId" onChange={e=>setCompanyId(e.target.value)}
              value={companyId} 
              >
               { data.companies.map(option=>(
                  <option 
                   key={option.name} 
                   value={option._id}
                  >
                  {option.name}
                  </option> 
                 ))
               } 
              </select>
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </div>
  </div> 
    )
}

export default Register
