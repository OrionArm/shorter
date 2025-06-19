import styles from "./styles.module.css";
import clsx from "clsx";

type ButtonColor = "primary" | "secondary" | "danger" | "success" | "default";

type Props = {
  name: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  color?: ButtonColor;
};

export const Button: React.FC<Props> = ({
  isLoading = false,
  disabled = false,
  onClick,
  name,
  type,
  color = "primary",
}) => {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[color])}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-label="Загрузка" />
      ) : (
        name
      )}
    </button>
  );
};
