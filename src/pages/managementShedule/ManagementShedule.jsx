import { data, colors } from '../../components/data';
import React, { useEffect, useRef, useState } from 'react';
import senaLogo from '../../assets/Sena_logo.png';
import logoSANF from '../../assets/logoSANF2.png';
import CompShowShedule from './CompShowShedule';
import ComponentUpdate from './ComponentUpdate';
import ComponentResume from './ComponentResume';
import Swal from 'sweetalert2'
import './css/styleShedule.css';
import ComponentForm from './ComponentForm';
import { confirmChanges } from './CompUpdateFicha';

let countAsignacion = 1, cantHours = 0, cantPlaneacion = 0;
let activeFicha = false, flagPlaneacion = false, planta = false;
let limitPlan = false, limitInduc = false;
let shedule = [], dataFicha = [], complement = [], aux = [];
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
  const inputAmbiente = useRef();

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
    shedule = [];
    dataFicha = [];
    complement = [];
    activeFicha = false;
    flagPlaneacion = false;
    clearTable();
    setColorSelector(0);
    setSaveUpdate(false);
    setSizeShed(userSelected.Horario.length - 1);
    setShowCompShedule(false);
    setShowUpdateShedule(false);
    setCompleteFicha(false);
    setShowCreateShedule(false);
    setAmbienteUp(false);

    const { Nombre, Apellido } = userSelected;
    setNameUser(`${Nombre} ${Apellido}`);

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
          if (form.Ambiente || ambienteUp) {
            shedule.push({ pos, color: colorSelector, Ambiente: form.Ambiente || ambienteUp });
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
  const changeAmbiente = ambNew => {
    let ambBefore = form.Ambiente;
    if (aux.length) shedule.forEach(e => { if (e.Ambiente === ambBefore) e.Ambiente = ambNew; });
    setForm(prev => ({ ...prev, ['Ambiente']: ambNew }));
  }
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
      setTableTitle('Horario Asignado :');
      resume.style.display = 'grid';
      document.querySelector('.btn_add_ficha').style.display = 'flex';
      document.querySelector('.form_complem').style.display = 'none';

      if (!shedule.some(({ color }) => color === colorSelector)) {
        resume.removeChild(resume.lastElementChild);
        if (flagPlaneacion) flagPlaneacion = false;
        textCompl = '';
        activeFicha = false;
        setColorSelector(colorSelector - 1);
      }
      if (Object.values(form).length) {
        if (activeFicha && !dataFicha.some(({ Num_Ficha }) => Num_Ficha === form.Num_Ficha)) {
          dataFicha.push({ ...form, ['Color']: colorSelector });
        }
      }
      if (textCompl) {
        complement.push(textCompl);
        textCompl = '';
      }
      aux = [];
      setShowCreateShedule(false);
      setForm({});
      setEventActive(false);
      setAmbienteUp(false);
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
              if (shedIns.Horas.some(e => e.pos === posCom && e.Ambiente === form.Ambiente)) {
                Swal.fire({
                  icon: 'warning',
                  title: `El instructor ${ins.Nombre} ${ins.Apellido} Ya tiene asignado el Ambiente ${form.Ambiente}`
                    + `\nPor favor elije otro Ambiente`,
                  showConfirmButton: false,
                  timer: 4000
                }); bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
                setTimeout(() => { inputAmbiente.current.focus(); }, 4280);
                flag = true;
                return true;
              }
            });
            if (find) return true;
          }
        } else return false;
      });
      if (flag) return false;
      else return true;
    } else return true;
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
        if (count < elem.color) count = elem.color;
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

    if (dataDB[indexUser].Horario.length) {
      if (dataDB[indexUser].Horario.some(({ FechaInicio }) => FechaInicio === date_start.value)) {
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
  const saveData = async (complete = false, confirm = false) => {
    if (complete === true) {
      btnContinue();
      if (saveUpdate) {
        if (await confirmChanges()) {
          if (dataFicha.length) {
            dataDB[indexUser].Horario[sizeShed].Ficha.push(...dataFicha);
            dataFicha = [];
          }
          dataDB[indexUser].Horario[sizeShed].Complementaria = complement;
          dataDB[indexUser].Horario[sizeShed].Horas = shedule;
          document.querySelector('.btns_table').style.display = 'none';
          Swal.fire('Almacenado!', 'Horario Actalizado Correctamente!!.', 'success');
          if (!(cantHours - shedule.length) || confirm) selectInstructor(userSelected.Identificacion);
        }
      } else {
        if (await confirmChanges()) {
          let objectData = {
            FechaInicio: date_start.value,
            FechaFin: date_end.value,
            Ficha: dataFicha,
            Complementaria: complement,
            Planta: planta,
            Horas: shedule
          }
          dataDB[indexUser].Estado_Horario = true;
          dataDB[indexUser].Horario.push(objectData);
          Swal.fire('Almacenado!', 'Horario Guardado Correctamente!!.', 'success');
          selectInstructor(userSelected.Identificacion);
        }
      }
    } else {
      if (!(cantHours - shedule.length)) return saveData(true);
      Swal.fire({
        title: 'Aún no ha asignado el horario completo!!',
        text: "¿Desea guardarlo asi, y completarlo en otro momento?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3faa68',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Guardado!', 'El horario ha sido almacenado.', 'success');
          saveData(true, true);
        }
      });
    }
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
    setEventActive(false)
    setSaveUpdate(true);

    if (userSelected.Horario.length) {
      const user = JSON.parse(JSON.stringify(dataDB[indexUser].Horario[sizeShed]));

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
            colorSelector={colorSelector} changeAmbiente={changeAmbiente} inputAmbiente={inputAmbiente} clearTable={clearTable} />}

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
            {showUpdateShedule && <ComponentUpdate dataDB={dataDB} setDataDB={setDataDB} index={indexUser} />}
            <section className='sec_resume_update'>
              {showUpdateShedule && <ComponentResume user={dataDB} index={indexUser} sizeShed={sizeShed} click={true}
                setEventActive={setEventActive} setColorSelector={setColorSelector} setSaveUpdate={setSaveUpdate} setAmbienteUp={setAmbienteUp} />}
            </section>
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