import { gql } from "@apollo/client";

export const GetShedule = gql`
    query GetShedule( $instructor: ID! ) {
        getOneShedule( Instructor: $instructor ) {
            _id
            Instructor {
                _id
                Nombre
                Apellido
                Num_Documento
                Active  
            }
            Horario {
                FechaInicio
                FechaFin
                Ficha {
                    Num_Ficha
                    Num_Ruta
                    Trimestre
                    Codigo
                    Color
                    Programa
                    Num_Aprendices
                    Ambiente
                    Competencias
                    Resultados
                    Descripcion
                }
                Complementaria
                Planta
                Horas {
                    pos
                    color
                    Ambiente
                }
            }
        }
    }
`;