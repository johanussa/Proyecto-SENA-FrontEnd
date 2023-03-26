import React, { useState, useEffect } from 'react';
import logoSANF2 from '../../assets/logoSANF2.png';
import senaLogo from '../../assets/Sena_logo.png';
import { GetUser } from '../../graphQL/login/queryLogin';
import { useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import bcrypt from 'bcryptjs-react';
import Swal from 'sweetalert2';
import './css/styleWelcome.css';

const states = { numDoc: false, pass: false, numDocRec: false };

function WelcomeLoginPage() {

  const [loadUser, results] = useLazyQuery(GetUser);
  const [formUser, setFormUser] = useState({ tipoDocumento: 'CEDULA_DE_CIUDADANIA' });

  useEffect(() => {
    const validateInfo = async () => {
      let valid = false;
      const { Num_Documento, Tipo_Documento, Password } = results.data.getOneUser;
      if (Tipo_Documento === formUser.tipoDocumento && Num_Documento === formUser.numDocumento) {
        valid = await bcrypt.compare(formUser.password, Password);    
      } 
      if (valid) Swal.fire('Autorizado!', `Bienvenido`, 'success');
      else Swal.fire('Error!', `La información Ingresada No es Valida`, 'error'); 
    }
    if (results.data) validateInfo();    
    if (results.error) {
      if (results.error.message === 'User Is Not Active') {
        Swal.fire('Atencion!', 
          `Lo sentimos, su Usuario se encuentra Inactivo, por favor comuniquese con el Administrador`, 'warning');
      } else Swal.fire('Error!', `Lo sentimos, los Datos ingresados No son validos, Verifiquelos, o Registrese`, 'error');
    }
  }, [results]);
  
  const expresiones = {
    numDoc: /^[a-zA-Z0-9]{8,16}$/,
    numDocRec: /^[a-zA-Z0-9]{8,16}$/,
    pass: /^.{8,20}$/
  }
  const handleFocusIn = e => {
    if (e.target.parentNode.id) {
      let id = e.target.parentNode.id;
      document.querySelector(`#${id} i`).style.color = 'green';
      e.target.style.boxShadow = '0px 0px 12px 10px #00ff2a60';
      setTimeout(() => { e.target.style.boxShadow = 'none'; }, 300);
    }
  }
  const handleFocusOut = e => {
    if (e.target.parentNode.id) {
      let id = e.target.parentNode.id;
      if (e.target.form.id === 'form_get_pass') 
        return document.querySelector(`#${id} i`).style.color = 'black';
      return document.querySelector(`#${id} i`).style.color = 'white';
    }
  }
  const addData = (name, value) => {
    const options = {
      tipo: () => setFormUser(prev => ({ ...prev, ['tipoDocumento']: value })),
      numDoc: () => setFormUser(prev => ({ ...prev, ['numDocumento']: value })),
      pass: () => setFormUser(prev => ({ ...prev, ['password']: value }))
    }
    if (options[name]) { options[name](); }
  }
  const handleInput = e => {
    let name = e.target.name;
    let valor = e.target.value;
    addData(name, valor);

    const options = {
      numDoc: () => validarData(name, valor),
      numDocRec: () => validarData(name, valor),
      pass: () => validarData(name, valor)
    }
    if (options[name]) { options[name](); }
  }
  const handleSubmitForm = e => {
    e.preventDefault();
    if (states.numDoc && states.pass) { 
      loadUser({ variables: { numDocumento: formUser.numDocumento } });
    }
    else if (e.target.id === 'form_get_pass') {
      e.preventDefault();
      if (states.numDocRec) { 
        alert('Enviado'); 
        document.getElementById('form_error_rec').style.display = 'none'; 
        document.querySelector('.modal').classList.remove('modal_show');
        e.target.reset();
      }
      else {
        document.getElementById('form_error_rec').style.display = 'block';
        document.querySelector('#form_error_rec p').style.boxShadow = '0px 0px 10px 5px red';
        setTimeout(() => {
          document.querySelector('#form_error_rec p').style.boxShadow = 'none';
        }, 300);
        document.getElementById('numDocRec').focus();
      }
    } else {
      e.preventDefault();
      document.getElementById('form_error').style.display = 'block';
      document.getElementById('form_error').style.boxShadow = '0px 0px 10px 5px red';
      setTimeout(() => {
        document.getElementById('form_error').style.boxShadow = 'none';
      }, 300);
      !states.numDoc ? document.getElementById('numDoc').focus() : document.getElementById('pass').focus();
    }
  }
  const viewPassEventDown = e => {
    let id = e.target.parentNode.id;
    document.querySelector(`#${id} input`).type = 'text';
    setTimeout(() => {
      let id = e.target.parentNode.id;
      document.querySelector(`#${id} input`).type = 'password';
    }, 3000);
  };
  const viewPassEventUp = e => {
    let id = e.target.parentNode.id;
    document.querySelector(`#${id} input`).type = 'password';
    document.querySelector(`#${id} input`).focus();
  };
  const validarData = (name, valor) => {
    if (expresiones[name].test(valor)) {
      document.getElementById(`group_${name}`).classList.remove('form_incorrect');
      document.getElementById(`group_${name}`).classList.add('form_correct');
      states[name] = true;
    } else {
      document.getElementById(`group_${name}`).classList.remove('form_correct');
      document.getElementById(`group_${name}`).classList.add('form_incorrect');
      states[name] = false;
    }
  }
  const logingPage = () => {
    let sectionLogin = document.getElementById('sectionLogin');
    let sectionWelcome = document.getElementById('sectionWelcome');
    let content = document.getElementById('register');

    sectionWelcome.style.opacity = '0';
    sectionWelcome.style.height = '0';
    sectionWelcome.style.padding = '0';
    sectionLogin.style.display = 'grid';
    setTimeout(() => {
      sectionWelcome.style.display = 'none';
      content.style.backgroundColor = 'rgba(0, 0, 0, .4)';
    }, 2000);
  }  
  const closeModal = () => {
    document.querySelector('.modal').classList.remove('modal_show');
    document.getElementById('form_get_pass').reset();
  }

  return (
    <div className="welcomePage">
      <section className="welcomeContent" id="sectionWelcome">
        <div className="divHead">
          <img src={logoSANF2} alt="Logo-SENA-SANF" className="logoWelcome" /> SENA - SANF
        </div>
        <div className="divMain">
          <h1>HOLA Y BIENVENIDO</h1>
          <p>
            Desde el grupo <b>SENA-SANF</b> le damos una calurosa bienvenida a nuestra aplicacion web
            en donde podra de una manera eficaz, ordenada y sensilla, organizar, ver, editar y administrar
            el manejo de horarios. <br /><br /> Esta aplicacion va dirigida a instructores, funcionarios y aprendices 
            <b>SENA</b> del Centro de Materiales y Ensayos del Complejo Sur situado en Bogotá.
          </p>
        </div>
        <button className="btnWelcome" onClick={logingPage}>INGRESAR</button>
      </section>

      <section className="loginContent" id="sectionLogin">
        <div className="register" id="register">
          <div className="logo">
            <img src={logoSANF2} alt="Logo-SENA-SANF" className="logoSanf" />
            <span>SENA - SANF</span>
          </div>
          <div className="createCount">
            <h2>¿ No Tienes una Cuenta ?</h2>
            <p>
              Registrate para poder acceder a todos nuestros servicios, y administra y
              visualiza los horarios en un solo lugar.
            </p>
            <div className="divBtn">
              <Link to={'/user-register'}><button>Registrate !! <i className="bi bi-caret-right-fill"></i></button></Link>
            </div>
            <div className="socialMedia">
              <a href="https://web.facebook.com/groups/566675547810297/?_rdc=11&_rdr" target="_blank">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.instagram.com/senacomunica/?hl=es-la" target="_blank">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://twitter.com/SENAComunica" target="_blank"><i className="bi bi-twitter"></i></a>
              <a href="https://co.linkedin.com/school/servicio-nacional-de-aprendizaje-sena-/" target="_blank">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="loginForm" id="loginForm">
          <div className="header">
            <img src={senaLogo} alt="Logo-Sena" className="logoLogin" />
            <h2>Inicio de Sesion</h2>
          </div>
          { results.called && results.loading ? (<h2>Loading ...</h2>) : (
            <form id="formulario" onInput={handleInput} onFocus={handleFocusIn} 
              onBlur={handleFocusOut} onSubmit={handleSubmitForm}>
              <section className="form_group">
                <label htmlFor="tipo" className="form_label_login">Tipo de Documento</label>
                <div className="form_input" id="divSelect">
                  <i className="bi bi-person-vcard-fill iconsLogin"></i>
                  <select name="tipo" id="tipo" defaultValue={'CC'} required>
                    <option value="CEDULA_DE_CIUDADANIA">Cédula de Ciudadania</option>
                    <option value="TARJETA_DE_IDENTIDAD">Tarjeta de Identidad</option>
                    <option value="CEDULA_DE_EXTRANJERIA">Cédula de Extranjeria</option>
                    <option value="PEP">PEP</option>
                    <option value="PERMISO_DE_PROTECCION_TEMPORAL">Permiso Protección Temporal</option>
                  </select>
                </div>
              </section>

              <section className="form_group" id="group_numDoc">
                <label htmlFor="numDoc" className="form_label_login">Número de Documento</label>
                <div className="form_input" id="divNum">
                  <i className="bi bi-person-circle iconsLogin"></i>
                  <input
                    type="text" id="numDoc" name="numDoc" autoComplete="off"
                    placeholder="Ingrese El Número de Documento" required
                  />
                </div>
                <p className="message_error">
                  El Número No puede contener espacios ni caracteres especiales y debe contener minimo 8 caracteres
                </p>
              </section>

              <section className="form_group" id="group_pass">
                <label htmlFor="pass" className="form_label_login">Contraseña</label>
                <div className="form_input" id="divPass">
                  <i className="bi bi-lock-fill iconsLogin"></i>
                  <input type="password" name="pass" id="pass" placeholder="Ingrese la Contraseña" required />
                  <i className="bi bi-eye-fill iconEye" id="viewPass" 
                    onMouseUp={viewPassEventUp} onMouseDown={viewPassEventDown}></i>
                </div>
                <p className="message_error">La Contraseña debe tener minimo 8 caracteres</p>
              </section>

              <section className="message_error" id="form_error">
                <p>
                  <i className="bi bi-exclamation-diamond-fill iconsLogin"></i>
                  <b>Error: </b> Información de Usuario Invalida
                </p>
              </section>

              <section className="forget_pass">
                <button type='button' onClick={() => document.querySelector('.modal').classList.add('modal_show')}>
                  <i className="bi bi-key-fill"></i> Olvidé mi Contraseña
                </button>
              </section>

              <section className="form_btn">
                <button type="submit" className="btn_submit">
                  Ingresar !! <i className="bi bi-caret-right-fill"></i>
                </button>
              </section>
            </form>
          ) }
        </div>
      </section>

      <section className="modal">
        <div className="contain_modal">
          <article className="head_modal">
            <div className="modal_title">
              <i className="bi bi-key-fill"></i>
              <h2>Restablecer la Contraseña</h2>
            </div>
            <button className="modal_close" onClick={closeModal}>
              <i className="bi bi-x-lg"></i>
            </button>
          </article>
          <article className="body_modal">
            <p>Seleccione y escriba, el tipo y el número de su documento de Identidad</p>
            <form action="" id="form_get_pass" onInput={handleInput} onFocus={handleFocusIn} 
              onBlur={handleFocusOut} onSubmit={handleSubmitForm}>
              <section id="group_type_doc">
                <label htmlFor="type_doc" className="form_label_login label_rec">Tipo de Documento de Identidad</label>
                <div className="form_input" id="select_tipe">
                  <i className="bi bi-person-vcard-fill iconsLogin"></i>
                  <select name="type_doc" defaultValue={''} id="type_doc" required>
                    <option value="" disabled>Seleccionar . . .</option>
                    <option value="CC">Cédula de Ciudadania</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="CE">Cédula de Extranjeria</option>
                    <option value="PEP">PEP</option>
                    <option value="PPT">Permiso Protección Temporal</option>
                  </select>
                </div>
              </section>

              <section id="group_numDocRec">
                <label htmlFor="numDocRec" className="form_label_login label_rec">Número de Documento</label>
                <div className="form_input" id="input_doc">
                  <i className="bi bi-person-circle iconsLogin"></i>
                  <input
                    type="text" name="numDocRec" id="numDocRec" autoComplete="off"
                    placeholder="Ingrese El Número de Documento" required
                  />
                </div>
                <p className="message_error">
                  El Número No puede contener espacios ni caracteres especiales y debe contener minimo 8 caracteres
                </p>
              </section>

              <section className="message_error" id="form_error_rec">
                <p>
                  <i className="bi bi-exclamation-diamond-fill iconsLogin"></i>
                  <b>Error : </b> Información Ingresada No Invalida
                </p>
              </section>

              <article className="footer_modal">
                <button type="button" className="btn_submit" onClick={closeModal}>
                  Cancelar !! &nbsp;
                </button>
                <button type="submit" name="res_pass" className="btn_submit">
                  Enviar !! &nbsp;
                </button>
              </article>
            </form>
          </article>
        </div>
      </section>
    </div>
  )
}

export default WelcomeLoginPage