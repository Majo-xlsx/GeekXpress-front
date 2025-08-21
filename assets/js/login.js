const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const panelLogin = document.getElementById('panel-login');
const panelRegister = document.getElementById('panel-register');

tabLogin.addEventListener('click', () => {
  tabLogin.setAttribute('aria-selected', 'true');
  tabRegister.setAttribute('aria-selected', 'false');
  panelLogin.hidden = false;
  panelRegister.hidden = true;

  tabLogin.classList.add('text-white', 'font-semibold');
  tabRegister.classList.remove('text-white', 'font-semibold');
});

tabRegister.addEventListener('click', () => {
  tabRegister.setAttribute('aria-selected', 'true');
  tabLogin.setAttribute('aria-selected', 'false');
  panelRegister.hidden = false;
  panelLogin.hidden = true; 

  tabRegister.classList.add('text-white', 'font-semibold');
  tabLogin.classList.remove('text-white', 'font-semibold');
});

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const eyeOpen = document.getElementById('eye-open');
  const eyeClosed = document.getElementById('eye-closed');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeOpen.classList.add('hidden');
    eyeClosed.classList.remove('hidden');
  } else {
    passwordInput.type = 'password';
    eyeOpen.classList.remove('hidden');
    eyeClosed.classList.add('hidden');
  }
}

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const user = localStorage.getItem(email);
  if (user) {
    const userData = JSON.parse(user);
    if (userData.password === password) {
      alert('Inicio de sesión exitoso.');
      loginForm.reset();
    } else {
      alert('Contraseña incorrecta.');
    }
  } else {
    alert('Email no registrado.');
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const email = document.getElementById('email-register').value;
  const password = document.getElementById('password-register').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden.');
    return;
  }

  if (localStorage.getItem(email)) {
    alert('Ya existe una cuenta con este correo.');
    return;
  }

  const user = {
    firstName,
    lastName,
    email,
    password
  };

  localStorage.setItem(email, JSON.stringify(user));
  alert('Cuenta creada.');
  registerForm.reset();
  tabLogin.click(); 
});