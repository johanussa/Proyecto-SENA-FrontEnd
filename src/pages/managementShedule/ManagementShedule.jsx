import React, { useEffect, useId, useRef, useState } from 'react';
import senaLogo from '../../assets/Sena_logo.png';
import logoSANF from '../../assets/logoSANF2.png';
import { programas, data, aulas, colors, competencias as competData } from './data';
import CompShowShedule from './CompShowShedule';
import ComponentFile from './ComponentFile';
import './css/styleShedule.css';
import CompUpdateShedule from './CompUpdateShedule';
import ComponentUpdate from './ComponentUpdate';

let countAsignacion = 1, colorSelector = 0, cantHours = 0;
let activeFicha = false, flagPlaneacion = false, saveUpdate = false, eventActive = false;
let shedule = [], dataFicha = [], Competencias = [], complement = [], aux = [];
let userSelected, date_start, date_end, Num_Ficha, Num_Ruta;
let Trimestre, Programa, Codigo, Descripcion, textCompl;
let Num_Aprendices, Ambiente, length, indexUser;

function ManagementShedule() {

  const [dataDB, setDataDB] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);
  const [nameUser, setNameUser] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [hoursAsig, setHoursAsig] = useState(0);
  const [hourSinAsig, setHoursSinAsig] = useState(0);
  const [tableTitle, setTableTitle] = useState('');
  const [selectComp, setSelectComp] = useState([]);
  const [showCompShedule, setShowCompShedule] = useState(false);
  const [showUpdateShedule, setShowUpdateShedule] = useState(false);
  const [sizeShed, setSizeShed] = useState('');
  const [form, setForm] = useState({});

  useEffect(() => {
    setDataDB(data);
    setDataTemp(data);
    setTableTitle('⬅ Seleccione a un Instructor');
    clearTable();
  }, []);

  const handlerinputSearch = e => {
    const expReg = new RegExp(e.target.value, 'i');
    const filter = dataDB.filter(e =>
      expReg.test(e.Identificacion) || expReg.test(`${e.Nombre} ${e.Apellido}`
    ));
    setDataTemp(filter);
  };
  const selectInstructor = id => {
    indexUser = dataDB.findIndex(e => e.Identificacion === id);
    userSelected = JSON.parse(JSON.stringify(dataDB[indexUser]));
    setDataTemp(new Array(userSelected));

    document.forms['form_complementario'].reset();
    document.forms['formCreate'].reset();
    clearTable();
    shedule = [];
    dataFicha = [];
    complement = [];
    Competencias = [];
    colorSelector = 0;
    activeFicha = false;
    flagPlaneacion = false;
    saveUpdate = false;
    length = userSelected.Horario.length - 1;
    setSizeShed(length);
    setShowCompShedule(false);
    setShowUpdateShedule(false);

    const { Nombre, Apellido } = userSelected;
    setNameUser(`${Nombre} ${Apellido}`);

    document.querySelector('.btns_table').firstElementChild.style.display = 'block';
    document.querySelector('.name_instructor').style.display = 'block';
    document.querySelector('.btns_options').style.display = 'flex';
    document.querySelector('.show_hours').style.display = 'none';
    document.querySelector('section.show_shedule').style.display = 'none';
    document.querySelector('section.update_info').style.display = 'none';
    document.querySelector('.type_contrato').style.display = 'none';
    document.querySelector('.create_shedule').style.display = 'none';
    document.querySelector('#formCreate').style.display = 'none';
    document.querySelector('.form_complem').style.display = 'none';
    document.querySelector('.table_shedule').style.display = 'none';
  }
  const handleClickTable = e => {
    if (eventActive) {
      if (e.target && e.target.tagName == 'TD') {
        let pos = Number(e.target.id);
        const posNum = shedule.findIndex(e => e.pos === pos);
        if (posNum === -1) {
          if (cantHours - shedule.length === 0) {
            return alert('Ya completaste el número de Horas para éste Instructor');
          }
          if (Ambiente) {
            shedule.push({ pos, color: colorSelector, Ambiente });
            aux.push(pos);
          } else { shedule.push({ pos, color: colorSelector }); }
          e.target.classList.toggle(`color_${colors[colorSelector]}`);
        } else if (shedule[posNum].color === colorSelector) {
          shedule.splice(posNum, 1);
          const posAux = aux.findIndex(e => e === pos);
          aux.splice(posAux, 1);
          e.target.classList.toggle(`color_${colors[colorSelector]}`);
        }
        updateHours();
      }
    }
  }
  const changeInput = e => {
    let options = {
      Num_Ficha: () => setForm(prev => ({ ...prev, [e.target.id] : e.target.value })),
      Num_Ruta: () => setForm(prev => ({ ...prev, [e.target.id] : e.target.value })),
      Trimestre: () => setForm(prev => ({ ...prev, [e.target.id] : e.target.value })),
      Programa: () => {
        setForm(prev => ({ ...prev, [e.target.id] : e.target.value }));
        const name = e.target.value.split(' ')[0];
        const comp = competData.filter(e => e[name]);
        setSelectComp(comp[0][name]);
        area_comp.innerHTML = '';
        Competencias = [];
      },
      Codigo: () => setForm(prev => ({ ...prev, [e.target.id] : e.target.value.toUpperCase() })),
      Nom_Comp: () => {
        let pos = Competencias.indexOf(e.target.value);
        if (pos === -1) {
          Competencias.push(e.target.value); 
          setForm(prev => ({ ...prev, Competencias }));
        } else {
          Competencias.splice(pos, 1);
          setForm(prev => ({ ...prev, Competencias }));
        } 
        area_comp.innerHTML = '';
        Competencias.forEach(e => area_comp.innerHTML += `- ${e}\n`);
        document.getElementById('Nom_Comp').value = '';
      },
      Descripcion: () => setForm(prev => ({ ...prev, [e.target.id] : e.target.value })),
      Num_Aprendices: () => setForm(prev => ({ ...prev, [e.target.id] : e.target.value })),
      Ambiente: () => {
        let ambBefore = Ambiente;
        setForm(prev => ({ ...prev, [e.target.id] : e.target.value }));
        if (aux.length) {
          shedule.forEach(e => { if (e.Ambiente === ambBefore) e.Ambiente = form.Ambiente });
        }
      }
    }
    if (e.target) options[e.target.id]();
  }
  const updateHours = () => {
    setTotalHours(cantHours);
    setHoursAsig(shedule.length);
    setHoursSinAsig(cantHours - shedule.length);
  }
  const createShedule = () => {
    document.querySelector('.btns_options').style.display = 'none';
    document.querySelector('.type_contrato').style.display = 'flex';
  }
  const typeContrato = horas => {
    cantHours = horas; updateHours();
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
                <th scope="row">
                    ${(i + 6 < 10) ? 0 : ''}${i + 6}:00 - ${(i + 7 < 10) ? 0 : ''}${i + 7}:00
                </th>
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
        const filter = dataDB.filter(e => e.Estado_Horario === true);
        if (filter.length) setDataTemp(filter)
        countAsignacion++;
      },
      2: () => {
        const filter = dataDB.filter(e => e.Estado_Horario === false);
        if (filter.length) setDataTemp(filter);
        countAsignacion++;
      },
      3: () => { setDataTemp(dataDB); countAsignacion = 1; }
    }
    options[countAsignacion]();
  }
  const btnContinue = () => {
    if (validateAmb()) {
      const resume = document.querySelector('.resume');
      area_comp.innerHTML = '';
      document.forms['formCreate'].reset();
      document.forms['formCreate'].style.display = 'none';

      setTableTitle('Horario Asignado :');
      resume.style.display = 'grid';
      document.querySelector('.btn_add_ficha').style.display = 'flex';
      document.querySelector('.form_complem').style.display = 'none';

      if (!shedule.some(e => e.color === colorSelector)) {
        resume.removeChild(resume.lastElementChild);
        if (flagPlaneacion) flagPlaneacion = false;
        complement = [];
        aux = [];
        textCompl = '';
        activeFicha = false;
        colorSelector--;
      }
      if (activeFicha && !dataFicha.some(e => e.Num_Ficha === form.Num_Ficha)) dataFicha.push(form);
      if (textCompl) {
        complement.push(textCompl);
        textCompl = '';
      }
      eventActive = false;
      Competencias = [];
      Ambiente = '';
    }
  }
  const validateAmb = () => {
    let flag = false;
    if (aux.length) {
      dataDB.some(ins => {
        if (ins.Horario.length) {
          const shedIns = ins.Horario[ins.Horario.length - 1];
          if (shedIns.FechaInicio === date_start.value) {
            const find = aux.some(posCom => {
              if (shedIns.Horas.some(e => e.pos === posCom && e.Ambiente === Ambiente)) {
                alert(`El instructor ${ins.Nombre} ${ins.Apellido} Ya tiene asignado el Ambiente ${Ambiente}`
                  + `\nPor favor elija otro Ambiente`);
                document.getElementById('Ambiente').focus();
                flag = true;
                return true;
              }
            });
            if (find) return true;
          }
        } else { return false; }
      });
      if (flag) return false;
      else return true;
    } else { return true; }
  }
  const handleSubmit = e => {
    e.preventDefault();
    document.querySelector('.btns_table').style.display = 'flex';
    document.querySelector('.table_shedule').style.display = 'grid';
    document.querySelector('.btns_actions').style.display = 'none';
    setTableTitle(`Asignar Horario a la Ficha : ${e.target.Num_Ficha.value}`);
    document.querySelector('.resume').innerHTML += `
        <section>
            <label>Ficha Número ${e.target.Num_Ficha.value} : </label>
            <span class="color_${colors[colorSelector]}"></span>
        </section>
    `;
  };
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
  const btnsAction = btn => {
    if (colorSelector === 'p' || Number.isNaN(colorSelector)) {
      const valorNew = shedule.reduce((count, elem) => {
        if (count < elem.color) count = elem.color;
        return count;
      }, 0);
      colorSelector = valorNew;
    }
    const options = {
      1: () => {
        colorSelector++;
        activeFicha = true;
        eventActive = true;
        document.querySelector('.type_contrato').style.display = 'none';
        document.querySelector('.btns_actions').style.display = 'flex';
        document.querySelector('#formCreate').style.display = 'grid';
        document.querySelector('.table_shedule').style.display = 'none';
      },
      2: () => {
        colorSelector = 'p';
        eventActive = true;
        document.querySelector('.table_shedule').style.display = 'grid';
        document.querySelector('.btns_table').style.display = 'flex';
        document.querySelector('.resume').style.display = 'grid';
        if (!flagPlaneacion) {
          document.querySelector('.resume').innerHTML += `
            <section>
                <label htmlFor="">Preparación Formación :</label>
                <span class="color_${colors[colorSelector]}"></span>
            </section>
          `;
          flagPlaneacion = true;
        }
      },
      3: () => {
        colorSelector++;
        eventActive = true;
        document.forms['form_complementario'].reset();
        document.querySelector('.resume').style.display = 'grid';
        document.querySelector('.btns_table').style.display = 'flex';
        document.querySelector('.form_complem').style.display = 'block';
        document.querySelector('.btns_form_comple').style.display = 'block';
        document.querySelector('.table_shedule').style.display = 'none';
      },
      4: () => {
        if (colorSelector > 0) colorSelector--;
        document.forms['formCreate'].reset();
        document.forms['form_complementario'].reset();
        document.querySelector('.btn_add_ficha').style.display = 'flex';
        document.querySelector('.form_complem').style.display = 'none';
      }
    }
    if (validateDate()) {
      document.querySelector('#formCreate').style.display = 'none';
      document.querySelector('.btn_add_ficha').style.display = 'none';
      setTableTitle('Asignación de Horario')
      options[btn]();
    }
  }
  const validateDate = () => {
    date_start = document.getElementById('date_start');
    date_end = document.getElementById('date_end');

    if (dataDB[indexUser].Horario.length) {
      if (dataDB[indexUser].Horario.some(e => e.FechaInicio === date_start.value)) {
        date_start.focus();
        return alert(`El Instructor ${userSelected.Apellido} Ya tiene asignado un horario para esa fecha`);
      }
    }
    if (!date_start.value) {
      alert('Ingrese la Fecha de Inicio');
      date_start.focus();
      return false;
    } else if (!date_end.value) {
      alert('Ingrese la Fecha Final');
      date_end.focus();
      return false;
    } else return true;
  }
  const saveData = () => {
    if (!(cantHours - shedule.length)) {
      if (saveUpdate) {
        dataDB[indexUser].Horario[length].Horas = shedule;
        saveUpdate = false;
        document.querySelector('.btns_table').style.display = 'none';
        alert('Horario Actalizado Correctamente!!');
      } else {
        btnContinue();
        let objectData = {
          FechaInicio: date_start.value,
          FechaFin: date_end.value,
          Ficha: dataFicha,
          Complementaria: complement,
          Horas: shedule
        }
        dataDB[indexUser].Estado_Horario = true;
        dataDB[indexUser].Horario.push(objectData);
        alert('Información Almacenada Correctamente!!');
        selectInstructor(userSelected.Identificacion);
      }
    } else { alert('Aun No ha asignado las horas requeridas'); }
  }

  const viewShedule = () => {
    const dataShedule = userSelected.Horario;
    document.querySelector('section.show_shedule').style.display = 'flex';
    document.querySelector('.btns_table').style.display = 'none';
    document.querySelector('.btns_options').style.display = 'none';
    setShowCompShedule(true);
    if (dataShedule.length) document.querySelector('.table_shedule').style.display = 'grid';
  }
  const updateShedule = () => {
    userSelected = JSON.parse(JSON.stringify(dataDB[indexUser]));
    document.querySelector('.btns_table').style.display = 'none';
    document.querySelector('.btns_options').style.display = 'none';
    document.querySelector('section.update_info').style.display = 'grid';
    setShowUpdateShedule(true);

    if (userSelected.Horario.length) {
      const user = JSON.parse(JSON.stringify(dataDB[indexUser].Horario[length]));
      document.querySelector('.table_shedule').style.display = 'grid';
      document.querySelector('.show_hours').style.display = 'block';
      cantHours = user.Horas.length;
      shedule = user.Horas.map(e => e);
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
            {
              dataTemp.length ? dataTemp.map(e => {
                const { Identificacion, Nombre, Apellido, Estado_Horario } = e;
                return (
                  <section key={Identificacion} className="info_instructor"
                    onClick={() => selectInstructor(Identificacion)}>
                    <article><i className="bi bi-person-circle icons"></i></article>
                    <section>
                      <article className="name">{Nombre} {Apellido}</article>
                      <article className="identification">{Identificacion.toLocaleString()}</article>
                      <span id="state">{Estado_Horario ? 'Asignado' : 'No Asignado'}</span>
                    </section>
                  </section>
                )
              }) : <p>No se encontraron coincidencias</p>
            }
          </section>
          <aside className="show_hours">
            <p>Total Horas</p>
            <span className="total_horas">{totalHours}</span>
            <p>Horas Asignadas</p>
            <span className="horas_asignadas">{hoursAsig}</span>
            <p>Horas por Asignar</p>
            <span className="horas_restantes">{hourSinAsig}</span>
          </aside>
        </section>

        <section className="body_shedule">
          <section className="header_body">
            <article>
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
              <button onClick={() => typeContrato(42)}>Planta</button>
              <button onClick={() => typeContrato(40)}>Contratista</button>
            </article>
          </section>

          <section className="create_shedule">
            <h2>Crear Horarios</h2>
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

          <article className="form">
            <form onChange={changeInput} id="formCreate" onSubmit={handleSubmit}>
              <section>
                <label htmlFor="Num_Ficha">Número de Ficha:</label>
                <input type="number" name="Num_Ficha" id="Num_Ficha" placeholder="2557679" required />
              </section>
              <section>
                <label htmlFor="Num_Ruta">Número de Ruta:</label>
                <select name="Num_Ruta" defaultValue={''} id="Num_Ruta" required>
                  <option disabled value="">Seleccione . . .</option>
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
                <select name="Trimestre" defaultValue={''} id="Trimestre" required>
                  <option disabled value="">Seleccione . . .</option>
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
                <label htmlFor="Programa">Programa de Formación:</label>
                <select name="Programa" defaultValue={''} id="Programa" required>
                  <option disabled value="">Seleccione . . .</option>
                  {programas.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </section>
              <section>
                <label htmlFor="Codigo">Codigo de Programa:</label>
                <input type="text" name="Codigo" id="Codigo" placeholder="233104 V.1" />
              </section>
              <section className="div_competencia">
                <label htmlFor="Competencias">Competencias:</label>
                <select id="Nom_Comp" defaultValue={''}>
                  <option disabled value="">Seleccione . . .</option>
                  {selectComp.length ? selectComp.map(e => <option key={e} value={e}>{e}</option>) : ''}
                </select>
                <textarea id="area_comp" disabled></textarea>
              </section>
              <section>
                <label htmlFor="Descripcion">Descripción:</label>
                <textarea name="descripcion" id="Descripcion" rows="5"></textarea>
              </section>
              <section>
                <div>
                  <label htmlFor="Num_Aprendices">Número de Aprendices:</label>
                  <input type="number" id="Num_Aprendices" placeholder="25" min="10" max="40" />
                </div>
                <div>
                  <label htmlFor="Ambiente">Número de Ambiente:</label>
                  <select name="Ambiente" defaultValue={''} id="Ambiente" required>
                    <option disabled value="">Seleccione . . .</option>
                    {aulas.length ? aulas.map(e => <option key={e} value={e}>{e}</option>) : ''}
                  </select>
                </div>
              </section>
              <section className="btns_actions">
                <button type="button" onClick={() => btnsAction(4)}>Cancelar</button>
                <button type="reset">Resetear</button>
                <button type="submit">Continuar</button>
              </section>
            </form>
          </article>

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
            <h2>HORARIOS</h2>
            <section className='show_cards'>
              {showCompShedule && <CompShowShedule userSelected={userSelected} sizeShed={sizeShed} 
                setSizeShed={setSizeShed} setTableTitle={setTableTitle} clearTable={clearTable} />}
            </section>
            <section className="resume_Show">
              {showCompShedule && <ComponentFile user={userSelected} sizeShed={sizeShed} setSizeShed={setSizeShed} />}
            </section>
          </section>

          <section className="update_info">
            {/* { showUpdateShedule && <CompUpdateShedule userSelected={userSelected} setTableTitle={setTableTitle} clearTable={clearTable} changeInput={changeInput} form={form} setForm={setForm} dataDB={dataDB} setDataDB={setDataDB} index={indexUser} /> } */}
            { showUpdateShedule && <ComponentUpdate dataDB={dataDB} setDataDB={setDataDB} index={indexUser} clearTable={clearTable}/> }
          </section>

          <main className="table_shedule">
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
          </main>
        </section>
      </main>
    </section>
  )
}

export default ManagementShedule