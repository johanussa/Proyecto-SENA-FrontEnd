import React, { useEffect } from 'react';
import { colors } from '../../components/data';

function CompShowShedule({ userSelected, sizeShed, setSizeShed, setTableTitle, clearTable }) {
  if (userSelected.Horario.length) {
    
    const dataShedule = userSelected.Horario[sizeShed];
    let colorSelector = 1;

    useEffect(() => {
      setTableTitle(`Horario Asignado : ${dataShedule.Horas.length} Horas`);
    }, [sizeShed]);

    const formatDate = date => {
      if (!date) return;
      date = date.replaceAll('-', '/');
      date = new Date(date);
      return Intl.DateTimeFormat('CO', { dateStyle: 'full' }).format(date);
    }
    const changeData = action => {
      if (action) {
        if (sizeShed + 1 === userSelected.Horario.length) return;
        setSizeShed(sizeShed + 1);
      } else {
        if (sizeShed - 1 >= 0) {
          setSizeShed(sizeShed - 1);
        }
      }
    }
    clearTable();
    setTimeout(() => {
      let td = document.querySelectorAll('td');
      dataShedule.Horas.forEach(e => td[e.pos].classList.add(`color_${colors[e.color]}`));
    }, 1);

    return (
      <> 
        <h2>HORARIOS</h2>
        <section className="dates_range">
          <i onClick={() => changeData(0)} className="bi bi-caret-left-fill icons_change_date"></i>
          <span>{formatDate(dataShedule.FechaInicio)}</span> A
          <span>{formatDate(dataShedule.FechaFin)}</span>
          <i onClick={() => changeData(1)} className="bi bi-caret-right-fill icons_change_date"></i>
        </section>
        {
          dataShedule.Ficha.length ? (
            dataShedule.Ficha.map((e, pos) => {
              console.log(e);
              return (
                <form className={'color_' + [colors[colorSelector++]]} key={pos + 5}>
                  <section>
                    <label>Número de Ficha:</label><input type="text" placeholder={e.Num_Ficha} disabled />
                  </section>
                  <section>
                    <label>Número de Ruta:</label><input type="text" placeholder={e.Num_Ruta} disabled />
                  </section>
                  <section>
                    <label>Trimestre:</label><input type="text" placeholder={e.Trimestre} disabled />
                  </section>
                  <section>
                    <label>Codigo Programa:</label><input type="text" placeholder={e.Codigo} disabled />
                  </section>
                  <section className="programa_forma">
                    <label>Programa de Formación:</label><input type="text" placeholder={e.Programa} disabled />
                  </section>
                  <section>
                    <label>Núm. Aprendices:</label><input type="text" placeholder={e.Num_Aprendices} disabled />
                  </section>
                  <section>
                    <label>Núm. Ambiente:</label><input type="text" placeholder={e.Ambiente} disabled />
                  </section>
                  <section className="sect_competencia">
                    <label>Competencias:</label>
                    <textarea disabled defaultValue={e.Competencias.map(e => `- ${e}`).join().replaceAll(',', '\n')}></textarea>
                  </section>
                  <section className="sect_results">
                    <label>Resultados :</label>
                    <textarea disabled defaultValue={e.Resultados.map(e => `- ${e}`).join().replaceAll(',', '\n')}></textarea>
                  </section>
                  <section className="sect_descrip">
                    <label>Descripción:</label><textarea disabled defaultValue={e.Descripcion}></textarea>
                  </section>
                </form>
              )
            })
          ) : ''
        }
        {
          dataShedule.Complementaria.length ? (
            dataShedule.Complementaria.map((e, pos) => {
              return (
                <form className={'form_update_descrip color_' + [colors[colorSelector++]]} key={pos + 15}>
                  <section>
                    <label htmlFor="update_comple">Descripción Formación Complementaria :</label>
                    <textarea disabled defaultValue={e}></textarea>
                  </section>
                </form>
              )
            })
          ) : ''
        }
      </>
    )
  } else {
    return <h3>El Instructor {userSelected.Apellido} Aun No tiene Horarios Asignados </h3>
  }
}

export default React.memo(CompShowShedule)