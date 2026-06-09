export const environment = {
  production: true,
  // 1. Aquí pones la URL pública de tu backend en Azure
  apiUrl: 'https://auxiliomecanico-backend.azurewebsites.net/api', 
  firebase: {
    apiKey: 'AIzaSyCGIfiGlWSsJEcniQbs5CdZ42ONAaUJ9Ok',
    authDomain: 'project-5ed4e5c6-d00d-4ed4-86c.firebaseapp.com',
    projectId: 'project-5ed4e5c6-d00d-4ed4-86c',
    storageBucket: 'project-5ed4e5c6-d00d-4ed4-86c.firebasestorage.app',
    messagingSenderId: '776780812382',
    // 2. Copiamos el appId de tu entorno de desarrollo
    appId: '1:776780812382:web:2ffb46facbc66b1c31e4cf', 
    // 3. Puedes dejarlo vacío por ahora si no estás usando notificaciones Push avanzadas
    vapidKey: '', 
  },
};
