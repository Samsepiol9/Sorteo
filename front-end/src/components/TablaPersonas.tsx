import { useEffect, useState } from "react";

type Persona = {
  numero: number;
  nombre: string;
  apellido: string;
  usr_Instagram: string;
};

export default function TablaPersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    fetch("https://www.unarifaloca.com/api/participantes")
      .then((res) => res.json())
      .then((data) => setPersonas(data))
      .catch((err) => console.error("Error al traer personas:", err));
  }, []);

  // Creamos un mapa para acceso rápido por número
  const personasMap = new Map<number, Persona>();
  personas.forEach(p => personasMap.set(p.numero, p));

  // Generamos 400 filas
  const filas = Array.from({ length: 700 }, (_, i) => {
    const numero = i + 1;
    const persona = personasMap.get(numero);

    return (
      <tr key={numero}>
        <td>{numero}</td>
        <td>{persona?.nombre || ""}</td>
        <td>{persona?.apellido || ""}</td>
        <td>{persona?.usr_Instagram || ""}</td>
      </tr>
    );
  });

  return (
   <div className="table-responsive pt-3" style={{ maxHeight: "500px", overflowY: "auto" }}>

  <table className="table regularFont table-striped table-bordered bg-light text-dark mb-0">
    <thead className="table-dark" style={{ position: "sticky", top: 0, zIndex: 1 }}>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Apellido</th>
        <th scope="col">Usuario Instagram</th>
      </tr>
    </thead>
    <tbody>{filas}</tbody>
  </table>
</div>

  );
}
