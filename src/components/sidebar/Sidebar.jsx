import { confirmChanges } from '../../pages/managementShedule/CompUpdateFicha';
import React, { useEffect, useState } from 'react';
import senaLogo from '../../assets/Sena_logo.png';
import logoSANF from '../../assets/logoSANF2.png';
import { useApolloClient } from '@apollo/client';
import { Link } from 'react-router-dom';
import './css/styleSidebar.css';

function Sidebar({ setToken, user }) {
  console.log(user)
  const sidebar = document.querySelector('.sidebar');
  const client = useApolloClient();
  const [hour, setHour] = useState('');
  const [date, setDate] = useState('');
  const [nameUser, setNameUser] = useState('');
  const [rolUser, setRolUser] = useState('');

  if (user?.me) {
    setNameUser(`${user.me.Nombre} ${user.me.Apellido}`);
    setRolUser(user.me.Rol);
  }

  useEffect(() => {
    setHour(Intl.DateTimeFormat('CO', { timeStyle: 'short', hour12: false }).format());
    setDate(Intl.DateTimeFormat('CO', { dateStyle: 'full', hour12: false }).format());
  }, []);

  setInterval(() => {
    setHour(Intl.DateTimeFormat('CO', { timeStyle: 'short', hour12: false }).format());
  }, 20000);

  const logOut = async () => {
    if (await confirmChanges('Cerrar la Sesion', 'Salir')) {
      setToken(null);
      localStorage.clear();
      client.resetStore();
    }
  }
  const activeSide = value => {
    if (value === 1 && sidebar.classList.length === 1) return 0;
    sidebar.classList.toggle('close');
  }
  const select = e => {
    let elem = document.querySelectorAll('.menu_links .nav_link');
    elem.forEach(elm => elm.classList.remove('selected'));

    let options = {
      1: () => elem[0].classList.toggle('selected'),
      2: () => elem[1].classList.toggle('selected'),
      3: () => elem[2].classList.toggle('selected')
    }
    if (options[e]) options[e]();
  }

  return (
    <nav className="sidebar close">
      <div className="transparent">
        <header>
          <div className="img_text">
            <div className="btns_active">
              <i className="bi bi-caret-left-fill list toggle" onClick={activeSide}></i>
            </div>
            <span className="image">
              <img src={senaLogo} alt="SENA" />
            </span>
          </div>
        </header>

        <section className="menu_bar">
          <div className="menu">
            <ul className="menu_links">
              <li className="nav_link" id="main" onClick={() => select(1)}>
                <Link to={'/'}>
                  <i className="bi bi-house-fill icon"></i>
                  <span className="text nav_text">Inicio</span>
                  <span className="hover_span">Inicio</span>
                </Link>
              </li>
              <li className="nav_link" id="hours" onClick={() => select(2)}>
                <Link to={'/shedule'}>
                  <i className="bi bi-clock-fill icon"></i>
                  <span className="text nav_text">Géstion Horarios</span>
                  <span className="hover_span">Géstion Horarios</span>
                </Link>
              </li>
              <li className="nav_link" id="users" onClick={() => select(3)}>
                <Link to={'/users'}>
                  <i className="bi bi-person-fill-gear icon"></i>
                  <span className="text nav_text">Géstion Usuarios</span>
                  <span className="hover_span">Géstion Usuarios</span>
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="middle">
          <div className="nav_link time">
            <span className="icon hour">{hour}</span>
            <span className="date">{date}</span>
            <span className="hover_span">{date}</span>
          </div>
        </section>

        <section className="foot_content">
          <div className="perfil nav_link" onClick={() => activeSide(1)}>
            <span className="img_perfil">
              <i className="bi bi-person-circle icon"></i>
            </span>
            <div className="footer_text">
              <span className="name_user">{ nameUser }</span>
              <span className="rol">{ rolUser }</span>
            </div>
            <span className="hover_span">{ nameUser ? nameUser : 'JS' }</span>
            <span className="rol">{ rolUser }</span>
          </div>
          <div className="leave nav_link" onClick={logOut}>
            <Link to={''}>
              <i className="bi bi-box-arrow-left icon"></i>
              <span className="text nav_text">Salir</span>
              <span className="hover_span">Salir</span>
            </Link>
          </div>
        </section>

        <section>
          <div className="header_text">
            <img src={logoSANF} alt="SENA-SANF" title="SENA_SANF" className="logo" />
            <span className="text name">SENA - SANF</span>
          </div>
        </section>
      </div>
    </nav>
  )
}

export default Sidebar
