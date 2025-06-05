import { useUnit } from "effector-react";
import { DeleteButton, SubmitButton } from "@/shared/ui";
import {
  $analyticsData,
  getLinkAnalyticsEv,
  $linkData,
  deleteLinkDataEv,
  createNewLinkEv,
} from "../../model";
import styles from "./styles.module.css";
import { apiUrl } from "@/shared/lib";

export const ManageLinkView = () => {
  const linkData = useUnit($linkData);
  const analyticsData = useUnit($analyticsData);
  if (!linkData) return <>URL not found</>;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Short URL Information</h3>
      </div>

      <div className={styles.cardBody}>
        <dl className={styles.detailsList}>
          <div className={styles.detailItem}>
            <dt className={styles.detailLabel}>Alias URL</dt>
            <dd className={styles.detailValue}>
              <a
                href={`${apiUrl}/${linkData?.alias}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {linkData?.alias}
              </a>
            </dd>
          </div>

          <div className={styles.detailItem}>
            <dt className={styles.detailLabel}>Original URL</dt>
            <dd className={styles.detailValue}>
              <a
                href={linkData.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {linkData.url}
              </a>
            </dd>
          </div>

          <div className={styles.detailItem}>
            <dt className={styles.detailLabel}>Created At</dt>
            <dd className={styles.detailValue}>
              {new Date(linkData.createdAt).toLocaleString()}
            </dd>
          </div>

          {linkData.expiresAt && (
            <div className={styles.detailItem}>
              <dt className={styles.detailLabel}>Expires At</dt>
              <dd className={styles.detailValue}>
                {new Date(linkData.expiresAt).toLocaleString()}
              </dd>
            </div>
          )}

          {analyticsData && (
            <>
              <div className={styles.detailItem}>
                <dt className={styles.detailLabel}>Total Clicks</dt>
                <dd className={styles.detailValue}>
                  <span className={styles.badge}>
                    {analyticsData.totalClicks}
                  </span>
                </dd>
              </div>
              <div className={styles.detailItem}>
                <dt className={styles.detailLabel}>Recent Visitors (Last 5)</dt>
                <dd className={styles.detailValue}>
                  <ul className={styles.visitorsList}>
                    {analyticsData?.recentIps.length > 0 ? (
                      analyticsData.recentIps.map((ip) => (
                        <li key={ip} className={styles.visitorIp}>
                          {ip}
                        </li>
                      ))
                    ) : (
                      <li className={styles.noVisitors}>No visitors yet</li>
                    )}
                  </ul>
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>

      <div className={styles.cardFooter}>
        <DeleteButton onClick={deleteLinkDataEv} />

        <SubmitButton
          onClick={getLinkAnalyticsEv}
          name={!analyticsData ? "Аналитика" : "Обновить аналитику"}
        />

        <SubmitButton onClick={createNewLinkEv} name="Создать новую ссылку" />
      </div>
    </div>
  );
};
