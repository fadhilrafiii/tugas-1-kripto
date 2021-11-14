import React, { useState } from "react";

const MenuList = [
  {
    route: "/classic",
    text: "Classic",
  },
  {
    route: "/rc4",
    text: "RC4",
  },
  {
    route: "/steganography",
    text: "Steganography",
  },
  {
    route: "/public-key",
    text: "Public Key",
  },
  {
    route: "/digital-sign",
    text: "Digital Sign",
  },
];

export const Navbar = () => {
  const [openNav, setOpenNav] = useState(false);
  return (
    <header className="header">
      <div className="title">Cipher Algorithm</div>
      <div className={openNav ? "menu-list" : "menu-list hidden"}>
        {MenuList.map(({ route, text }) => (
          <a
            key={route}
            href={route}
            className={
              route === window.location.pathname || (text === 'Classic' && window.location.pathname === '/') 
                ? "active" 
                : ""
            }
          >
            {text}
          </a>
        ))}
      </div>
      <div
        className="hamburger-btn"
        onClick={() => setOpenNav((prev) => !prev)}
      >
        <div className="white-strip" />
        <div className="white-strip" />
        <div className="white-strip" />
      </div>
    </header>
  );
};
