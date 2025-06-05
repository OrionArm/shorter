import styles from "./styles.module.css";

export const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};
