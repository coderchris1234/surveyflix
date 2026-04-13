import { useState } from 'react'
import styles from './Profile.module.css'

export default function Profile() {
  const [form, setForm] = useState({
    firstName: 'Sophie', lastName: 'Müller',
    email: 'sophie@example.com', phone: '+49 170 0000000',
    city: 'Berlin', country: 'Germany',
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className={styles.card}>
      <div className={styles.avatarRow}>
        <div className={styles.avatar}>S</div>
        <div>
          <p className={styles.avatarName}>{form.firstName} {form.lastName}</p>
          <p className={styles.avatarRole}>Panel Member · Joined Jan 2025</p>
        </div>
      </div>

      <p className={styles.sectionLabel}>Personal Information</p>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>First Name</label>
          <input value={form.firstName} onChange={set('firstName')} />
        </div>
        <div className={styles.field}>
          <label>Last Name</label>
          <input value={form.lastName} onChange={set('lastName')} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Email</label>
          <input type="email" value={form.email} onChange={set('email')} />
        </div>
        <div className={styles.field}>
          <label>Phone</label>
          <input value={form.phone} onChange={set('phone')} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>City</label>
          <input value={form.city} onChange={set('city')} />
        </div>
        <div className={styles.field}>
          <label>Country</label>
          <input value={form.country} onChange={set('country')} />
        </div>
      </div>

      <button className={styles.saveBtn}>Save Changes</button>
    </div>
  )
}
