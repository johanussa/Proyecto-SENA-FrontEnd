import React from 'react';
import { colors } from './data';

function ComponentFile({ user, sizeShed }) {
  if (user.Horario.length) {
    const dataShedule = user.Horario[sizeShed];
    let colorSelector = 1;

    return (
      <>
        {
          dataShedule.Ficha.length ? (
            dataShedule.Ficha.map((e, pos) => {
              return (
                <section key={pos + 21}>
                  <label>Ficha Número {e.Num_Ficha} : </label>
                  <span className={`color_${colors[colorSelector++]}`}></span>
                </section>
              )
            })
          ) : ''
        }
        {
          dataShedule.Complementaria.length ? (
            dataShedule.Complementaria.map((e, pos) => {
              return (
                <section>
                  <label>Formación Complementaria {pos + 1} : </label>
                  <span className={`color_${colors[colorSelector++]}`}></span>
                </section>
              )
            })
          ) : ''
        }
        {
          dataShedule.Horas.some(e => e.color === 'p') ? (
            <section key={colorSelector * 19}>
              <label>Preparación Formación : </label>
              <span className={`color_${colors['p']}`}></span>
            </section>
          ) : ''
        }
      </>
    )
  }
}

export default ComponentFile