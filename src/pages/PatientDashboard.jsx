import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TYPE_LABELS = {
  concepto_medico: 'Concepto Médico',
  paraclinico: 'Paraclínico',
  examen_complementario: 'Examen Complementario',
};

export default function PatientDashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${window.API_URL}/documents`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        setError('Error al cargar documentos');
      }
    } catch {
      setError('Error de conexión');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDownload = async (documentId) => {
    setDownloading(documentId);
    try {
      const res = await fetch(`${window.API_URL}/documents/${documentId}/download`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const { url } = await res.json();
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', '');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        setError('No se pudo generar el enlace de descarga');
      }
    } catch {
      setError('Error al descargar');
    }
    setDownloading(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-medical-blue">Salud Ocupacional</Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Cédula: <strong>{user.cedula}</strong></span>
              <button onClick={handleLogout} className="px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-600">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Mis Documentos</h1>

        {error && (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>
        )}

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 mb-3 border-4 rounded-full border-medical-blue border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Cargando documentos...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow">
            <p className="mb-2 text-gray-600">No hay documentos disponibles</p>
            <p className="text-sm text-gray-500">Cuando se carguen nuevos resultados, aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-900">Tipo</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-900">Fecha</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-900">Estado</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const isCompleted = !!doc.status;
                  return (
                    <tr key={doc.id} className="transition border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {TYPE_LABELS[doc.type] || doc.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(doc.created_at).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {isCompleted ? 'Completado' : 'En proceso'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2 text-sm">
                        <Link to={`/documents/${doc.id}`} className="text-medical-blue hover:underline">
                          Ver detalle
                        </Link>
                        {isCompleted && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleDownload(doc.id)}
                              disabled={downloading === doc.id}
                              className="text-green-600 hover:underline disabled:opacity-50"
                            >
                              {downloading === doc.id ? 'Generando...' : 'Descargar'}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
