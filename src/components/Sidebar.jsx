import styles from '../styles/Sidebar.module.css';

function Sidebar() {
    return (
    <div className={styles.Sidebar}>
        <h3 classname={styles.Stackly}>Stackly</h3>

        <div>Queue</div>
        <div classname={styles.Space}>
            + Add Space
        </div>
    </div>
    );
}

export default Sidebar;