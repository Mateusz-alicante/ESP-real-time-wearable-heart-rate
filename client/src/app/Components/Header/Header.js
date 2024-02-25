"use client";

import styles from "./Header.module.css";
import Link from "next/link";

import { FaUserCheck } from "react-icons/fa";
import { IconContext } from "react-icons";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("router.pathname: ", pathname);
  });

  return (
    <header className={styles.header}>
      <div>
        <Link
          className={pathname == "/" ? styles.activeLink : styles.link}
          href="/"
        >
          Home
        </Link>
        <Link
          className={pathname == "/lifestyle" ? styles.activeLink : styles.link}
          href="/lifestyle"
        >
          Lifestyle
        </Link>
      </div>
      <div className={styles.userContainer}>
        <h2 className={styles.usernName}>Joe</h2>
        <IconContext.Provider value={{ color: "green", size: "3em" }}>
          <FaUserCheck />
        </IconContext.Provider>
      </div>
    </header>
  );
}
