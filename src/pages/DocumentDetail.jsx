import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TYPE_LABELS = {
  concepto_medico: 'Concepto Médico',
  paraclinico: 'Paraclínico',
  examen_complementario: 'Examen Complementario',
};

function MetadataConcepto({ m }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Field label="Médico" value={m.medico} />
      <Field label="Diagnóstico" value={m.diagnostico} />
      <div className="md:col-span-2">
        <Field label="Concepto médico" value={m.concepto} />
      </div>
      {m.recomendaciones && <Field label="Recomendaciones" value={m.recomendaciones} />}
      {m.restricciones && <Field label="Restricciones" value={m.restricciones} />}
    </div>
  );
}

function MetadataParaclinico({ m }) {
  return (
    <div className="space-y-4">
      <Field label="Laboratorio" value={m.laboratorio} />
      {m.examenes?.length > 0 && (
        <div>
          <p className="mb-2 text-sm text-gray-600">Exámenes</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 font-medium text-left text-gray-700 border">Nombre</th>
                  <th className="px-3 py-2 font-medium text-left text-gray-700 border">Resultado</th>
                  <th className="px-3 py-2 font-medium text-left text-gray-700 border">Valor referencia</th>
                  <th className="px-3 py-2 font-medium text-left text-gray-700 border">Unidad</th>
                </tr>
              </thead>
              <tbody>
                {m.examenes.map((ex, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-3 py-2 border">{ex.nombre}</td>
                    <td className="px-3 py-2 font-medium border">{ex.resultado}</td>
                    <td className="px-3 py-2 text-gray-600 border">{ex.valorReferencia || '-'}</td>
                    <td className="px-3 py-2 text-gray-600 border">{ex.unidad || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {m.observaciones && <Field label="Observaciones" value={m.observaciones} />}
    </div>
  );
}

function MetadataExamenComp({ m }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Field label="Tipo de examen" value={m.tipoExamen} />
      <Field label="Médico" value={m.medico} />
      <div className="md:col-span-2">
        <Field label="Hallazgos" value={m.hallazgos} />
      </div>
      <div className="md:col-span-2">
        <Field label="Conclusión" value={m.conclusion} />
      </div>
      {m.recomendaciones && (
        <div className="md:col-span-2">
          <Field label="Recomendaciones" value={m.recomendaciones} />
        </div>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-sm text-gray-600">{label}</p>
      <p className="text-gray-900">{value || 'No especificado'}</p>
    </div>
  );
}

export default function DocumentDetail() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocument();
  }, [id, user]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`${window.API_URL}/documents/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      } else if (response.status === 404) {
        setError('Documento no encontrado');
      } else {
        setError('Error al cargar el documento');
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

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`${window.API_URL}/documents/${id}/download`, {
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
    setDownloading(false);
  };

  const renderMetadata = (doc) => {
    const m = doc.metadata || {};
    if (doc.type === 'concepto_medico') return <MetadataConcepto m={m} />;
    if (doc.type === 'paraclinico') return <MetadataParaclinico m={m} />;
    if (doc.type === 'examen_complementario') return <MetadataExamenComp m={m} />;
    return <p className="text-sm text-gray-600">Sin información adicional</p>;
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

      <div className="max-w-4xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <Link to="/dashboard" className="inline-block mb-6 text-medical-blue hover:underline">
          ← Volver a documentos
        </Link>

        {error && (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>
        )}

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 mb-3 border-4 rounded-full border-medical-blue border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Cargando documento...</p>
          </div>
        ) : document ? (
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {TYPE_LABELS[document.type] || document.type}
                </h1>
                <p className="text-gray-600">
                  Fecha: {new Date(document.created_at).toLocaleDateString('es-CO')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${document.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {document.status ? 'Completado' : 'En proceso'}
              </span>
            </div>

            <div className="p-6 mb-8 rounded-lg bg-gray-50">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Información del documento</h2>
              {renderMetadata(document)}
            </div>

            {document.status ? (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-6 py-2 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {downloading ? 'Generando enlace...' : 'Descargar PDF'}
              </button>
            ) : (
              <div className="px-4 py-3 text-blue-800 border border-blue-200 rounded bg-blue-50">
                Tu documento está en proceso. Será notificado cuando esté listo.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
