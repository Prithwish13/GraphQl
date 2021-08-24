import {
    gql
} from "@apollo/client"


export const FETCH_COMPANIES = gql`
query Query {
  companies {
    _id,
    name,
    description
  }
}
`;
