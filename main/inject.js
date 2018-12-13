const { ipcRenderer } = require('electron');

const DefaultNotification = window.Notification;
function Notification(...args) {
  ipcRenderer.send('notification', {
    from: window.location.href,
    args,
  });
  return new DefaultNotification(...args);
};

Object.keys(DefaultNotification).forEach((prop) => {
  Notification[prop] = DefaultNotification[prop];
});

window.Notification = Notification;
