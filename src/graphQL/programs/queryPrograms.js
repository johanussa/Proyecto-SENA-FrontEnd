import { gql } from "@apollo/client";

export const GetProgram = gql`
    query GetProgram( $nombre: String! ) {
        getOneProgram(Nombre: $nombre) {
            _id
            Nombre
            Competencias {
                Competencias
            }
            Resultados {
                Resultados {
                    Nombre
                    ResultComp
                }
            }
        }
    }
`;

export const GetNames = gql`
    query GetNames {
        allProgramsName
    }
`;

export const GetClassRooms = gql`
    query GetClassRooms {
        allAmbientes {
            Ambientes
        }
    }
`;

export const GetSheduleAmb = gql`
    query GetSheduleAmb(
        $fechaInicio: String!, 
        $ambiente: String!
    ) {
        getSheduleClassRoom(
            FechaInicio: $fechaInicio, 
            Ambiente: $ambiente
        ) 
    }
`;