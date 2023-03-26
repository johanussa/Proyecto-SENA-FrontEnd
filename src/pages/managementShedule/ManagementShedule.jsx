import React, { useEffect, useRef, useState } from 'react';
import { colors } from '../../components/data';
import { confirmChanges } from './CompUpdateFicha';
import senaLogo from '../../assets/Sena_logo.png';
import logoSANF from '../../assets/logoSANF2.png';
import CompShowShedule from './CompShowShedule';
import ComponentUpdate from './ComponentUpdate';
import ComponentResume from './ComponentResume';
import ComponentForm from './ComponentForm';
import removeTypeName from 'remove-graphql-typename';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GetUsersRol } from '../../graphQL/users/queryUser';
import { GetShedule } from '../../graphQL/shedules/queryShedule';
import { CreateShedule } from '../../graphQL/shedules/mutationShedule';
import { UpdateShedule } from '../../graphQL/shedules/mutationShedule';
import Swal from 'sweetalert2';
import './css/styleShedule.css';

let countAsignacion = 1, cantHours = 0, cantPlaneacion = 0;
let activeFicha = false, flagPlaneacion = false, planta = false;
let limitPlan = false, limitInduc = false;
let shedule = [], dataFicha = [], complement = [];
let userSelected, date_start, date_end, textCompl, indexUser;

function ManagementShedule() {

  const [dataDB, setDataDB] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);
  const [nameUser, setNameUser] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [hoursAsig, setHoursAsig] = useState(0);
  const [hourSinAsig, setHoursSinAsig] = useState(0);
  const [planHours, setPlanHours] = useState(0);
  const [totalPlanHours, setTotalPlanHours] = useState(0);
  const [tableTitle, setTableTitle] = useState('');
  const [showCompShedule, setShowCompShedule] = useState(false);
  const [showUpdateShedule, setShowUpdateShedule] = useState(false);
  const [sizeShed, setSizeShed] = useState('');
  const [form, setForm] = useState({});
  const [eventActive, setEventActive] = useState(false);
  const [colorSelector, setColorSelector] = useState(0);
  const [saveUpdate, setSaveUpdate] = useState(false);
  const [showCreateShedule, setShowCreateShedule] = useState(false);
  const [titleCreateShed, setTitleCreateShed] = useState('');
  const [completeFicha, setCompleteFicha] = useState(false);
  const [ambienteUp, setAmbienteUp] = useState(false);

  const { error, loading, data } = useQuery(GetUsersRol, { variables: { rol: 'INSTRUCTOR' } });
  const [loadShedule, results] = useLazyQuery(GetShedule);
  const [addShedule, resultsAddShedule] = useMutation(CreateShedule);
  const [mutUpShedule, resultsUpShedule] = useMutation(UpdateShedule);
  const inputAmbiente = useRef();

  useEffect(() => {
    if (data) {
      setDataDB(data.allUsers);
      setDataTemp(data.allUsers);
      setTableTitle('⬅ Seleccione a un Instructor');
      clearTable();
    }
    if (error) Swal.fire('Error!', `${error.message}`, 'error');
  }, [data, error]);

  useEffect(() => {
    if (results.data) {
      setSizeShed(results.data.getOneShedule.Horario.length - 1);
      userSelected = JSON.parse(JSON.stringify(results.data.getOneShedule));
      userSelected.Horario = userSelected.Horario.map(e => {
        const outTypeName = removeTypeName(e);
        return outTypeName;
      });
    }
    if (results.error) {
      setSizeShed(0);
      userSelected = { Horario: [], Instructor: { ...dataTemp[0] } };
    }
  }, [results]);

  useEffect(() => {
    if (resultsAddShedule.error) Swal.fire('Error!', `${resultsAddShedule.error.message}`, 'error');
    if (resultsUpShedule.error) Swal.fire('Error!', `${resultsUpShedule.error.message}`, 'error');
    if (resultsUpShedule.data) {
      Swal.fire('Almacenado!', 'Los cambios en el Horarios, han sido guardados.', 'success');
      resultsUpShedule.reset(); 
    }
  }, [resultsAddShedule, resultsUpShedule]);

  if (error) return <h2>{error.message}</h2>;

  const handlerinputSearch = e => {
    const expReg = new RegExp(e.target.value, 'i');
    const filter = dataDB.filter(e => expReg.test(e.Num_Documento) || expReg.test(`${e.Nombre} ${e.Apellido}` ));
    setDataTemp(filter);
  }
  const selectInstructor = id => {
    loadShedule({ variables: { instructor: id } });
    indexUser = dataDB.findIndex(e => e._id === id);
    userSelected = dataDB[indexUser];
    setDataTemp(new Array(userSelected));  // le quite el stringify

    document.forms['form_complementario'].reset();
    shedule = [];
    dataFicha = [];
    complement = [];
    activeFicha = false;
    flagPlaneacion = false;
    clearTable();
    setColorSelector(0);
    setSaveUpdate(false);
    setShowCompShedule(false);
    setShowUpdateShedule(false);
    setCompleteFicha(false);
    setShowCreateShedule(false);
    setAmbienteUp(false);
    setNameUser(`${userSelected.Nombre} ${userSelected.Apellido}`);

    document.querySelector('.btns_table').firstElementChild.style.display = 'block';
    document.querySelector('.name_instructor').style.display = 'block';
    document.querySelector('.btns_options').style.display = 'flex';
    document.querySelector('article.dates').style.display = 'flex';
    document.querySelector('.show_hours').style.display = 'none';
    document.querySelector('section.show_shedule').style.display = 'none';
    document.querySelector('section.update_info').style.display = 'none';
    document.querySelector('.type_contrato').style.display = 'none';
    document.querySelector('.create_shedule').style.display = 'none';
    document.querySelector('.form_complem').style.display = 'none';
    document.querySelector('.table_shedule').style.display = 'none';
    document.querySelectorAll('td').forEach(e => e.classList.remove(`ocupation`));
  }
  const handleClickTable = e => {
    if (eventActive) {
      if (e.target && e.target.tagName == 'TD') {
        let pos = Number(e.target.id);
        const posNum = shedule.findIndex(e => e.pos === pos);
        if (posNum === -1) {
          if (cantHours - shedule.length === 0) {
            return Swal.fire('Atencion!', 'Ya completaste el número de Horas para éste Instructor.', 'warning');
          }
          if ((totalHours - cantPlaneacion) === hoursAsig + 1) {
            if (!limitInduc) {
              Swal.fire('Atencion!', 'Ya ha asignado las horas de Inducción correspondientes.', 'info');
              limitInduc = true;
            }
          } else limitInduc = false;
          if (totalPlanHours === cantPlaneacion - 1) {
            if (!limitPlan) {
              Swal.fire('Atencion!', 'Ya ha asignado las horas de Preparación de formación correspondientes.', 'info');
              limitPlan = true;
            }
          } else limitPlan = false;
          if (!e.target.classList.contains('ocupation')) {
            if (form.Ambiente || ambienteUp) {
              shedule.push({ pos, color: String(colorSelector), Ambiente: form.Ambiente || ambienteUp });
            } else { shedule.push({ pos, color: String(colorSelector) }); }
            e.target.classList.add(`color_${colors[colorSelector]}`);
          }
        } else if (shedule[posNum].color === String(colorSelector)) {
          shedule.splice(posNum, 1);
          e.target.classList.remove(`color_${colors[colorSelector]}`);
        }
        updateHours();
      }
    }
  }
  const changeAmbiente = ambNew => setForm(prev => ({ ...prev, ['Ambiente']: ambNew }));
  const updateHours = () => {
    setTotalHours(cantHours);
    setPlanHours(cantPlaneacion);
    let hoursAsign = shedule.reduce((acum, elm) => {
      if (elm.color !== 'p') acum++;
      return acum;
    }, 0);
    let countPrepHours = shedule.filter(e => e.color === 'p').length;
    setHoursAsig(hoursAsign);
    setTotalPlanHours(countPrepHours);
    setHoursSinAsig(cantHours - shedule.length);
  }
  const createShedule = () => {
    document.querySelector('.btns_options').style.display = 'none';
    document.querySelector('.type_contrato').style.display = 'flex';
    setTitleCreateShed('Crear Horarios');
  }
  const typeContrato = typeCont => {
    cantHours = 42;
    cantPlaneacion = typeCont ? 10 : 6;
    typeCont ? planta = true : planta = false;
    updateHours();
    document.querySelector('.show_hours').style.display = 'block';
    document.querySelector('.create_shedule').style.display = 'block';
    document.querySelector('.btn_add_ficha').style.display = 'flex';
  }
  const clearTable = () => {
    document.getElementById('table_body').innerHTML = '';
    document.querySelector('.resume').innerHTML = '';
    let pos = 0;
    for (let i = 0; i < 16; i++) {
      document.getElementById('table_body').innerHTML += `
        <tr>
          <th scope="row">${(i + 6 < 10) ? 0 : ''}${i + 6}:00 - ${(i + 7 < 10) ? 0 : ''}${i + 7}:00</th>
          <td id="${pos++}" class="color_none"></td>
          <td id="${pos++}" class="color_none"></td>
          <td id="${pos++}" class="color_none"></td>
          <td id="${pos++}" class="color_none"></td>
          <td id="${pos++}" class="color_none"></td>
          <td id="${pos++}" class="color_none"></td>
          <td id="${pos++}" class="color_none"></td>
        </tr>
      `;
    }
  }
  const btnFilter = () => {
    if (userSelected) countAsignacion = 3;
    const options = {
      1: () => {
        const filter = dataDB.filter(e => e.Active === true);
        if (filter.length) setDataTemp(filter)
        countAsignacion++;
      },
      2: () => {
        const filter = dataDB.filter(e => e.Active === false);
        if (filter.length) setDataTemp(filter);
        countAsignacion++;
      },
      3: () => { setDataTemp(dataDB); countAsignacion = 1; }
    }
    options[countAsignacion]();
  }
  const btnContinue = () => {
    const resume = document.querySelector('.resume');
    setTableTitle('Horario Asignado :');
    resume.style.display = 'grid';
    document.querySelector('.btn_add_ficha').style.display = 'flex';
    document.querySelector('.form_complem').style.display = 'none';
    document.querySelector('article.dates').style.display = 'flex';

    if (!shedule.some(({ color }) => color === String(colorSelector))) {
      resume.removeChild(resume.lastElementChild);
      if (flagPlaneacion) flagPlaneacion = false;
      textCompl = '';
      activeFicha = false;
      setColorSelector(colorSelector - 1);
    }
    if (Object.values(form).length && activeFicha) dataFicha.push({ ...form, ['Color']: colorSelector });
    if (textCompl) {
      complement.push(textCompl);
      textCompl = '';
    }
    setShowCreateShedule(false);
    setForm({});
    setEventActive(false);
    setAmbienteUp(false);
    activeFicha = false;
    document.querySelectorAll('td').forEach(e => e.classList.remove(`ocupation`));
  }
  const handleformComplem = e => {
    e.preventDefault();
    document.querySelector('.btns_form_comple').style.display = 'none';
    document.querySelector('.table_shedule').style.display = 'grid';
    document.querySelector('.resume').innerHTML += `
      <section>
        <label>Formación Complementaria ${complement.length + 1} : </label>
        <span class="color_${colors[colorSelector]}"></span>
      </section>
    `;
  };
  const changeSelectorColor = () => {
    if (colorSelector === 'p' || Number.isNaN(colorSelector)) {
      const valorNew = shedule.reduce((count, elem) => {
        if (count < Number(elem.color)) count = Number(elem.color);
        return count;
      }, 0);
      setColorSelector(valorNew + 1);
    }
  }
  const btnsAction = btn => {
    const options = {
      1: () => {
        if (colorSelector === 'p') changeSelectorColor();
        else setColorSelector(colorSelector + 1);
        activeFicha = true;
        setShowCreateShedule(true);
        setEventActive(true);
        document.querySelector('.type_contrato').style.display = 'none';
        document.querySelector('.table_shedule').style.display = 'none';
        document.querySelector('article.dates').style.display = 'none';
      },
      2: () => {
        setColorSelector('p');
        setEventActive(true);
        document.querySelector('.table_shedule').style.display = 'grid';
        document.querySelector('.btns_table').style.display = 'flex';
        document.querySelector('.resume').style.display = 'grid';
        if (!flagPlaneacion) {
          document.querySelector('.resume').innerHTML += `
            <section>
              <label htmlFor="">Preparación Formación :</label>
              <span class="color_${colors['p']}"></span>
            </section>
          `;
          flagPlaneacion = true;
        }
      },
      3: () => {
        if (colorSelector === 'p') changeSelectorColor();
        else setColorSelector(colorSelector + 1);
        setEventActive(true);
        document.forms['form_complementario'].reset();
        document.querySelector('.resume').style.display = 'grid';
        document.querySelector('.btns_table').style.display = 'flex';
        document.querySelector('.form_complem').style.display = 'block';
        document.querySelector('.btns_form_comple').style.display = 'block';
        document.querySelector('.table_shedule').style.display = 'none';
      },
      4: () => {
        if (colorSelector > 0) setColorSelector(colorSelector - 1);
        document.forms['form_complementario'].reset();
        document.querySelector('.btn_add_ficha').style.display = 'flex';
        document.querySelector('.form_complem').style.display = 'none';
        document.querySelector('article.dates').style.display = 'flex';
        setShowCreateShedule(false);
        setAmbienteUp(false);
      }
    }
    if (validateDate()) {
      document.querySelector('.btn_add_ficha').style.display = 'none';
      document.querySelector('.btns_table').firstElementChild.style.display = 'block';
      setTableTitle('Asignación de Horario');
      options[btn]();
    }
  }
  const validateDate = () => {
    if (completeFicha) return true;
    date_start = document.getElementById('date_start');
    date_end = document.getElementById('date_end');

    if (userSelected.Horario.length) {
      if (userSelected.Horario.some(({ FechaInicio }) => FechaInicio === date_start.value)) {
        date_start.focus();
        Swal.fire('Atencion!', 
          `El Instructor ${userSelected.Instructor.Apellido} Ya tiene asignado un horario para esa fecha`, 'info');
        return false;
      }
    }
    if (!date_start.value) {
      date_start.focus();
      Swal.fire('Atencion!', 'Para continuar, Ingrese la Fecha de Inicio', 'info');
      return false;
    } else if (!date_end.value) {
      date_end.focus();
      Swal.fire('Atencion!', 'Para continuar, Ingrese la Fecha Final', 'info');
      return false;
    } else return true;
  }
  const saveData = async (complete = false, confirm = false) => {
    if (complete === true) {
      btnContinue();
      if (await confirmChanges('guardar los cambios realizados', 'Guardarlo')) {
        if (saveUpdate) {
          if (dataFicha.length) {
            userSelected.Horario[sizeShed].Ficha.push(...dataFicha);
            dataFicha = [];
          }
          userSelected.Horario[sizeShed].Complementaria = complement;
          userSelected.Horario[sizeShed].Horas = shedule;
          mutUpShedule({
            variables: {
              id: userSelected._id,
              horario: [...userSelected.Horario]
            }
          });
          document.querySelector('.btns_table').style.display = 'none';
          if (!(cantHours - shedule.length) || confirm) selectInstructor(userSelected.Instructor._id);
  
        } else {
          let objectData = {
            FechaInicio: date_start.value,
            FechaFin: date_end.value,
            Ficha: dataFicha,
            Complementaria: complement,
            Planta: planta,
            Horas: shedule
          }
          if (userSelected.Horario.length) {
            if (userSelected.Horario.length === 10) userSelected.Horario.shift();
            mutUpShedule({
              variables: {
                id: userSelected._id,
                horario: [...userSelected.Horario, objectData]
              }
            });
          } else {
            addShedule({
              variables: {
                instructor: userSelected.Instructor._id,
                horario: [objectData]
              }
            });
          }
          selectInstructor(userSelected.Instructor._id);
        }
      }
    } else {
      if (!(cantHours - shedule.length)) return saveData(true);
      if (await confirmChanges('guardarlo asi, y completarlo en otro momento', 'Guardar Así!', 'El Horario Esta Incompleto !!')) {
        saveData(true, true);
      }
    }
  }
  const viewShedule = () => {
    document.querySelector('section.show_shedule').style.display = 'flex';
    document.querySelector('.btns_table').style.display = 'none';
    document.querySelector('.btns_options').style.display = 'none';
    setShowCompShedule(true);
    if (userSelected?.Horario && userSelected.Horario.length) document.querySelector('.table_shedule').style.display = 'grid';
  }
  const updateShedule = () => {
    document.querySelector('.btns_table').style.display = 'none';
    document.querySelector('.btns_options').style.display = 'none';
    document.querySelector('section.update_info').style.display = 'grid';
    setShowUpdateShedule(true);
    setEventActive(false)
    setSaveUpdate(true);

    if (userSelected?.Horario && userSelected.Horario.length) {
      const user = JSON.parse(JSON.stringify(userSelected.Horario[sizeShed]));
      if (user.Horas.length < 42) {
        document.querySelector('.create_shedule').style.display = 'block';
        document.querySelector('.btn_add_ficha').style.display = 'flex';
        document.querySelector('article.dates').style.display = 'none';
        setTitleCreateShed('Completar Horario');
        date_start = user.FechaInicio;
        date_end = user.FechaFin;
        setCompleteFicha(true);

        const valorNew = user.Horas.reduce((count, elem) => {
          if (count < elem.color) count = elem.color;
          return count;
        }, 0);
        setColorSelector(valorNew);
      }

      setTableTitle(`Horario Asignado : ${user.Horas.length} Horas`);
      document.querySelector('.table_shedule').style.display = 'grid';
      document.querySelector('.show_hours').style.display = 'block';
      clearTable();
      let td = document.querySelectorAll('td');
      user.Horas.forEach(e => td[e.pos].classList.toggle(`color_${colors[e.color]}`));
      shedule = user.Horas.map(e => e);
      complement = user.Complementaria;
      cantPlaneacion = user.Planta ? 10 : 6;
      let cantPlan = user.Horas.reduce((acum, elm) => {
        if (elm.color === 'p') acum++;
        return acum;
      }, 0);
      setTotalPlanHours(cantPlan);
      cantHours = 42;
      updateHours();
    }
  }

  return (
    <section className="container">
      <header>
        <section className="title">
          <h1><i className="bi bi-clock-history icons"></i>Gestión de Horarios</h1>
        </section>
        <section className="logos">
          <img className="logos_head" src={senaLogo} alt="SENA" />
          <span>SENA - SANF</span>
          <img className="logos_head" src={logoSANF} alt="SANF" />
        </section>
      </header>
      <hr />
      <main className="main_shedule">
        <section className="side_left">
          <section className="div_instructors">
            <p>INSTRUCTORES</p>
            {loading ? (<h2>Loading . . .</h2>) : (
              dataTemp.length ? dataTemp.map(e => {
                const { Num_Documento, Nombre, Apellido, Active, _id } = e;
                return (
                  <section key={Num_Documento} className="info_instructor"
                    onClick={() => selectInstructor(_id)}>
                    <article><i className="bi bi-person-circle icons"></i></article>
                    <section>
                      <article className="name">{Nombre} {Apellido}</article>
                      <article className="identification">{new Intl.NumberFormat('CO').format(Num_Documento)}</article>
                      <span id="state">{Active ? 'Activado' : 'Sin Activar'}</span>
                    </section>
                  </section>
                )
              }) : <p>No se encontraron coincidencias</p>
            )}
          </section>
          <aside className="show_hours">
            <p>Total Horas</p>
            <span className="total_horas">{totalHours}</span>
            <p>Horas Planeación</p>
            <span className="horas_plane">{totalPlanHours} / {planHours}</span>
            <p>Horas Asignadas</p>
            <span className="horas_asignadas">{hoursAsig}</span>
            <p>Horas por Asignar</p>
            <span className="horas_restantes">{hourSinAsig}</span>
          </aside>
        </section>

        <section className="body_shedule">
          <section className="header_body">
            <article className='article_search'>
              <label htmlFor="search">Buscar</label>
              <input
                type="text" name="search" id="search" autoComplete="off"
                placeholder="Por Identificacion o Nombre" onInput={handlerinputSearch}
              />
            </article>
            <article>
              <button onClick={btnFilter}>
                Horarios Asignados / Sin Asignar / Todos
              </button>
            </article>
          </section>

          <section className="name_instructor">
            <h3 id="name_user">{nameUser}</h3>
            <span>Instructor</span>
          </section>

          <section className="btns_options">
            <h2>¿ Que desea Hacer ?</h2>
            <article>
              <button onClick={viewShedule}>Ver Horarios</button>
              <button onClick={createShedule}>Crear Horarios</button>
              <button onClick={updateShedule}>Modificar Horario</button>
            </article>
          </section>

          <section className="type_contrato">
            <h2>Seleccione el Tipo de Contrato del Instructor</h2>
            <article>
              <button onClick={() => typeContrato(1)}>Planta</button>
              <button onClick={() => typeContrato(0)}>Contratista</button>
            </article>
          </section>

          <section className="create_shedule">
            <h2>{titleCreateShed}</h2>
            <article className="dates">
              <div>
                <label htmlFor="date_start">Fecha de Inicio : </label>
                <input type="date" className="input_date" name="date_start" id="date_start" />
              </div>
              <div>
                <label htmlFor="date_end">Fecha Fin : </label>
                <input type="date" className="input_date" name="date_end" id="date_end" />
              </div>
            </article>

            <article className="btn_add_ficha">
              <div>
                <button onClick={() => btnsAction(1)}><span>+</span>Agregar Ficha</button>
              </div>
              <div>
                <button onClick={() => btnsAction(2)}><span>+</span>
                  Preparación de Acciones de Formación
                </button>
              </div>
              <div>
                <button onClick={() => btnsAction(3)}><span>+</span>Formación Complementaria</button>
              </div>
            </article>
          </section>

          {showCreateShedule && <ComponentForm btnsAction={btnsAction} form={form} setForm={setForm} setTableTitle={setTableTitle}
            colorSelector={colorSelector} changeAmbiente={changeAmbiente} inputAmbiente={inputAmbiente} date={date_start} />}

          <section className="form_complem">
            <form id="form_complementario" onSubmit={handleformComplem} onChange={e => textCompl = e.target.value}>
              <aside>
                <label htmlFor="form_comple">Descripción Formación Complementaria :</label>
                <textarea name="form_comple" id="form_comple" rows="8" required></textarea>
              </aside>
              <aside className="btns_form_comple">
                <button type="button" onClick={() => btnsAction(4)}>Cancelar</button>
                <button type="submit">Continuar</button>
              </aside>
            </form>
          </section>

          <section className="show_shedule">
            <section className='show_cards'>
              {showCompShedule && <CompShowShedule userSelected={userSelected} sizeShed={sizeShed}
                setSizeShed={setSizeShed} setTableTitle={setTableTitle} clearTable={clearTable} />}
            </section>
            <section className="resume_Show">
              {showCompShedule && <ComponentResume user={userSelected} sizeShed={sizeShed} />}
            </section>
          </section>

          <section className="update_info">
            {showUpdateShedule && <ComponentUpdate instructor={userSelected} sizeShed={sizeShed} click={true} setEventActive={setEventActive}
              setColorSelector={setColorSelector} setSaveUpdate={setSaveUpdate} setAmbienteUp={setAmbienteUp} />}
          </section>

          <section className="table_shedule">
            <h2>{tableTitle}</h2>
            <section className="resume"></section>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Hora</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miercoles</th>
                  <th>Jueves</th>
                  <th>Viernes</th>
                  <th>Sabado</th>
                  <th>Domingo</th>
                </tr>
              </thead>
              <tbody id="table_body" onClick={handleClickTable}></tbody>
            </table>
            <section className="btns_table">
              <button className="save_data" onClick={btnContinue}>Continuar</button>
              <button className="save_data" onClick={saveData}>Guardar</button>
            </section>
          </section>
        </section>
      </main>
    </section>
  )
}

export default React.memo(ManagementShedule)