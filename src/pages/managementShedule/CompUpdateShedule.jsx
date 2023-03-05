import React, { useEffect, useState, useId } from 'react';
import CompResumeUpdate from './CompResumeUpdate';
import { colors, competencias, programas } from './data';

function CompUpdateShedule({ userSelected, setTableTitle, clearTable, changeInput, form, setForm, dataDB, setDataDB, index }) {

  const [user, setUser] = useState(JSON.parse(JSON.stringify(userSelected.Horario[userSelected.Horario.length - 1])));
  const [textCompl, setTextCompl] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [prograUp, setPrograUp] = useState('');

  useEffect(() => {
    setTableTitle(`Horario Asignado : ${user.Horas.length} Horas`);
  }, [userSelected]);

  if (userSelected.Horario.length) {
    let colorSelector = 1;
    const sizeShedule = userSelected.Horario.length - 1;    

    const formatDate = date => {
      if (!date) return;
      date = date.replaceAll('-', '/');
      date = new Date(date);
      return Intl.DateTimeFormat('CO', { dateStyle: 'full' }).format(date);
    }
    const showPrograms = () => programas.map(e => <option value={e} key={useId()}>{e}</option>);
    const showCompet = e => {
      const name = e.split(' ')[0];
      const aux = competencias.filter(e => e[name]);
      return aux[0][name].map(elm => <option value={elm} key={useId()}>{elm}</option>);
    }
    const saveFicha = (pos) => {
      let newData = JSON.parse(JSON.stringify(dataDB[index].Horario[sizeShedule].Ficha[pos]));
        newData = { ...newData, ...form, Programa: prograUp }
        // setDataDB(prev => {
        //   prev[index].Horario[sizeShedule].Ficha[pos] = newData;
        //   return [...prev];
        // });
        dataDB[index].Horario[sizeShedule].Ficha[pos] = newData
        setDataDB([ ...dataDB ]);
        alert('La Ficha, ha sido actualizada');
        setUser(JSON.parse(JSON.stringify(dataDB[index].Horario[sizeShedule])));
        console.log(dataDB[index].Horario[sizeShedule].Ficha[pos]);
    }
    const updateData = (e, pos = 0) => {
      if (e === 1) {
        // let newData = dataDB[index].Horario[sizeShedule].Ficha[pos];
        // newData = { ...newData, ...form }
        // setDataDB(prev => {
        //   prev[index].Horario[sizeShedule].Ficha[pos] = newData;
        //   return [...prev];
        // });
        // alert('La Ficha, ha sido actualizada');
        // setUser(dataDB[index].Horario[sizeShedule]);
        // setForm('');
      } else if (e === 2) {
        if (textCompl) {
          setDataDB(prev => {
            prev[index].Horario[sizeShedule].Complementaria[pos] = textCompl;
            return [...prev];
          });
          alert('La formacion complementaria, ha sido actualizada');
          setUser(dataDB[index].Horario[sizeShedule]);
          setTextCompl('');
        }
      } else if (e === 3) {
        if (dateStart) {
          setDataDB(prev => {
            prev[index].Horario[sizeShedule].FechaInicio = dateStart;
            return [...prev];
          });
          setDateStart('');
        }
        if (dateEnd) {
          dataDB[index].Horario[sizeShedule].FechaFin = dateEnd;
          setDataDB(prev => {
            prev[index].Horario[sizeShedule].FechaFin = dateEnd;
            return [...prev];
          });
          setDateEnd('');
        }
        setUser(dataDB[index].Horario[sizeShedule]);
      } else {
        let options = {
          Programa: () => {
            console.log(e.target.value)
            setPrograUp(e.target.value);
            const name = e.target.value.split(' ')[0];
            const comp = competencias.filter(e => e[name]);
            const selectComp = document.getElementsByName('comp_upd');
            selectComp[pos].innerHTML = '<option selected disabled value="">Seleccione . . .</option>';
            comp[0][name].forEach(e => selectComp[pos].innerHTML += `<option value="${e}">${e}</option>`);
            // form['Programa'] = e.target.value
            // setForm({ ...form });
          },
          Nom_Comp_Up: () => {
            let compData;
            if (!form.Competencias) {
              compData = JSON.parse(JSON.stringify(user.Ficha[pos].Competencias));
              let index = compData.indexOf(e.target.value);
              if (index === -1) compData.push(e.target.value);
              else compData.splice(index, 1);
            } else {
              compData = JSON.parse(JSON.stringify(form.Competencias));
              let index = compData.indexOf(e.target.value);
              if (index === -1) compData.push(e.target.value);
              else compData.splice(index, 1);
            }
            setForm(prev => ({ ...prev, ['Competencias']: compData}));
            // setUser({...user, [user.Ficha[pos].Competencias] : compData});
            // e.target.value = '';
          }
        }
        if (options[e.target.id]) return options[e.target.id]();
        changeInput(e);
      }
    }
    clearTable();
    let td = document.querySelectorAll('td');
    user.Horas.forEach(e => td[e.pos].classList.toggle(`color_${colors[e.color]}`)) ;

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
            <button className='btn_update_date' onClick={() => updateData(3)}>Actualizar Fecha</button>
          </section>
        </section>
        {
          user.Ficha.length ? (
            user.Ficha.map((e, pos) => {
              return (
                <form className={'color_' + [colors[colorSelector++]]} key={useId()} >
                  <section>
                    <label htmlFor="Num_Ficha">Número de Ficha:</label>
                    <input type="number" id="Num_Ficha" placeholder={e.Num_Ficha} onChange={updateData}/>
                  </section>
                  <section>
                    <label htmlFor="Num_Ruta">Número de Ruta:</label>
                    <select name="Num_Ruta" id="Num_Ruta" defaultValue={''} onChange={updateData}>
                      <option value="" disabled>{e.Num_Ruta}</option>
                      <option value="Grupo 1">Grupo 1</option>
                      <option value="Grupo 2">Grupo 2</option>
                      <option value="Grupo 3">Grupo 3</option>
                      <option value="Grupo 4">Grupo 4</option>
                      <option value="Grupo 5">Grupo 5</option>
                      <option value="Grupo 6">Grupo 6</option>
                    </select>
                  </section>
                  <section>
                    <label htmlFor="Trimestre">Trimestre:</label>
                    <select name="Trimestre" defaultValue={''} id="Trimestre" onChange={updateData}>
                      <option value="" disabled>{e.Trimestre}</option>
                      <option value="1 de 4">1 de 4</option>
                      <option value="2 de 4">2 de 4</option>
                      <option value="3 de 4">3 de 4</option>
                      <option value="4 de 4">4 de 4</option>
                      <option value="5 de 7">5 de 7</option>
                      <option value="6 de 7">6 de 7</option>
                      <option value="7 de 7">7 de 7</option>
                    </select>
                  </section>
                  <section>
                    <label htmlFor="Codigo">Codigo Programa:</label>
                    <input type="text" id="Codigo" placeholder={e.Codigo} onChange={updateData}/>
                  </section>
                  <section className="programa_forma">
                    <label htmlFor="Programa">Programa de Formación:</label>
                    <select name="Select_Programa" defaultValue={''} id="Programa" onChange={(event) => updateData(event, `${pos}`)}>
                      <option disabled value="">{e.Programa}</option>
                      {showPrograms()}
                    </select>
                  </section>
                  <section>
                    <label htmlFor="Num_Aprendices">Núm. Aprendices:</label>
                    <input type="number" id="Num_Aprendices" onChange={updateData} placeholder={e.Num_Aprendices} />
                  </section>
                  <section>
                    <label htmlFor="Ambiente">Núm. Ambiente:</label>
                    <select name="Select_Ambiente" defaultValue={''} id="Ambiente" onChange={updateData}>
                      <option disabled value="">{e.Ambiente}</option>
                    </select>
                  </section>
                  <section className="sect_competencia">
                    <label htmlFor="Competencias">Competencias:</label>
                    <select id="Nom_Comp_Up" name="comp_upd" defaultValue={''} onChange={(event) => { updateData(event, `${pos}`)}}>
                      <option disabled value="">Seleccione . . .</option>
                      {showCompet(e.Programa)}
                    </select>
                    <textarea rows="9" name="text_area_up" disabled
                      defaultValue={e.Competencias.map(e => `-${e}`).join().replaceAll(',', '\n')}>
                    </textarea>
                  </section>
                  <section className="sect_descrip">
                    <label htmlFor="Descripcion">Descripción:</label>
                    <textarea id="Descripcion" rows="5" onChange={updateData} defaultValue={e.Descripcion}></textarea>
                  </section>
                  <section className="update_btns">
                    {/* <button type="button" onClick={() => updateData(1, `${pos}`)}>Guardar</button> */}
                    <button type="button" onClick={() => saveFicha(pos)}>Guardar</button>
                  </section>
                </form>
              )
            })
          ) : ''
        }
        {
          user.Complementaria.length ? (
            user.Complementaria.map((e, pos) => {
              return (
                <form className={`form_update_descrip color_${colors[colorSelector++]}`} key={useId()} >
                  <section>
                    <label htmlFor="update_comple">Descripción Formación Complementaria :</label>
                    <textarea id="update_comple" onChange={(e) => setTextCompl(e.target.value)} defaultValue={e}></textarea>
                  </section>
                  <section className="update_btns">
                    <button type="button" onClick={() => updateData(2, `${pos}`)}>Guardar</button>
                  </section>
                </form>
              )
            })
          ) : ''
        }
        <section className='sec_resume_update'>
          {function () { colorSelector = 1 }()}
          {
            user.Ficha.length ? (
              user.Ficha.map((e, pos) => {
                return (
                  <CompResumeUpdate ficha={e.Num_Ficha} name={'Ficha Número'} select={pos + 1} color={colorSelector++} />
                )
              })
            ) : ''
          }
          {
            user.Complementaria.length ? (
              user.Complementaria.map((e, pos) => {
                return (
                  <CompResumeUpdate ficha={user.Complementaria.length > 1 ? pos + 1 : ''} name={`Formación Complementaria`} select={'c'} color={colorSelector++} />
                )
              })
            ) : ''
          }
          {
            user.Horas.some(e => e.color === 'p') ? (
              <CompResumeUpdate ficha={''} name={'Preparación Formación'} select={'p'} color={'p'} />
            ) : ''
          }
        </section>
      </>
    )
  } else {
    return <h3>El Instructor {userSelected.Apellido} Aun No tiene Horarios Asignados </h3>
  }
}

export default React.memo(CompUpdateShedule)