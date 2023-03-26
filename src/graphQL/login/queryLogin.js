import { gql } from "@apollo/client";

export const GetUser = gql`
    query GetUser( $numDocumento: String! ) {
        getOneUser( Num_Documento: $numDocumento ) {
            _id
            Active
            Tipo_Documento
            Num_Documento
            Password
        }
    }
`;