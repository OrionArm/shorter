import {
  AliasIcon,
  CalendarIcon,
  Input,
  LinkIcon,
  SubmitButton,
} from "@/shared/ui";
import { useCreateLink } from "../../lib/use_create_link";
import styles from "./styles.module.css";
import { appRoutes } from "@/shared/routes";

type Props = {
  onSubmit?: (data: {
    url: string;
    alias?: string;
    expiresAt?: string;
  }) => void;
};

export const LinkCreationView: React.FC<Props> = () => {
  const { createLink, error } = useCreateLink();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      const { alias } = await createLink({
        url: formData.get("url") as string,
        alias: formData.get("alias") as string,
        expiresAt: formData.get("expiresAt") as string,
      });
      appRoutes.manageLink.open({ slug: alias });
    } catch {
      // Ошибка уже обработана в хуке useCreateLink
    }
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
        title="Only letters, numbers and hyphens are allowed"
        maxLength={20}
        icon={<AliasIcon />}
      />
      {error && <div className={styles.error}>{error}</div>}
      <SubmitButton name="Создать" />
    </form>
  );
};
