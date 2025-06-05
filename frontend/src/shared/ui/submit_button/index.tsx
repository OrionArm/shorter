import styles from "./styles.module.css";

interface SubmitButtonProps {
  name: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading = false,
  disabled = false,
  onClick,
  name,
}) => {
  return (
    <button
      type="submit"
      className={styles.button}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-label="Loading" />
      ) : (
        name
      )}
    </button>
  );
};
