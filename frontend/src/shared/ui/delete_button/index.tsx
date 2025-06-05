import styles from "./styles.module.css";

type Props = {
  onClick: () => void;
};

export const DeleteButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      Удалить
    </button>
  );
};
