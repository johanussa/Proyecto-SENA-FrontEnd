import React, { useEffect, useState } from 'react';
import { GetUsers } from '../../graphQL/users/queryUser';
import { UpdateUser } from '../../graphQL/users/mutationUser';
import { useMutation, useQuery } from "@apollo/client";
import { confirmChanges } from '../managementShedule/CompUpdateFicha';
import senaLogo from '../../assets/Sena_logo.png';
import Swal from 'sweetalert2';
import './css/styleUsers.css';

let state = 1, rol = 1;
let rolData = [], stateData = [], dataSearch = [];

function ManagementUser() {

  const [dataDB, setDataDB] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);
  const { error, loading, data } = useQuery(GetUsers);
  const [upUser] = useMutation(UpdateUser);

  useEffect(() => {
    if (data) {
      setDataDB(JSON.parse(JSON.stringify(data.allUsers)));
      setDataTemp(JSON.parse(JSON.stringify(data.allUsers)));
    }
  }, [data]);

  if (error) return <h2>{error.message}</h2>;

  const handlerUpdate = async (id, action) => {
    if (await confirmChanges(`Cambiar el estado a ${action ? 'Activo' : 'Inactivo'}`, 'Cambiarlo')) {
      upUser({ variables: { id, active: action ? true : false } });
      const index = dataDB.findIndex(e => e._id === id);
      dataDB[index].Active = action ? true : false;
  
      if (rolData.length) setDataTemp(JSON.parse(JSON.stringify(rolData)));
      else if (stateData.length) setDataTemp(JSON.parse(JSON.stringify(stateData)));
      else if (dataSearch.length) setDataTemp(JSON.parse(JSON.stringify(dataSearch)));
      else { setDataTemp(JSON.parse(JSON.stringify(dataDB))); } 
      Swal.fire('Estado Actualizado!', `El Estado ha sido cambiado a ${action ? 'Activo' : 'Inactivo'}`, 'success');
    }
  }
  const inputSearch = e => {
    const regExp = new RegExp(e.target.value, 'i');

    if (rolData.length)
      dataSearch = rolData.filter(e => regExp.test(e.Num_Documento) || regExp.test(`${e.Nombre} ${e.Apellido}`));
    else if (stateData.length)
      dataSearch = stateData.filter(e => regExp.test(e.Num_Documento) || regExp.test(`${e.Nombre} ${e.Apellido}`));
    else dataSearch = dataDB.filter(e => regExp.test(e.Num_Documento) || regExp.test(`${e.Nombre} ${e.Apellido}`));

    if (!dataSearch.length) document.getElementById('data_not_found').classList.add('not_found');
    else document.getElementById('data_not_found').classList.remove('not_found');
    setDataTemp(dataSearch);
  };
  const focusSearch = e => {
    e.target.style.boxShadow = '0px 0px 10px 3px green';
    setTimeout(() => { e.target.style.boxShadow = 'none'; }, 300)
  };
  const selectFilter = typeFilter => {
    if (typeFilter) {
      const options = {
        1: () => {
          filterData('ADMINISTRADOR', 1);
          document.getElementById('rol').classList.add('active_filter');
        },
        2: () => filterData('INSTRUCTOR', 1),
        3: () => filterData('FUNCIONARIO', 1),
        4: () => {
          rol = 1;
          stateData.length ? setDataTemp(stateData) : setDataTemp(JSON.parse(JSON.stringify(dataDB)));
          rolData = [];
          document.getElementById('rol').classList.remove('active_filter');
        }
      }
      options[rol]();
    } else {
      const options = {
        1: () => {
          filterData(true, 0);
          document.getElementById('estado').classList.add('active_filter');
        },
        2: () => filterData(false, 0),
        3: () => {
          state = 1;
          rolData.length ? setDataTemp(rolData) : setDataTemp(JSON.parse(JSON.stringify(dataDB)));
          stateData = [];
          document.getElementById('estado').classList.remove('active_filter');
        }
      }
      options[state]();
    }
  }
  const filterData = (text, type) => {
    if (type) {
      rol++;
      if (stateData.length) rolData = stateData.filter(e => e.Rol === text);
      else rolData = dataDB.filter(e => e.Rol === text);
      rolData.length ? setDataTemp(rolData) : selectFilter(1);
    } else {
      state++;
      if (rolData.length) stateData = rolData.filter(e => e.Active === text);
      else stateData = dataDB.filter(e => e.Active === text);
      stateData.length ? setDataTemp(stateData) : selectFilter(0);
    }
  }

  return (
    <section className="contain_user">
      <header className="head_user">
        <section className="images">
          <div className="logo_sena">
            <img src={senaLogo} alt="SENA" />
          </div>
        </section>
        <section className="title_search">
          <div className="title">
            <h1><i className="bi bi-person-fill-gear"></i>Géstion de Usuarios</h1><hr />
          </div>
        </section>
        <section className="search_box">
          <span>Buscar Usuario</span>
          <input type="text" id="search" placeholder="Por Identificación o Nombre" onInput={inputSearch} onFocus={focusSearch} />
        </section>
        <h4><i className="bi bi-people-fill"></i> Usuarios Registrados</h4>
      </header>

      <main className="table_main">
        <table className="table table-striped table-hover">
          <thead className="table-success">
            <tr className="header">
              <th scope="col" className='posUser'>&nbsp;#</th>
              <th scope="col">IDENTIFICACIÓN</th>
              <th scope="col">NOMBRE</th>
              <th scope="col">CORREO</th>
              <th id="rol" className="filter" scope="col" onClick={() => selectFilter(1)}>ROL
                <i className="bi bi-caret-down-fill"></i>
              </th>
              <th id="estado" className="filter" scope="col" onClick={() => selectFilter(0)}>ESTADO
                <i className="bi bi-caret-down-fill"></i>
              </th>
              <th scope="col">ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {
              dataTemp.map((e, pos) => {
                return (
                  <tr key={e.Num_Documento}>
                    <th scope="row">{++pos}</th>
                    <td>{e.Num_Documento}</td>
                    <td className="left">{e.Nombre} {e.Apellido}</td>
                    <td className="left">{e.Email}</td>
                    <td>{e.Rol}</td>
                    <td>{e.Active ? 'Activo' : 'Inactivo'}</td>
                    <td className="contain_btns">
                      {
                        e.Active ? (
                          <button
                            className="btnAction" title="Desactivar Usuario"
                            onClick={() => handlerUpdate(e._id, 0)}
                          >
                            <i className="bi bi-x-square-fill iconAct"></i>
                          </button>
                        ) : (
                          <button
                            className="btnAction" title="Activar Usuario"
                            onClick={() => handlerUpdate(e._id, 1)}
                          >
                            <i className="bi bi-check-square-fill iconAct iconCheck"></i>
                          </button>
                        )
                      }
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        { loading && <><h2 style={{ margin: '10px', width: '600px', textAlign: 'center' }}>Loading...</h2></> }
        <p id="data_not_found">No se Encontraron coincidencias</p>
      </main>
    </section>
  )
}

export default ManagementUser;