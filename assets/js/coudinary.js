document.getElementById("uploadBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Selecciona una imagen primero.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "geekxpress"); // reemplaza con tu preset
  formData.append("cloud_name", "dz4qsmco8"); // reemplaza con tu cloud name

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dz4qsmco8/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Respuesta:", data);

    // Mostrar imagen subida
    const preview = document.getElementById("preview");
    preview.innerHTML = `<img src="${data.secure_url}" width="300">`;

  } catch (err) {
    console.error("Error al subir la imagen:", err);
  }
});
