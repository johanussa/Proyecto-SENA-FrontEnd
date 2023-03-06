import React, { useEffect, useState } from 'react'
import CompUpdateFicha from './CompUpdateFicha';

function ComponentUpdate({ dataDB, setDataDB, index }) {

  const [user, setUser] = useState({});
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  let posShedule = dataDB[index].Horario.length - 1;

  useEffect(() => {
    if (dataDB[index].Horario.length)
      setUser(JSON.parse(JSON.stringify(dataDB[index].Horario[posShedule])));
  }, []);

  const formatDate = date => {
    if (!date) return;
    date = date.replaceAll('-', '/');
    date = new Date(date);
    return Intl.DateTimeFormat('CO', { dateStyle: 'full' }).format(date);
  }
  const updateDates = () => {
    if (dateStart) {
      setDataDB(prev => {
        prev[index].Horario[posShedule].FechaInicio = dateStart;
        return [...prev];
      });
      setDateStart('');
    }
    if (dateEnd) {
      dataDB[index].Horario[posShedule].FechaFin = dateEnd;
      setDataDB(prev => {
        prev[index].Horario[posShedule].FechaFin = dateEnd;
        return [...prev];
      });
      setDateEnd('');
    }
    setUser(dataDB[index].Horario[posShedule]);
  }

  if (!dataDB[index].Horario.length) {
    const nameUser = `${dataDB[index].Nombre} ${dataDB[index].Apellido}`
    return <h3>El Instructor {nameUser} Aun No tiene Horarios Asignados </h3>
  }
  return (
    <>
      <section className="update_dates">
        <section className="dates_before">
          <span>{formatDate(user.FechaInicio)}</span> A
          <span>{formatDate(user.FechaFin)}</span>
        </section>
        <section className="dates_after">
          <article>
            <label htmlFor="update_start">Fecha de Inicio : </label>
            <input type="date" className="input_date" id="update_start" onChange={e => setDateStart(e.target.value)} />
          </article>
          <article>
            <label htmlFor="update_end">Fecha Fin : </label>
            <input type="date" className="input_date" id="update_end" onChange={e => setDateEnd(e.target.value)} />
          </article>
          <button className='btn_update_date' onClick={updateDates}>Actualizar Fecha</button>
        </section>
      </section>
      <CompUpdateFicha user={user} setUser={setUser} dataDB={dataDB} setDataDB={setDataDB} index={index} posShedule={posShedule} />
    </>
  )
}

export default ComponentUpdate