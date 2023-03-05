import React from 'react';
import nextId from 'react-id-generator';
import { colors } from './data';

function CompResumeUpdate({ ficha, name, select, color }) {

  const changeShedule = () => {
    document.querySelector('.btns_table').firstElementChild.style.display = 'none';
    document.querySelector('.btns_table').style.display = 'flex';
    // saveUpdate = true;
    // table.addEventListener('click', eventClick);
  }
  return (
    <>
      <section className='info_resum_update' key={nextId()}>
        <label>{name} {ficha} : </label>
        <span
          className={`color_${colors[color]} btn_color`}
          onClick={changeShedule}>
        </span>
      </section>
    </>
  )
}

export default CompResumeUpdate