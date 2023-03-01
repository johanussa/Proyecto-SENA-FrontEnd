import React from 'react';
import './css/styleFooter.css';
import logoSenaWhite from '../../assets/Logo_Sena_White.png';
import logoSANF from '../../assets/logoSANF2.png';

function Footer() {
  return (
    <main className="contenedor-foot">
        <section className="text_logo">
            <img className="logo" src={logoSenaWhite} alt="SENA" />            
            <div className="span_div"></div>
            <div className="text">
                <h1>SGAH</h1>
                <h3>Sistema de Gestion y</h3>
                <h5>Administracion de Horarios</h5>
            </div>
        </section>
        <section className="social_media">
            <article>
                <div className="icons">
                    <a href="https://www.instagram.com/senacomunica/?hl=es-la"><i className="bi bi-instagram"></i></a>
                    <a href="https://web.facebook.com/groups/566675547810297/?_rdc=11&_rdr"><i className="bi bi-facebook"></i></a>
                    <a href="https://twitter.com/SENAComunica"><i className="bi bi-twitter"></i></a>
                    <a href="https://www.youtube.com/user/SENATV?app=desktop"><i className="bi bi-youtube"></i></a>
                    <a href="https://co.linkedin.com/school/servicio-nacional-de-aprendizaje-sena-/"><i className="bi bi-linkedin"></i></a>
                </div>
                <div className="slogan">
                    <h4>@SENAComunica</h4>
                    <a href="https://www.sena.edu.co"><h5>www.sena.edu.co</h5></a>
                </div>
            </article>
            <div className="logo_sanf">
                <img src={logoSANF} alt="SENA-SANF" />
                <span>SENA - SANF</span>
            </div>
        </section>
    </main>
  )
}

export default Footer