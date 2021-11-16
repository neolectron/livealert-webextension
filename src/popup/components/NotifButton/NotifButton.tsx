import './notifButton.css';
import bell from './bell.svg';
import belloff from './bell-off.svg';

const NotifButton = ({ id = 'notifbutton', onChange, checked }) => (
  <label className={`notif-button ${checked ? 'checked' : ''}`} htmlFor={id}>
    <input id={id} type="checkbox" onChange={onChange} checked={checked} />
    <img src={checked ? bell : belloff} alt="image of bell" />
  </label>
);

export default NotifButton;
