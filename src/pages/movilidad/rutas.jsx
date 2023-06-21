import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

function Rutas() {
  const [formData, setFormData] = useState({
    movilidad_ruta_direccion: '',
    movilidad_ruta_hora_recojo: '',
    movilidad_ruta_hora_retorno: '',
    movilidad_id: ''
  });

  const [rutas, setRutas] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/ruta');
        setRutas(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Realizar una solicitud PUT para editar los datos
        await axios.put(`http://127.0.0.1:8000/ruta/${editingId}`, formData);
        // Actualizar la lista de rutas después de la edición
        const updatedRutas = rutas.map((ruta) => {
          if (ruta.id === editingId) {
            return { ...ruta, ...formData };
          }
          return ruta;
        });
        setRutas(updatedRutas);
        setEditingId(null); // Restablecer el ID de edición a null después de la edición
      } else {
        // Realizar una solicitud POST para crear una nueva ruta
        const response = await axios.post('http://127.0.0.1:8000/ruta', formData);
        const newRuta = response.data;
        setRutas([...rutas, newRuta]);
      }

      // Restablecer el formulario después de enviar
      setFormData({
        movilidad_ruta_direccion: '',
        movilidad_ruta_hora_recojo: '',
        movilidad_ruta_hora_retorno: '',
        movilidad_id: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    // Obtener los datos de la ruta a editar
    const rutaToEdit = rutas.find((ruta) => ruta.id === id);
    if (rutaToEdit) {
      setFormData(rutaToEdit); // Establecer los datos de la ruta en el formulario
      setEditingId(id); // Establecer el ID de edición
    }
  };

  const handleDelete = async (id) => {
    try {
      // Realizar una solicitud DELETE para eliminar la ruta
      await axios.delete(`http://127.0.0.1:8000/ruta/${id}`);
      // Actualizar la lista de rutas después de la eliminación
      const updatedRutas = rutas.filter((ruta) => ruta.id !== id);
      setRutas(updatedRutas);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Rutas</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item"><a href="index.html">Inicio</a></li>
            <li className="breadcrumb-item active">Rutas</li>
          </ol>
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="movilidad_ruta_direccion" className="form-label">Dirección:</label>
                  <input type="text" id="movilidad_ruta_direccion" name="movilidad_ruta_direccion" className="form-control" value={formData.movilidad_ruta_direccion} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="movilidad_ruta_hora_recojo" className="form-label">Hora de recojo:</label>
                  <input type="time" id="movilidad_ruta_hora_recojo" name="movilidad_ruta_hora_recojo" className="form-control" value={formData.movilidad_ruta_hora_recojo} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="movilidad_ruta_hora_retorno" className="form-label">Hora de retorno:</label>
                  <input type="time" id="movilidad_ruta_hora_retorno" name="movilidad_ruta_hora_retorno" className="form-control" value={formData.movilidad_ruta_hora_retorno} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="movilidad_id" className="form-label">Movilidad ID:</label>
                  <select id="movilidad_id" name="movilidad_id" className="form-select" value={formData.movilidad_id} onChange={handleChange}>
                    <option value="">Seleccione una opción</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">{editingId ? 'Guardar cambios' : 'Guardar'}</button>
              </form>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Dirección</th>
                    <th>Hora de recojo</th>
                    <th>Hora de retorno</th>
                    <th>Movilidad ID</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rutas.map((ruta) => (
                    <tr key={ruta.id}>
                      <td>{ruta.movilidad_ruta_direccion}</td>
                      <td>{ruta.movilidad_ruta_hora_recojo}</td>
                      <td>{ruta.movilidad_ruta_hora_retorno}</td>
                      <td>{ruta.movilidad_id}</td>
                      <td>
                        <button className="btn btn-primary" onClick={() => handleEdit(ruta.id)}>Editar</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(ruta.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Rutas;
