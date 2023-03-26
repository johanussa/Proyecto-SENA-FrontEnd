import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CreateUser } from '../../graphQL/users/mutationUser';
import { confirmChanges } from '../managementShedule/CompUpdateFicha';
import senaLogo from '../../assets/Sena_logo.png';
import logoSANF from '../../assets/logoSANF2.png';
import './css/styleUserRegister.css';
import Swal from 'sweetalert2';

const states = {
  name: false,
  lastName: false,
  numDoc: false,
  email: false,
  password: false,
  password2: false
}

function UserRegisterPage() {

  const [formRegister, setFormRegister] = useState({});
  const [addUser] = useMutation(CreateUser);
  
  const expresiones = {
    name: /^[a-zA-ZÁ-ÿ\s]{3,35}$/, 
    lastName: /^[a-zA-ZÁ-ÿ\s]{3,35}$/, 
    numDoc: /^[a-zA-Z0-9]{8,20}$/,
    email: /^\w+@(misena|soy\.sena)\.edu\.co$/,
    password: /^.{8,20}$/     
  }
  const addData = (name, valor) => {
    const options = {
      name: () => setFormRegister( prev => ({ ...prev, ['nombre']: valor }) ),
      lastName: () => setFormRegister( prev => ({ ...prev, ['apellido']: valor }) ),
      numDoc: () => setFormRegister( prev => ({ ...prev, ['numDocumento']: valor }) ),
      typeDoc: () => setFormRegister( prev => ({ ...prev, ['tipoDocumento']: valor }) ),
      password2: () => setFormRegister( prev => ({ ...prev, ['password']: valor }) ),
      email: () => setFormRegister( prev => ({ ...prev, ['email']: valor }) ),
      rol: () => setFormRegister( prev => ({ ...prev, ['rol']: valor }) )
    }
    if (options[name]) { options[name](); }
  }
  const inputForm = e => {
    let name = e.target.name;
    let valor = e.target.value;
    addData(name, valor);

    const options = {
      name: () => validarData('name', valor),
      lastName: () => validarData('lastName', valor),
      numDoc: () => validarData('numDoc', valor),
      email: () => validarData('email', valor),
      password: () => {
        validarData('password', valor);
        confirmPass();
      },
      password2: () => confirmPass()
    }
    if (options[name]) { options[name](); }
  };
  const submitForm = async e => {
    e.preventDefault();

    if (Object.values(states).some(e => e === false)) {
      let campo = Object.entries(states).find(e => e[1] === false)[0];
      document.getElementById(campo).focus();
      document.querySelector('#message_error').style.display = 'block';
      document.querySelector('#message_error').style.boxShadow = '0px 0px 10px 5px red';

      setTimeout(() => {
        document.querySelector('#message_error').style.boxShadow = 'none';
      }, 500);
    } else {
      if (await confirmChanges('Almacenar esta Informacón', 'Enviar')) {
        addUser({ variables: { ...formRegister } });
        Swal.fire('Almacenado!', 
          `El Usuario ${formRegister.nombre} ${formRegister.apellido} Ha sido Creado`, 'success');
        document.querySelector('#message_error').style.display = 'none';
        document.querySelector('#form_message_ok').style.display = 'block';
        document.querySelectorAll('.form_correct').forEach(e => {
          e.classList.remove('form_correct');
        });
        e.target.reset();
        setTimeout(() => {
          document.querySelector('#form_message_ok').style.display = 'none';
        }, 4000);
      }
    }
  };
  const validarData = (name, valor) => {
    if (expresiones[name].test(valor)) {
      applyChanges(name, true);
      states[name] = true;
    } else {
      applyChanges(name, false);
      states[name] = false;
    }
  }
  const applyChanges = (name, bool) => {
    if (bool) {
      document.getElementById(`group_${name}`).classList.remove('form_incorrect');
      document.getElementById(`group_${name}`).classList.add('form_correct');
      document.querySelector(`#group_${name} i`).classList.remove('bi-x-circle-fill');
      document.querySelector(`#group_${name} i`).classList.add('bi-check-circle-fill');
      document.querySelector(`#group_${name} p`).style.display = 'none';
    } else {
      document.getElementById(`group_${name}`).classList.remove('form_correct');
      document.getElementById(`group_${name}`).classList.add('form_incorrect');
      document.querySelector(`#group_${name} i`).classList.remove('bi-check-circle-fill');
      document.querySelector(`#group_${name} i`).classList.add('bi-x-circle-fill');
      document.querySelector(`#group_${name} p`).style.display = 'block';
    }
  }
  const confirmPass = () => {
    let pass = document.getElementById('password').value;
    let pass2 = document.getElementById('password2').value;

    if (states.password && pass2) {
      if (pass === pass2) {
        applyChanges('password2', true);
        states.password2 = true;
      } else {
        applyChanges('password2', false);
        states.password2 = false;
      }
    }
  }
  const viewPass = e => {
    let id = e.target.parentNode.id;
    document.querySelector(`#${id} input`).type = 'text';
    setTimeout(() => {
      document.querySelector(`#${id} input`).type = 'password';
    }, 3000);
  }
  const hiddenPass = e => {
    let id = e.target.parentNode.id;
    document.querySelector(`#${id} input`).type = 'password';
    document.querySelector(`#${id} input`).focus();
  }

  return (
    <div className='body-register-user'>
      <main className="contenedor_main">
        <section className="fondo">
          <img src={senaLogo} alt="SENA" className="logoTitle" />
          <div className="logo_sanf">
            <img src={logoSANF} alt="sena-sanf" /> SENA- SANF
          </div>
        </section>
        <section className="formulario">
          <header className="head_title">
            <img src={senaLogo} alt="SENA" id="logoMedia" />
            <h1>Formulario de Registro - Usuarios Nuevos</h1>
          </header>
          <form id="form-register-user" onChange={inputForm} onSubmit={submitForm}>
            <section id="group_name">
              <label htmlFor="name" className="form_label">Nombre</label>
              <div className="group_input">
                <input
                  type="text" name="name" id="name" className="form_input"
                  placeholder="Ingrese su Nombre" required
                />
                <i className="bi bi-x-circle-fill icon_validate"></i>
              </div>
              <p className="input_error">
                El Nombre debe tener entre 3 y 16 caracteres, No puede contener espacios,
                números, o caracteres especiales.
              </p>
            </section>

            <section id="group_lastName">
              <label htmlFor="lastName" className="form_label">Apellido</label>
              <div className="group_input">
                <input
                  type="text" name="lastName" id="lastName" className="form_input"
                  placeholder="Ingrese su Apellido" required
                />
                <i className="bi bi-x-circle-fill icon_validate"></i>
              </div>
              <p className="input_error">
                El Apellido debe tener entre 3 y 16 caracteres, No puede contener espacios,
                números, o caracteres especiales.
              </p>
            </section>

            <section id="group_typeDoc">
              <label htmlFor="typeDoc" className="form_label">Tipo Documento de Identidad</label>
              <div className="group_input">
                <select name="typeDoc" defaultValue={''} id="typeDoc" className="form_input" required>
                  <option value="" disabled>Seleccionar . . .</option>
                  <option value="CEDULA_DE_CIUDADANIA">Cédula de Ciudadania</option>
                  <option value="TARJETA_DE_IDENTIDAD">Tarjeta de Identidad</option>
                  <option value="CEDULA_DE_EXTRANJERIA">Cédula de Extranjeria</option>
                  <option value="PEP">PEP</option>
                  <option value="PERMISO_DE_PROTECCION_TEMPORAL">Permiso Protección Temporal</option>
                </select>
              </div>
            </section>

            <section id="group_numDoc">
              <label htmlFor="numDoc" className="form_label">Número de Documento</label>
              <div className="group_input">
                <input
                  type="text" name="numDoc" id="numDoc" className="form_input"
                  placeholder="12345678ABC" autoComplete="off" required
                />
                <i className="bi bi-x-circle-fill icon_validate"></i>
              </div>
              <p className="input_error">
                El Número No puede contener espacios ni caracteres especiales y debe
                contener minimo 8 caracteres.
              </p>
            </section>

            <section id="group_email">
              <label htmlFor="email" className="form_label">Correo Electrónico</label>
              <div className="group_input">
                <input
                  type="email" name="email" id="email" className="form_input"
                  placeholder="correo@misena.edu.co" required
                />
                <i className="bi bi-x-circle-fill icon_validate"></i>
              </div>
              <p className="input_error">
                El Correo debe ser de dominio sena (misena o soy.sena)
              </p>
            </section>

            <section id="group_password">
              <label htmlFor="password" className="form_label">Contraseña</label>
              <div className="group_input" id="input_pass">
                <input
                  type="password" name="password" id="password" className="form_input"
                  placeholder="Ingrese su Contraseña" required
                />
                <i className="bi bi-x-circle-fill icon_validate"></i>
                <i className="bi bi-eye-fill eyePass" onMouseDown={viewPass} onMouseUp={hiddenPass}></i>
              </div>
              <p className="input_error">
                La contraseña debe tener entre 8 y 20 caracteres
              </p>
            </section>

            <section id="group_password2">
              <label htmlFor="password2" className="form_label">Confirmar Contraseña</label>
              <div className="group_input" id="input_pass2">
                <input
                  type="password" name="password2" id="password2" className="form_input"
                  placeholder="Confirme su Contraseña" required
                />
                <i className="bi bi-x-circle-fill icon_validate"></i>
                <i className="bi bi-eye-fill eyePass" onMouseDown={viewPass} onMouseUp={hiddenPass}></i>
              </div>
              <p className="input_error">
                La contraseña No coincide, verifiquela
              </p>
            </section>

            <section id="group_rol">
              <label htmlFor="rol" className="form_label">Rol de Usuario</label>
              <div className="group_input">
                <select name="rol" id="rol" defaultValue={''} className="form_input" required>
                  <option value="" disabled>Seleccionar . . .</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="FUNCIONARIO">Funcionario</option>
                </select>
              </div>
            </section>

            <section id="message_error">
              <div>
                <i className="bi bi-exclamation-diamond-fill"></i>
                <b> Error : </b> Debe completar todos los campos requeridos
              </div>
            </section>

            <section className="group_btns">
              <Link to={'/'}><button type="button" className="btn_send">Regresar</button></Link>
              <button type="reset" className="btn_send">Limpiar Campos</button>
              <button type="submit" className="btn_send">Enviar</button>
              <p id="form_message_ok">Formulario Enviado Exitosamente</p>
            </section>
          </form>
        </section>
      </main>
    </div>
  )
}

export default UserRegisterPage
