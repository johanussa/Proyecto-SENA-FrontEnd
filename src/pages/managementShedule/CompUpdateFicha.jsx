import React, { useEffect, useState } from 'react';
import { colors, programas, competencias, aulas } from './data';

function CompUpdateFicha({ user, setUser, dataDB, setDataDB, index, posShedule }) {

  let colorSelector = 1;

  const [formUp, setFormUp] = useState({});
  const [textComplem, setTextComplem] = useState('');

  useEffect(() => {
    user?.Ficha && user.Ficha.map(({ Programa }, pos) => {
      changeComp(Programa, pos);
    });
    user?.Ficha && user.Ficha.map(({ Competencias }, pos) => {
      changeTextArea(Competencias, pos)
    });
  }, [user]);

  const changeTextArea = (compt, pos) => {
    const textAreaComp = document.getElementsByName('text_area_up');
    textAreaComp[pos].innerHTML = '';
    compt.map(e => textAreaComp[pos].innerHTML += `- ${e} \n`)
  }
  const changeComp = (programa, pos) => {
    const name = programa.split(' ')[0];
    const comp = competencias.filter(e => e[name]);
    const selectComp = document.getElementsByName('comp_upd');
    selectComp[pos].innerHTML = '<option selected disabled value="">Seleccione . . .</option>';
    comp[0][name].forEach(e => selectComp[pos].innerHTML += `<option value="${e}">${e}</option>`);
  }
  const changeData = (e, pos = '') => {
    let options = {
      Programa: () => {
        setFormUp(prev => ({ ...prev, ['Programa']: e.target.value }));
        changeComp(e.target.value, pos);
      },
      Nom_Comp: () => {
        let userCompet;
        if (formUp?.Competencias) {
          userCompet = formUp.Competencias;
          let index = userCompet.indexOf(e.target.value);
          if (index === -1) userCompet.push(e.target.value);
          else userCompet.splice(index, 1);
        } else {
          userCompet = user.Ficha[pos].Competencias;
          let index = userCompet.indexOf(e.target.value);
          if (index === -1) userCompet.push(e.target.value);
          else userCompet.splice(index, 1);
        }
        changeTextArea(userCompet, pos);
        setFormUp(prev => ({ ...prev, ['Competencias']: userCompet }));
        e.target.value = '';
      }
    }
    if (options[e.target.id]) options[e.target.id]();
    else setFormUp(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }
  const saveDataFicha = pos => {
    setDataDB(prev => {
      prev[index].Horario[posShedule].Ficha[pos] = { ...user.Ficha[pos], ...formUp };
      return [...prev];
    });
    setUser(JSON.parse(JSON.stringify(dataDB[index].Horario[posShedule])));
    alert('La Ficha, ha sido actualizada');
    setFormUp({});
  }
  const saveComplem = pos => {
    if (textComplem) {
      setDataDB(prev => {
        prev[index].Horario[posShedule].Complementaria[pos] = textComplem;
        return [...prev];
      });
      setUser(JSON.parse(JSON.stringify(dataDB[index].Horario[posShedule])));
      alert('La formacion complementaria, ha sido actualizada');
      setTextComplem('');
    }
  }  
  const showPrograms = () => programas.map(e => <option value={e} key={e}>{e}</option>);
  const showAmbientes = () => aulas.map(e => <option value={e} key={e}>{e}</option>);

  if (!Object.values(user).length) return (<h1>Loading...</h1>);
  return (
    <>
      {
        user.Ficha.map((e, pos) => {
          return (
            <form className={'color_' + [colors[colorSelector++]]} key={e.Num_Ficha} >
              <section>
                <label htmlFor="Num_Ficha">Número de Ficha:</label>
                <input type="number" id="Num_Ficha" placeholder={e.Num_Ficha} onChange={changeData} />
              </section>
              <section>
                <label htmlFor="Num_Ruta">Número de Ruta:</label>
                <select name="Num_Ruta" id="Num_Ruta" defaultValue={e.Num_Ruta} onChange={changeData}>
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
                <select name="Trimestre" defaultValue={e.Trimestre} id="Trimestre" onChange={changeData}>
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
                <input type="text" id="Codigo" placeholder={e.Codigo} onChange={changeData} />
              </section>
              <section className="programa_forma">
                <label htmlFor="Programa">Programa de Formación:</label>
                <select name="Select_Programa" defaultValue={e.Programa} id="Programa" onChange={e => changeData(e, pos)}>
                  {showPrograms()}
                </select>
              </section>
              <section>
                <label htmlFor="Num_Aprendices">Núm. Aprendices:</label>
                <input type="number" id="Num_Aprendices" placeholder={e.Num_Aprendices} onChange={changeData} />
              </section>
              <section>
                <label htmlFor="Ambiente">Núm. Ambiente:</label>
                <select name="Select_Ambiente" defaultValue={e.Ambiente} id="Ambiente" onChange={changeData}>
                  {showAmbientes()}
                </select>
              </section>
              <section className="sect_competencia">
                <label htmlFor="Competencias">Competencias:</label>
                <select id="Nom_Comp" name="comp_upd" defaultValue={''} onChange={e => changeData(e, pos)}></select>
                <textarea rows="9" name="text_area_up" disabled ></textarea>
              </section>
              <section className="sect_descrip">
                <label htmlFor="Descripcion">Descripción:</label>
                <textarea id="Descripcion" rows="5" defaultValue={e.Descripcion} onChange={changeData}></textarea>
              </section>
              <section className="update_btns">
                <button type="button" onClick={() => saveDataFicha(pos)}>Guardar</button>
              </section>
            </form>
          )
        })
      }
      {
        user.Complementaria.map((e, pos) => {
          return (
            <form className={`form_update_descrip color_${colors[colorSelector++]}`} key={pos} >
              <section>
                <label htmlFor="update_comple">Descripción Formación Complementaria :</label>
                <textarea id="update_comple" onChange={(e) => setTextComplem(e.target.value)} defaultValue={e}></textarea>
              </section>
              <section className="update_btns">
                <button type="button" onClick={() => saveComplem(pos)}>Guardar</button>
              </section>
            </form>
          )
        })
      }
    </>
  )
}

export default React.memo(CompUpdateFicha)