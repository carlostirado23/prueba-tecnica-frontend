import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DOC_TYPES = [
  { value: 'concepto_medico', label: 'Concepto Médico' },
  { value: 'paraclinico', label: 'Paraclínico' },
  { value: 'examen_complementario', label: 'Examen Complementario' },
];

const EMPTY_EXAMEN = { nombre: '', resultado: '', valorReferencia: '', unidad: '' };

export default function Admin() {
  const { adminKey, loginAdmin, logoutAdmin } = useContext(AuthContext);

  const [keyInput, setKeyInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState('docs');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Patient form
  const [patCedula, setPatCedula] = useState('');
  const [patEmail, setPatEmail] = useState('');

  // Document form - common
  const [cedula, setCedula] = useState('');
  const [paciente, setPaciente] = useState('');
  const [docType, setDocType] = useState('concepto_medico');
  const [fecha, setFecha] = useState('');

  // concepto_medico + examen_complementario shared
  const [medico, setMedico] = useState('');
  const [recomendaciones, setRecomendaciones] = useState('');

  // concepto_medico
  const [diagnostico, setDiagnostico] = useState('');
  const [concepto, setConcepto] = useState('');
  const [restricciones, setRestricciones] = useState('');

  // paraclinico
  const [laboratorio, setLaboratorio] = useState('');
  const [examenes, setExamenes] = useState([{ ...EMPTY_EXAMEN }]);
  const [observaciones, setObservaciones] = useState('');

  // examen_complementario
  const [tipoExamen, setTipoExamen] = useState('');
  const [hallazgos, setHallazgos] = useState('');
  const [conclusion, setConclusion] = useState('');

  const authHeaders = { 'x-admin-key': adminKey, 'Content-Type': 'application/json' };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!keyInput.trim()) {
      setLoginError('Ingresa la clave de administrador');
      return;
    }
    loginAdmin(keyInput.trim());
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${window.API_URL}/admin/patients`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ cedula: patCedula, email: patEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Paciente registrado exitosamente');
        setPatCedula('');
        setPatEmail('');
      } else {
        setError(data.message || 'Error al registrar paciente');
      }
    } catch {
      setError('Error de conexión');
    }
    setSubmitting(false);
  };

  const buildContent = () => {
    const base = { paciente, cedula, fecha };
    if (docType === 'concepto_medico') {
      return { ...base, medico, diagnostico, concepto, recomendaciones, restricciones };
    }
    if (docType === 'paraclinico') {
      return { ...base, laboratorio, examenes, observaciones };
    }
    return { ...base, tipoExamen, medico, hallazgos, conclusion, recomendaciones };
  };

  const resetDocForm = () => {
    setCedula(''); setPaciente(''); setFecha(''); setMedico('');
    setDiagnostico(''); setConcepto(''); setRecomendaciones(''); setRestricciones('');
    setLaboratorio(''); setExamenes([{ ...EMPTY_EXAMEN }]); setObservaciones('');
    setTipoExamen(''); setHallazgos(''); setConclusion('');
  };

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${window.API_URL}/admin/documents`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ cedula, type: docType, content: buildContent() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Documento creado exitosamente');
        resetDocForm();
      } else {
        setError(data.message || 'Error al crear documento');
      }
    } catch {
      setError('Error de conexión');
    }
    setSubmitting(false);
  };

  const addExamen = () => setExamenes([...examenes, { ...EMPTY_EXAMEN }]);
  const removeExamen = (i) => setExamenes(examenes.filter((_, idx) => idx !== i));
  const updateExamen = (i, field, value) => {
    const next = [...examenes];
    next[i] = { ...next[i], [field]: value };
    setExamenes(next);
  };

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-blue';
  const smallInputCls = 'px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-medical-blue';

  if (!adminKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-blue to-medical-dark flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Panel Administrativo</h1>
          <p className="text-center text-gray-600 mb-8">Salud Ocupacional de los Andes</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{loginError}</div>
            )}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Clave de administrador</label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Ingresa la clave de acceso"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue"
                required
              />
            </div>
            <button type="submit" className="w-full bg-medical-blue text-white py-2 rounded-lg font-semibold hover:bg-medical-dark transition">
              Iniciar sesión
            </button>
            <p className="text-center text-gray-600 text-sm">
              <Link to="/" className="text-medical-blue hover:underline">Volver a inicio</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-medical-blue">Panel Administrativo</h1>
          <button onClick={logoutAdmin} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 mb-6 bg-gray-200 p-1 rounded-lg w-fit">
          <button
            onClick={() => { setTab('patients'); setError(''); setSuccess(''); }}
            className={`px-4 py-2 rounded text-sm font-medium transition ${tab === 'patients' ? 'bg-white shadow text-medical-blue' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Registrar Paciente
          </button>
          <button
            onClick={() => { setTab('docs'); setError(''); setSuccess(''); }}
            className={`px-4 py-2 rounded text-sm font-medium transition ${tab === 'docs' ? 'bg-white shadow text-medical-blue' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Crear Documento
          </button>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}

        {tab === 'patients' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Registrar Paciente</h2>
            <form onSubmit={handleCreatePatient} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
                <input type="text" value={patCedula} onChange={(e) => setPatCedula(e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={patEmail} onChange={(e) => setPatEmail(e.target.value)} className={inputCls} required />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-medical-blue text-white py-2 rounded-lg font-semibold hover:bg-medical-dark transition disabled:opacity-50">
                {submitting ? 'Registrando...' : 'Registrar Paciente'}
              </button>
            </form>
          </div>
        )}

        {tab === 'docs' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Crear Documento</h2>
            <form onSubmit={handleCreateDoc} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula del paciente</label>
                  <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del paciente</label>
                  <input type="text" value={paciente} onChange={(e) => setPaciente(e.target.value)} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
                  <select value={docType} onChange={(e) => setDocType(e.target.value)} className={inputCls}>
                    {DOC_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputCls} required />
                </div>
              </div>

              {docType === 'concepto_medico' && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Médico</label>
                      <input type="text" value={medico} onChange={(e) => setMedico(e.target.value)} className={inputCls} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
                      <input type="text" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} className={inputCls} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Concepto médico</label>
                    <textarea value={concepto} onChange={(e) => setConcepto(e.target.value)} rows={3} className={inputCls} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recomendaciones</label>
                      <textarea value={recomendaciones} onChange={(e) => setRecomendaciones(e.target.value)} rows={2} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Restricciones</label>
                      <textarea value={restricciones} onChange={(e) => setRestricciones(e.target.value)} rows={2} className={inputCls} />
                    </div>
                  </div>
                </div>
              )}

              {docType === 'paraclinico' && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Laboratorio</label>
                    <input type="text" value={laboratorio} onChange={(e) => setLaboratorio(e.target.value)} className={inputCls} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exámenes</label>
                    <div className="grid grid-cols-4 gap-1 mb-1">
                      {['Nombre', 'Resultado', 'Valor referencia', 'Unidad'].map((h) => (
                        <p key={h} className="text-xs font-medium text-gray-500 px-1">{h}</p>
                      ))}
                    </div>
                    {examenes.map((ex, i) => (
                      <div key={i} className="grid grid-cols-4 gap-1 mb-2 items-center">
                        <input placeholder="Nombre" value={ex.nombre} onChange={(e) => updateExamen(i, 'nombre', e.target.value)}
                          className={smallInputCls} required />
                        <input placeholder="Resultado" value={ex.resultado} onChange={(e) => updateExamen(i, 'resultado', e.target.value)}
                          className={smallInputCls} required />
                        <input placeholder="0 - 100" value={ex.valorReferencia} onChange={(e) => updateExamen(i, 'valorReferencia', e.target.value)}
                          className={smallInputCls} />
                        <div className="flex gap-1">
                          <input placeholder="mg/dL" value={ex.unidad} onChange={(e) => updateExamen(i, 'unidad', e.target.value)}
                            className={`${smallInputCls} flex-1`} />
                          {examenes.length > 1 && (
                            <button type="button" onClick={() => removeExamen(i)}
                              className="px-2 text-red-400 hover:text-red-600 font-bold text-lg leading-none">×</button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={addExamen} className="text-medical-blue text-sm hover:underline mt-1">
                      + Agregar examen
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2} className={inputCls} />
                  </div>
                </div>
              )}

              {docType === 'examen_complementario' && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de examen</label>
                      <input type="text" value={tipoExamen} onChange={(e) => setTipoExamen(e.target.value)} className={inputCls} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Médico</label>
                      <input type="text" value={medico} onChange={(e) => setMedico(e.target.value)} className={inputCls} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hallazgos</label>
                    <textarea value={hallazgos} onChange={(e) => setHallazgos(e.target.value)} rows={3} className={inputCls} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conclusión</label>
                    <textarea value={conclusion} onChange={(e) => setConclusion(e.target.value)} rows={3} className={inputCls} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recomendaciones</label>
                    <textarea value={recomendaciones} onChange={(e) => setRecomendaciones(e.target.value)} rows={2} className={inputCls} />
                  </div>
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full bg-medical-blue text-white py-2 rounded-lg font-semibold hover:bg-medical-dark transition disabled:opacity-50">
                {submitting ? 'Creando...' : 'Crear Documento'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
