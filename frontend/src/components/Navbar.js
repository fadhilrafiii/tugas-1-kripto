import React, { useState } from "react";

const MenuList = [
  {
    route: '/cryptography',
    text: 'Cryptography'
  },
  {
    route: '/rc4',
    text: 'RC4'
  },
  {
    route: '/steganography',
    text: 'Steganography'
  }
]

const Navbar = (props) => {
  const [openNav, setOpenNav] = useState(false);
  console.log(window.location.pathname)
  return (
    <header className="header">
      <div className="title">Cipher Algorithm</div>
      <div className={openNav ? "menu-list" : "menu-list hidden"}>
        {MenuList.map(({ route, text }) => (
          <a href={route} className={route === window.location.pathname ? 'active' : ''}>{text}</a>
        ))}
      </div>
      <div className="hamburger-btn" onClick={() => setOpenNav(prev => !prev)}>
        <div className="white-strip" />
        <div className="white-strip" />
        <div className="white-strip" />
      </div>
    </header>
  );
};

export default Navbar;
