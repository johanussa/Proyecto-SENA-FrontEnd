import React, { useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import { colors } from '../../components/data';

function ComponentResume({ user, index, sizeShed, click = false, setEventActive, setColorSelector, setSaveUpdate, setAmbienteUp }) {
  
  const [dataUser, setDataUser] = useState();
  
  useEffect(() => {
    if (click) setDataUser(user[index].Horario[sizeShed]);
    else setDataUser(user.Horario[sizeShed]);
  }, [sizeShed])
  
  const changeShedule = (color, Ambiente = false) => {
    document.querySelector('.btns_table').firstElementChild.style.display = 'none';
    document.querySelector('.btns_table').style.display = 'flex';
    setSaveUpdate(true);
    setColorSelector(color);
    setEventActive(true);
    Ambiente ? setAmbienteUp(Ambiente) : setAmbienteUp(false);
  }
  
  if (user?.Horario && !user.Horario.length) return;
  return (
    <>
      {
        dataUser?.Ficha && dataUser.Ficha.map(({ Num_Ficha, Color, Ambiente }) => {
          return (
            <section key={nextId()}>
              <label>Ficha Número {Num_Ficha} : </label>
              {
                !click ? <span className={`color_${colors[Color]}`} ></span> :
                  <span className={`color_${colors[Color]} btn_color`} onClick={() => changeShedule(Color, Ambiente)}></span>
              }
            </section>
          )
        })
      }
      {
        dataUser?.Complementaria && dataUser.Complementaria.map((e, pos) => {
          let color = dataUser.Horas.reduce((acum, elm) => {
            if (!elm?.Ambiente && !acum[elm.color] && Number(elm.color)) { 
              if (!acum.some(e => e === elm.color)) acum.push(elm.color);
            }
            return acum;
          }, []);
          return (
            <section key={nextId()}>
              <label>Formación Complementaria {pos + 1} : </label>
              {
                !click ? <span className={`color_${colors[color[pos]]}`} ></span> :
                  <span className={`color_${colors[color[pos]]} btn_color`} onClick={() => changeShedule(color[pos])}></span>
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