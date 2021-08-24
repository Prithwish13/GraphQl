import {
    gql
} from "@apollo/client"


export const ADD_USER = gql`
mutation CreateUserMutation( $createUserUserInput: UserInputData) {
createUser(userInput: $createUserUserInput) {
  _id,
  name
  companyId,
  email,
  status
}
}
`;

export const LOGIN_USER = gql`
mutation LoginMutation($loginLoginInput: LoginData) {
  login(loginInput: $loginLoginInput)
}`
