import { AliasIcon, CalendarIcon, Input, LinkIcon, Button } from "@/shared/ui";
import { useUnit } from "effector-react";
import { $linkDataError, createLinkFx } from "../../model";
import styles from "./styles.module.css";

export const LinkCreationView: React.FC = () => {
  const [createLink, error] = useUnit([createLinkFx, $linkDataError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    createLink({
      url: formData.get("url") as string,
      alias: formData.get("alias") as string,
      expiresAt: formData.get("expiresAt") as string,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        name="url"
        type="url"
        label="Длинный URL"
        placeholder="https://example.com"
        required
        icon={<LinkIcon />}
      />

      <Input
        name="expiresAt"
        type="date"
        label="Дата окончания действия ссылки"
        min={new Date().toISOString().split("T")[0]}
        icon={<CalendarIcon />}
      />

      <Input
        name="alias"
        type="text"
        label="Пользовательский алиас"
        placeholder="my-custom-alias"
        pattern="[a-zA-Z0-9-]+"
        title="Разрешены только буквы, цифры и дефисы"
        maxLength={20}
        icon={<AliasIcon />}
      />
      {error && <div className={styles.error}>{error}</div>}
      <Button name="Создать" type="submit" />
    </form>
  );
};
