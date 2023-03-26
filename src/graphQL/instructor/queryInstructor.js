import { gql } from "@apollo/client";

export const GetInstructor = gql`
    query GetInstructor($instructor: ID!) {
        getOneShedule(Instructor: $instructor) {
            _id
            Instructor {
                Nombre
                Apellido
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