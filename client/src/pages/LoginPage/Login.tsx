import { useLogin } from '../../hooks/useLogin';
import styles from './Login.module.css';

export default function Login() {
  const { name, limitHit, handleChange, handleSubmit } = useLogin();

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>
          Welcome to
          <br />
          <span className={styles.gameName}>Rock 🪨 Paper 📄 Scissors ✂️ Lizard 🦎 Spock 🖖</span>
        </h1>
        <p className={styles.subtitle}>
          Pick a legendary name (<strong>max 20&nbsp;chars</strong>) and press <b>Play</b> to begin
          your epic battle!
        </p>

        <div className={styles.fieldWrapper}>
          <label htmlFor="playerName" className={styles.label}>
            Your player name
          </label>
          <input
            className={styles.input}
            placeholder="Player 1"
            value={name}
            onChange={handleChange}
            autoFocus
          />
          {limitHit && <p className={styles.limitMsg}>(Whoa there-names max out at 20 chars!)</p>}
        </div>

        <button className={styles.primaryBtn}>Play</button>
      </form>
    </div>
  );
}
