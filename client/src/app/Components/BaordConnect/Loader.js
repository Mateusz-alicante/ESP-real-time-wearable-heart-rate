import styles from "./Loader.module.css";

export default () => {
  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};
