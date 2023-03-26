import React, { useEffect, useState } from 'react';
import CompUpdateFicha from './CompUpdateFicha';
import { useMutation } from '@apollo/client';
import { UpdateShedule } from '../../graphQL/shedules/mutationShedule';
import { confirmChanges } from './CompUpdateFicha';
import ComponentResume from './ComponentResume';
import Swal from 'sweetalert2';

function ComponentUpdate({ instructor, sizeShed, setEventActive, setColorSelector, setSaveUpdate, setAmbienteUp }) {
  const [user, setUser] = useState({});
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const [mutUpShedule, resultsUpShedule] = useMutation(UpdateShedule);

  let posShedule = instructor?.Horario && instructor.Horario.length - 1;

  useEffect(() => {
    if (instructor.Horario.length)
      setUser(instructor.Horario[posShedule]);
  }, []);

  useEffect(() => {
    if (resultsUpShedule.error) Swal.fire('Error!', `${resultsUpShedule.error.message}`, 'error');
    if (resultsUpShedule.data) {
      Swal.fire('Almacenado!', 'Los cambios en la Fecha han sido guardados.', 'success');
      setUser(resultsUpShedule.data.updateShedule.Horario[posShedule]); 
      resultsUpShedule.reset();
    }  
  }, [resultsUpShedule]);

  const formatDate = date => {
    if (!date) return;
    date = date.replaceAll('-', '/');
    date = new Date(date);
    return Intl.DateTimeFormat('CO', { dateStyle: 'full' }).format(date);
  }
  const updateDates = async () => {
    if (dateStart || dateEnd) {
      if (await confirmChanges('Cambiar la fecha del Horario', 'Cambiarla!')) {
        if (dateStart) {
          instructor.Horario[posShedule].FechaInicio = dateStart;
          setDateStart('');
        }
        if (dateEnd) {
          instructor.Horario[posShedule].FechaFin = dateEnd;
          setDateEnd('');
        }
        mutUpShedule({ variables: {
          id: instructor._id,
          horario: [...instructor.Horario]
        }});
      }
    }
  }

  if (instructor && !instructor.Horario.length) {
    const nameUser = `${instructor.Instructor.Nombre} ${instructor.Instructor.Apellido}`
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
      {user?.Horas && <CompUpdateFicha user={user} setUser={setUser} instructor={instructor} posShedule={posShedule} />}
      <section className='sec_resume_update'>
        { user?.Horas && <ComponentResume user={user} sizeShed={sizeShed} click={true} setEventActive={setEventActive} 
          setColorSelector={setColorSelector} setSaveUpdate={setSaveUpdate} setAmbienteUp={setAmbienteUp} /> }
      </section>
    </>
  )
}

export default ComponentUpdate