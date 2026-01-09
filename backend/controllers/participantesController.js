const db = require('../database/conexion.js')

class ParticipantesController {
    constructor(){

    }

   consultar(req, res) {
  try {
    db.query(
      `SELECT numero, nombre, apellido, usr_Instagram FROM participantes`,
      (err, rows) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.status(200).json(rows);
      }
    );
  } catch (err) {
    res.status(500).send("Error del servidor");
  }
}


    verificarNumero (req, res) {
  const { numero } = req.params;
  db.query("SELECT * FROM participantes WHERE numero = ?", [numero], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });

    if (rows.length > 0) {
      return res.json({ disponible: false });
    } else {
      return res.json({ disponible: true });
    }
  });
};
    validarCodigo  (req, res)  {
  try {
    const { codigo } = req.body;

    if (!codigo || codigo.length !== 8) {
      return res.status(400).json({ message: "Código inválido" });
    }

    db.query(
      "SELECT * FROM codigos WHERE codigo = ? AND usado = 0",
      [codigo],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ message: "Error en la base de datos", error: err });
        }

        if (rows.length === 0) {
          return res.status(404).json({ message: "Código no válido o ya fue usado" });
        }

        res.status(200).json({ message: "Código válido", codigo: rows[0].codigo });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Error del servidor", error: err });
  }
};

    
ingresar(req, res) {
  try {
    const { numero, nombre, apellido, ciudad, telefono, correo, usr_Instagram, codigo } = req.body;

    if (!codigo) {
      return res.status(400).json({ message: "Código requerido" });
    }

    // Paso 1: Verificar si el número ya está ocupado
    db.query("SELECT COUNT(1) AS ocupado FROM participantes WHERE numero = ?", [numero], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Error en la base de datos (ocupado)", error: err });
      }

      if (rows[0].ocupado > 0) {
        return res.status(400).json({ message: "Este número ya está siendo usado" });
      }

      // Paso 2: Verificar si el código existe y no está usado
      db.query("SELECT * FROM codigos WHERE codigo = ? AND usado = 0", [codigo], (err2, rows2) => {
        if (err2) {
          return res.status(500).json({ message: "Error en la base de datos (código)", error: err2 });
        }

        if (rows2.length === 0) {
          return res.status(400).json({ message: "Código inválido o ya usado" });
        }

        // Paso 3: Insertar participante
        db.query(
          `INSERT INTO participantes
            (numero, nombre, apellido, ciudad, telefono, correo, usr_Instagram)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [numero, nombre, apellido, ciudad, telefono, correo, usr_Instagram],
          (err3, result) => {
            if (err3) {
              return res.status(400).json({ message: "Error al guardar el registro", error: err3 });
            }

            // Paso 4: Marcar código como usado
            db.query("UPDATE codigos SET usado = 1 WHERE codigo = ?", [codigo], (err4) => {
              if (err4) {
                return res.status(500).json({ message: "Error al actualizar el código", error: err4 });
              }

              // Todo salió bien
              return res.status(201).json({
                message: "Registro guardado y código validado correctamente",
                id: result.insertId,
              });
            });
          }
        );
      });
    });
  } catch (err) {
    return res.status(500).json({ message: "Error del servidor", error: err });
  }
}


    actualizar(req,res){

        res.json({mensake:'Actualizacion de Participantes'})

    }

    borrar(req,res){

        res.json({mensake:'Borrado de Participantes'})

    }

    consultaEspecifica(req,res) {
        const {id}= req.params;
        res.json({mensaje: 'Consulta Participante Especifica'});
    
        

    }
}

module.exports = new ParticipantesController();
