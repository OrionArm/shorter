import { LinkCreationView } from "@/features/shorten";
import styles from "./styles.module.css";

export const CreateLinkPage = () => {
  return (
    <div className={styles.page}>
      <h1>Шортер</h1>
      <p>
        Помогите клиентам быстро найти вашу страницу в интернете. Благодаря
        короткой ссылке клиентам не придётся видеть длинные url-адреса,
        занимающие много места.
      </p>
      <div className={styles.formContainer}>
        <LinkCreationView />
      </div>
    </div>
  );
};
