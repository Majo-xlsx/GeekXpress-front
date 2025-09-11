const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const panelLogin = document.getElementById('panel-login');
const panelRegister = document.getElementById('panel-register');

// --- Tabs de login/register ---
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

// --- Toggle password ---
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

// --- Formularios ---
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// --- Login ---
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  
  // --- ADMIN HARDCODEADO ---
  if (email === "admin@gmail.com" && password === "admin123") {
    const adminUser = {
      email,
      password,
      firstName: "Admin",
      rol: "admin",
      usuario: "Administrador",
      estado: "Activo"
    };
    localStorage.setItem('usuarioLogueado', JSON.stringify(adminUser));
    Swal.fire({
      position: "center-center",
      icon: "success",
      title: "Inicio de sesión exitoso. Redirigiendo al panel de administración...",
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      window.location.href = 'admin.html';
    });

    // alert('Inicio de sesión exitoso. Redirigiendo al panel de administración...');
    loginForm.reset();
    // window.location.href = 'admin.html';
    return;
  }
  
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const user = usuarios.find(u => u.email === email);

  if (!user) {
    alert('Email no registrado.');
    return;
  }

  if (user.password !== password) {
    alert('Contraseña incorrecta.');
    return;
  }


  localStorage.setItem('usuarioLogueado', JSON.stringify(user));

    Swal.fire({
      position: "center-center",
      icon: "success",
      title: "Inicio de sesión exitoso.",
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      window.location.href = 'catalog.html';
    });
  // alert('Inicio de sesión exitoso.');
  loginForm.reset();
  // window.location.href = 'catalog.html';
});

// --- Registro ---
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

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  if (usuarios.some(u => u.email === email)) {
    alert('Ya existe una cuenta con este correo.');
    return;
  }

  const nuevoUsuario = {
    usuario: `${firstName} ${lastName}`,
    email,
    firstName,
    lastName,
    password,
    tipoDoc: "",
    documento: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    ciudad: "",
    rol: "",
    estado: "Activo",
    fechaRegistro: new Date().toISOString().split('T')[0],
    notas: "",
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  // Guardar sesión activa automáticamente
  localStorage.setItem('usuarioLogueado', JSON.stringify(nuevoUsuario));

  Swal.fire({
  position: "center-center",
  icon: "success",
  title: "Cuenta creada. Redirigiendo al catálogo...",
  showConfirmButton: false,
  timer: 1500
}).then(() => {
  window.location.href = 'catalog.html';
});

  // alert('Cuenta creada. Redirigiendo al catálogo...');
  registerForm.reset();
  // window.location.href = 'catalog.html';
});
