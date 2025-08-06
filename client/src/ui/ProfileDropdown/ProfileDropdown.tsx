import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import styles from './ProfileDropdown.module.css';
import type { ProfileDropdownProps } from './ProfileDropdown.types';

export default function ProfileDropdown({ playerName, onLogout }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('pointerdown', outside);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', outside);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  const toggle = () => setOpen((val) => !val);
  const logout = () => {
    onLogout();
    setOpen(false);
  };

  return (
    <div ref={ref} className={styles.profile}>
      <motion.button
        className={styles.playerChip}
        onClick={toggle}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.92, transition: { type: 'spring', stiffness: 500, damping: 30 } }}
      >
        {playerName}
      </motion.button>

      {open && (
        <motion.ul
          key="menu"
          className={styles.dropdown}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          role="menu"
        >
          <li role="menuitem">
            <button onPointerDown={logout} className={styles.logoutBtn}>
              Change Player
            </button>
          </li>
        </motion.ul>
      )}
    </div>
  );
}
