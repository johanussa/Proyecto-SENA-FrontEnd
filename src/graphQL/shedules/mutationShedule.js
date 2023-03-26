import { gql } from "@apollo/client";

export const CreateShedule = gql`
    mutation CreateShedule(
        $instructor: ID!, 
        $horario: [SheduleInput]
    ) {
        addShedule(
            Instructor: $instructor
            Horario: $horario
        ) {
            _id
        }
    }
`;

export const UpdateShedule = gql`
    mutation UpdateShedule(
        $id: ID!, 
        $horario: [SheduleInput]
    ) {
        updateShedule(
            _id: $id,
            Horario: $horario
        ) {
            _id
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