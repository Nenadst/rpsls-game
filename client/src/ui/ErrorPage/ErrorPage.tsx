import styles from './ErrorPage.module.css';

interface ErrorPageProps {
  onRetry: () => void;
}

export function ErrorPage({ onRetry }: ErrorPageProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Something went wrong 😢</h1>
      <p className={styles.message}>
        We couldn't fetch the data. Please check your connection and try again.
      </p>
      <button className={styles.retryButton} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
