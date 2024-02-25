import Image from "next/image";

import BoardIcon from "./boardIcon.png";
import styles from "./BoardConnect.module.css";

import { FaWifi } from "react-icons/fa";
import { IconContext } from "react-icons";

export default ({ setConnected }) => {
  return (
    <div className={styles.container}>
      <h1>AspiPatch</h1>
      <Image src={BoardIcon} width={300} alt="Picture of the author" />
      <div className={styles.connectionOptionsContainer}>
        <button onClick={setConnected} className={styles.connectButton}>
          Connect
        </button>
        <IconContext.Provider value={{ color: "green", size: "3em" }}>
          <FaWifi />
        </IconContext.Provider>
      </div>
    </div>
  );
};
