import { useState, useEffect } from "react";

export default function RegistroForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    ciudad: "",
    telefono: "",
    correo: "",
    usr_Instagram: "@", // 👈 empezamos con @
    numero: "",
  });

  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const codigoGuardado = localStorage.getItem("codigo");
    if (!codigoGuardado) {
      window.location.href = "/";
    } else {
      setCodigo(codigoGuardado);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // 👇 caso especial: Instagram
    if (id === "usr_Instagram") {
      // Siempre empieza con @
      const newValue = value.startsWith("@") ? value : "@" + value;
      setFormData({ ...formData, [id]: newValue });
      return;
    }

      if ((id === "nombre" || id === "apellido") && value.includes(" ")) {
    return; // ❌ ignora el input si tiene espacios
  }

    // 👇 caso especial: número (validar rango 1-700 en tiempo real)
    if (id === "numero") {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1 || num > 700) {
        setError("El número debe estar entre 1 y 700.");
      } else {
        setError("");
      }
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error || !codigo) return;

    setLoading(true);
    try {
      const res = await fetch("https://www.unarifaloca.com/api/participantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, codigo }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Registro guardado correctamente");
        setFormData({
          nombre: "",
          apellido: "",
          ciudad: "",
          telefono: "",
          correo: "",
          usr_Instagram: "@", // 👈 al resetear vuelve a poner @
          numero: "",
        });

        localStorage.removeItem("codigo");
        window.location.href = "/";
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Formulario de Registro</h2>
      <form className="mx-auto" style={{ maxWidth: "600px" }} onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control regularFont"
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Solo un Nombre"
            pattern="^[^\s]+$"
            maxLength={10}
            required
          />
        </div>

        {/* Apellido */}
        <div className="mb-3">
          <label htmlFor="apellido" className="form-label">Apellido</label>
          <input
            type="text"
            className="form-control regularFont"
            id="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Solo un Apellido"
            pattern="^[^\s]+$"
            maxLength={12}
            required
          />
        </div>

        {/* Ciudad */}
        <div className="mb-3">
          <label htmlFor="ciudad" className="form-label">Ciudad</label>
          <input
            type="text"
            className="form-control regularFont"
            id="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            placeholder="Ciudad de residencia"
            required
          />
        </div>

        {/* Teléfono */}
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Número de Teléfono</label>
          <input
            type="tel"
            className="form-control regularFont"
            id="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ej. +57 3001234567"
            required
          />
        </div>

        {/* Correo */}
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control regularFont"
            id="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        {/* Instagram */}
        <div className="mb-3">
          <label htmlFor="usr_Instagram" className="form-label">Usuario de Instagram</label>
          <input
            type="text"
            className="form-control regularFont"
            id="usr_Instagram"
            value={formData.usr_Instagram}
            onChange={handleChange}
            placeholder="@tuusuario"
            required
          />
        </div>

        {/* Número */}
        <div className="mb-3">
          <label htmlFor="numero" className="form-label">Número Deseado</label>
          <input
            type="number"
            className={`form-control regularFont ${error ? "is-invalid" : ""}`}
            id="numero"
            value={formData.numero}
            onChange={handleChange}
            onBlur={async () => {
              const num = parseInt(formData.numero, 10);
              if (isNaN(num) || num < 1 || num > 700) {
                setError("El número debe estar entre 1 y 700.");
                return;
              }

              try {
                const res = await fetch(`https://www.unarifaloca.com/api/participantes/verificar/${num}`);
                const data = await res.json();
                if (!data.disponible) {
                  setError("El número ya está en uso, elige otro.");
                } else {
                  setError("");
                }
              } catch {
                setError("Error al verificar el número, intenta de nuevo.");
              }
            }}
            placeholder="Ej. 77"
            min={1}
            max={700}
            required
          />
          <div style={{ color: "red", fontSize: "0.9rem", minHeight: "1em" }}>
            {error}
          </div>
        </div>

        {/* Botón */}
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading || !!error}>
            {loading ? "Guardando..." : "Guardar Registro"}
          </button>
        </div>
      </form>
    </div>
  );
}
