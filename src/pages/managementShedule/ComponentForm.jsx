import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GetNames, GetClassRooms } from '../../graphQL/programs/queryPrograms';
import { GetProgram, GetSheduleAmb } from '../../graphQL/programs/queryPrograms';
import Swal from 'sweetalert2';
import { colors } from '../../components/data';

let compSelected = [], resultsSelected = [];

function ComponentForm({ btnsAction, form, setForm, setTableTitle, colorSelector, changeAmbiente, inputAmbiente, date }) {

  const [selectComp, setSelectComp] = useState({});
  const [selectResults, setSelectResults] = useState({});
  const [getPrograms, resultsProgram] = useLazyQuery(GetProgram);
  const [getAmbShedule, resSheduleAmb] = useLazyQuery(GetSheduleAmb);
  const respClassRooms = useQuery(GetClassRooms);
  const respNames = useQuery(GetNames);

  useEffect(() => {
    if (resSheduleAmb.error) Swal.fire('Error!', `${resSheduleAmb.error.message}`, 'error');
    if (resSheduleAmb.data) {
      let td = document.querySelectorAll('td');
      td.forEach(e => e.classList.remove(`ocupation`));
      resSheduleAmb.data.getSheduleClassRoom.forEach(e => td[e].classList.add(`ocupation`));
    }
  }, [resSheduleAmb]);

  useEffect(() => {
    if (respNames.error) Swal.fire('Error!', `${respNames.error.message}`, 'error');
    if (respClassRooms.error) Swal.fire('Error!', `${respClassRooms.error.message}`, 'error');
  }, [respClassRooms, respNames]);

  useEffect(() => {
    if (resultsProgram.error) Swal.fire('Error!', `${resultsProgram.error.message}`, 'error');
    if (resultsProgram.data) {
      const comp = resultsProgram.data.getOneProgram.Competencias.Competencias;
      setSelectComp(comp);
    }
  }, [resultsProgram]);

  const changeInput = e => {
    let optionID = {
      Programa: () => {
        setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
        getPrograms({ variables: { nombre: e.target.value } });
        setSelectResults([]);
        area_comp.innerHTML = '';
        compSelected = [];
        resultsSelected = [];
      },
      Nom_Comp: () => {
        let pos = compSelected.indexOf(e.target.value);
        if (pos === -1) compSelected.push(e.target.value);
        else compSelected.splice(pos, 1);
        setForm(prev => ({ ...prev, ['Competencias']: compSelected }));
        area_comp.innerHTML = '';
        compSelected.forEach(e => area_comp.innerHTML += `- ${e}\n`);

        const nameCompt = e.target.value.split(' ')[0];
        const newData = resultsProgram.data.getOneProgram.Resultados.Resultados.find(e => e.Nombre === nameCompt);
        setSelectResults(newData.ResultComp);
        e.target.value = '';
      },
      Nom_Result: () => {
        let posResult = resultsSelected.indexOf(e.target.value);
        if (posResult === -1) resultsSelected.push(e.target.value);
        else resultsSelected.splice(posResult, 1);
        setForm(prev => ({ ...prev, ['Resultados']: resultsSelected }));
        area_result_create.innerHTML = '';
        resultsSelected.forEach(e => area_result_create.innerHTML += `- ${e}\n`);
        e.target.value = '';
      },
      Ambiente: () => {
        getAmbShedule({ variables: { fechaInicio: date.value, ambiente: `${e.target.value}.` } });   // ------ Remover el punto
        if (form?.Ambiente) changeAmbiente(e.target.value);
        else setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
      }
    }
    if (optionID[e.target.id]) optionID[e.target.id]();
    else setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
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
  }
  const resetData = () => {
    area_comp.innerHTML = '';
    area_result_create.innerHTML = '';
    setForm({});
  }

  return (
    <article className="form">
      <form onChange={changeInput} id="formCreate" onSubmit={handleSubmit}>
        <section>
          <label htmlFor="Num_Ficha">Número de Ficha :</label>
          <input type="number" id="Num_Ficha" placeholder="1234567" required />
        </section>
        <section>
          <label htmlFor="Num_Ruta">Número de Ruta :</label>
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
          <label htmlFor="Trimestre">Trimestre :</label>
          <select name="Trimestre" defaultValue={''} id="Trimestre" required>
            <option disabled value="">Seleccione . . .</option>
            <option value="1 de 4">1 de 3</option>
            <option value="2 de 4">2 de 3</option>
            <option value="3 de 4">3 de 3</option>
            <option value="4 de 7">4 de 7</option>
            <option value="5 de 7">5 de 7</option>
            <option value="6 de 7">6 de 7</option>
            <option value="7 de 7">7 de 7</option>
          </select>
        </section>
        <section>
          <label htmlFor="Codigo">Codigo de Programa :</label>
          <input type="text" name="Codigo" id="Codigo" placeholder="233104 V.1" />
        </section>
        <section className='programa_forma'>
          <label htmlFor="Programa">Programa de Formación :</label>
          <select name="Programa" defaultValue={''} id="Programa" required>
            <option disabled value="">Seleccione . . .</option>
            {respNames.data && respNames.data.allProgramsName.map(e =>
              <option key={e} value={e}>{e}</option>)}
          </select>
        </section>
        <section>
          <label htmlFor="Num_Aprendices">Número de Aprendices :</label>
          <input type="number" id="Num_Aprendices" placeholder="25" min="8" max="40" />
        </section>
        <section>
          <label htmlFor="Ambiente">Número de Ambiente :</label>
          <select name="Ambiente" defaultValue={''} id="Ambiente" required ref={inputAmbiente}>
            <option disabled value="">Seleccione . . .</option>
            {respClassRooms.data && respClassRooms.data.allAmbientes[0].Ambientes.map(e =>
              <option key={e} value={e}>{e}</option>)}
          </select>
        </section>
        <section className="sect_competencia">
          <label htmlFor="Competencias">Competencias :</label>
          <select id="Nom_Comp" defaultValue={''}>
            <option disabled value="">Seleccione . . .</option>
            {selectComp.length ? selectComp.map(e => <option key={e} value={e}>{e}</option>) : ''}
          </select>
          <textarea id="area_comp" disabled></textarea>
        </section>
        <section className="sect_results">
          <label htmlFor="Competencias">Resultados :</label>
          <select id="Nom_Result" defaultValue={''}>
            <option disabled value="">Seleccione . . .</option>
            {selectResults.length ? selectResults.map(e => <option key={e} value={e}>{e}</option>) : ''}
          </select>
          <textarea id="area_result_create" disabled></textarea>
        </section>
        <section className='sec_description'>
          <label htmlFor="Descripcion">Descripción:</label>
          <textarea id="Descripcion" rows="5"></textarea>
        </section>
        <section className="btns_actions">
          <button type="button" onClick={() => btnsAction(4)}>Cancelar</button>
          <button type="reset" onClick={resetData}>Resetear</button>
          <button type="submit">Continuar</button>
        </section>
      </form>
    </article>
  )
}

export default ComponentForm
