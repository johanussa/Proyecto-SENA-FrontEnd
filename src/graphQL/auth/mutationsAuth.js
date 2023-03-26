import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
    mutation ResgiterUser(
        $nombre: String!, 
        $apellido: String!, 
        $tipoDocumento: Enum_Type_Doc!, 
        $numDocumento: String!, 
        $email: String!, 
        $password: String!, 
        $rol: Enum_Rol!
    ) {
        registerUser(
            Nombre: $nombre, 
            Apellido: $apellido, 
            Tipo_Documento: $tipoDocumento, 
            Num_Documento: $numDocumento, 
            Email: $email, 
            Password: $password, 
            Rol: $rol
        ) {
            token
            error
        }
    }
`;

export const LOGIN_USER = gql`
    mutation LoginUser(
        $tipoDocumento: Enum_Type_Doc!,
        $numDocumento: String!, 
        $password: String!
    ) {
        loginUser(
            Tipo_Documento: $tipoDocumento, 
            Num_Documento: $numDocumento, 
            Password: $password
        ) {
            token
            error
        }
    }
    
`;

export const VALIDATE_TOKEN = gql`
    mutation ValidateToken{
        validateToken {
            token
            error
        }
    }
`;