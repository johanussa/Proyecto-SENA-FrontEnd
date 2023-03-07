import React, { useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import { colors } from './data';

function ComponentResume({ user, index, sizeShed, click = false, setEventActive, setColorSelector, setSaveUpdate }) {
  
  const [dataUser, setDataUser] = useState();
  let colorSelector = 0;

  useEffect(() => {
    setDataUser(user[index].Horario[sizeShed]);
  }, [sizeShed])

  const changeShedule = color => {
    document.querySelector('.btns_table').firstElementChild.style.display = 'none';
    document.querySelector('.btns_table').style.display = 'flex';
    setSaveUpdate(true);
    setColorSelector(color);
    setEventActive(true);
  }

  if (!user[index].Horario.length) return;
  return (
    <>
      {
        dataUser?.Ficha && dataUser.Ficha.map(({ Num_Ficha }, pos) => {
          return (
            <section key={nextId()}>
              <label>Ficha Número {Num_Ficha} : </label>
              {
                !click ? <span className={`color_${colors[++colorSelector]}`} ></span> :
                  <span className={`color_${colors[++colorSelector]} btn_color`} onClick={() => changeShedule(pos + 1)}></span>
              }
            </section>
          )
        })
      }
      {
        dataUser?.Complementaria && dataUser.Complementaria.map((e, pos) => {
          return (
            <section key={nextId()}>
              <label>Formación Complementaria {pos + 1} : </label>
              {
                !click ? <span className={`color_${colors[++colorSelector]}`} ></span> :
                  <span className={`color_${colors[++colorSelector]} btn_color`} onClick={() => changeShedule(colorSelector)}></span>
              }
            </section>
          )
        })
      }
      {
        dataUser?.Horas && dataUser.Horas.some(({ color }) => color === 'p') ? (
          <section key={nextId()}>
            <label>Preparación Formación : </label>
            {
              !click ? <span className={`color_${colors['p']}`}></span> :
                <span className={`color_${colors['p']} btn_color`} onClick={() => changeShedule('p')}></span>
            }
          </section>
        ) : ''
      }
    </>
  )
}

export default React.memo(ComponentResume)