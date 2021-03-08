import React from 'react';
import Menus from './Menus';
import logo from '@/assert/logo.png';
import styles from './leftNavigation.less';

export default () => {
  return (
    <div className={styles.leftNav}>
      <header className={styles.leftNavHeader}>
        <img src={logo} alt="logo" />
        <h1>Event</h1>
      </header>
      <Menus />
    </div>
  );
};
