import React, { useEffect, useState } from 'react';
import './css/styleUsers.css';
import senaLogo from '../../assets/Sena_logo.png';

let state = 1, rol = 1;
let rolData = [], stateData = [];

function ManagementUser() {

    const [dataDB, setDataDB] = useState([]);
    const [dataTemp, setDataTemp] = useState([]);

    useEffect(() => {
        const data = [
            {
                Id: '6897605',
                Nombre: 'Johan Sebastian',
                Apellido: 'Ussa Rubio',
                Email: 'johanu@misena.com',
                Rol: 'Administrador',
                Estado: 'Inactivo'
            },
            {
                Id: '8901234',
                Nombre: 'Jhon Alexander',
                Apellido: 'Umbasia Ussa',
                Email: 'jhon12@misena.com',
                Rol: 'Instructor',
                Estado: 'Inactivo'
            },
            {
                Id: '5678912',
                Nombre: 'Maria Mercedes',
                Apellido: 'Rubio Rincon',
                Email: 'maria_rubio@misena.com',
                Rol: 'Funcionario',
                Estado: 'Activo'
            }, {
                Id: '1234560',
                Nombre: 'Matias Fernandez',
                Apellido: 'Zapata',
                Email: 'johanu@misena.com',
                Rol: 'Administrador',
                Estado: 'Activo'
            },
            {
                Id: '8901233',
                Nombre: 'Samuel Emilio',
                Apellido: 'Torres Diaz',
                Email: 'jhon12@misena.com',
                Rol: 'Instructor',
                Estado: 'Inactivo'
            },
            {
                Id: '5678911',
                Nombre: 'Angelica',
                Apellido: 'Timberlake',
                Email: 'maria_rubio@misena.com',
                Rol: 'Funcionario',
                Estado: 'Inactivo'
            }, {
                Id: '1236567',
                Nombre: 'Santiago',
                Apellido: 'Pulido Gonzalez',
                Email: 'johanu@misena.com',
                Rol: 'Instructor',
                Estado: 'Inactivo'
            },
            {
                Id: '8901394',
                Nombre: 'Ricardo Manuel',
                Apellido: 'Cifuentes',
                Email: 'jhon12@misena.com',
                Rol: 'Administrador',
                Estado: 'Activo'
            },
            {
                Id: '5671412',
                Nombre: 'Nicol Dayana',
                Apellido: 'Rojas Perez',
                Email: 'maria_rubio@misena.com',
                Rol: 'Funcionario',
                Estado: 'Inactivo'
            }
        ];
        setDataDB(data);
        setDataTemp(JSON.parse(JSON.stringify(data)));
    }, []);

    const inputSearch = e => {
        let dataSearch = 0;
        const regExp = new RegExp(e.target.value, 'i');

        if (rolData.length)
            dataSearch = rolData.filter(e => regExp.test(e.Id) || regExp.test(`${e.Nombre} ${e.Apellido}`));
        else if (stateData.length) 
            dataSearch = stateData.filter(e => regExp.test(e.Id) || regExp.test(`${e.Nombre} ${e.Apellido}`));
        else dataSearch = dataDB.filter(e => regExp.test(e.Id) || regExp.test(`${e.Nombre} ${e.Apellido}`));

        if (!dataSearch.length) document.getElementById('data_not_found').classList.add('not_found');
        else document.getElementById('data_not_found').classList.remove('not_found');
        setDataTemp(dataSearch);
    };
    const focusSearch = e => {
        e.target.style.boxShadow = '0px 0px 10px 3px green';
        setTimeout(() => { e.target.style.boxShadow = 'none'; }, 300)
    };
    const changeState = (id, action) => {
        let pos = dataDB.findIndex(e => e.Id === id);
        dataDB[pos].Estado = action ? 'Activo' : 'Inactivo';

        if (rolData.length) setDataTemp(JSON.parse(JSON.stringify(rolData))); 
        else if (stateData.length) setDataTemp(JSON.parse(JSON.stringify(stateData)));
        else { setDataTemp(JSON.parse(JSON.stringify(dataDB))); }
    }
    const selectFilter = typeFilter => {
        if (typeFilter) {
            const options = {
                1: () => {
                    filterData('Administrador', 1);
                    document.getElementById('rol').classList.add('active_filter');
                },
                2: () => filterData('Instructor', 1),
                3: () => filterData('Funcionario', 1),
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
                    filterData('Activo', 0);
                    document.getElementById('estado').classList.add('active_filter');
                },
                2: () => filterData('Inactivo', 0),
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
            if (rolData.length) stateData = rolData.filter(e => e.Estado === text);
            else stateData = dataDB.filter(e => e.Estado === text);
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
                            <th scope="col" className='posUser'>&nbsp;#{state}</th>
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
                                    <tr key={e.Id}>
                                        <th scope="row">{++pos}</th>
                                        <td>{e.Id}</td>
                                        <td className="left">{e.Nombre} {e.Apellido}</td>
                                        <td className="left">{e.Email}</td>
                                        <td>{e.Rol}</td>
                                        <td>{e.Estado}</td>
                                        <td className="contain_btns">
                                            <button
                                                className="btnAction" title="Activar Usuario"
                                                onClick={() => changeState(e.Id, 1)}
                                            >
                                                <i className="bi bi-check-square-fill iconAct iconCheck"></i>
                                            </button>
                                            <button
                                                className="btnAction" title="Desactivar Usuario"
                                                onClick={() => changeState(e.Id, 0)}
                                            >
                                                <i className="bi bi-x-square-fill iconAct"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <p id="data_not_found">No se Encontraron coincidencias</p>
            </main>
        </section>
    )
}

export default ManagementUser