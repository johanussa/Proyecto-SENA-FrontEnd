import { gql } from '@apollo/client';

export const GetUsers = gql`
    query AllUsers {
        allUsers {
            _id
            Num_Documento
            Nombre
            Apellido
            Email
            Rol
            Active
        }
    }
`;

export const GetUsersRol = gql`
    query GetUsersRol( $rol: Enum_Rol ) {
        allUsers(Rol: $rol) {
            _id
            Nombre
            Apellido
            Num_Documento
            Active
            Rol
        }
    }
`;
