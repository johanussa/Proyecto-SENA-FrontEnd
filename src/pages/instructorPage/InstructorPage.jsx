import React, { useEffect, useRef, useState } from 'react';
import './css/styleInstructor.css';
import { data, colors } from '../../components/data';
import CompShowShedule from '../managementShedule/CompShowShedule';
import ComponentResume from '../managementShedule/ComponentResume';

function InstructorPage() {

  const [user, setUser] = useState({});
  const [selectShedule, setSelectShedule] = useState(0);
  const [titleTable, setTitleTable] = useState('');
  const bodyTable = useRef();

  useEffect(() => {
    const userData = data.find(({ Identificacion }) => Identificacion === 6151013848);
    setUser(userData);
    setSelectShedule(userData.Horario.length - 1);
    clearTable();
  }, []);
  
  const clearTable = () => {
    setTimeout(() => {
      let pos = 0;
      bodyTable.current.innerHTML = '';
      for (let i = 0; i < 16; i++) {
        bodyTable.current.innerHTML += `
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
    }, 1);
  }

  if (!Object.values(user).length) return <h1>Loading . . .</h1>
  return (
    <>
      <section className="inst_container">
        <section className="info_instructor">
          <h1 id="name_instructor">{`${user.Nombre} ${user.Apellido}`}</h1>
          <span>Instructor</span>
        </section>

        <section className="show_shedule instructor_page">
          <section className='show_cards'>
            { user.Horario.length && <CompShowShedule userSelected={user} sizeShed={selectShedule} setSizeShed={setSelectShedule}
              setTableTitle={setTitleTable} clearTable={clearTable} /> }
          </section>
          <section className="resume_Show">
            { user.Horario.length && <ComponentResume user={user} sizeShed={selectShedule} /> }
          </section>
        </section>

        <main className="table_shedule">
          <h2 className="cantHoras">{ titleTable }</h2>
          <section className="resume"></section>
          <section className="show_table">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="th_hour">Hora</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miercoles</th>
                  <th>Jueves</th>
                  <th>Viernes</th>
                  <th>Sabado</th>
                  <th>Domingo</th>
                </tr>
              </thead>
              <tbody id="table_body" ref={bodyTable}></tbody>
            </table>
          </section>
        </main>
      </section>
    </>
  )
}

export default React.memo(InstructorPage)