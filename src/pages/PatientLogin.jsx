import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PatientLogin() {
  const [step, setStep] = useState('request'); // request, verify
  const [cedula, setCedula] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${window.API_URL}/auth/request-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula }),
      });

      if (response.ok) {
        setSuccessMessage('Código de acceso enviado a tu email');
        setStep('verify');
      } else {
        const data = await response.json();
        setError(data.message || 'Error al solicitar acceso');
      }
    } catch (err) {
      setError('Error de conexión. Intenta más tarde.');
    }

    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${window.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula, code }),
      });

      const data = await response.json();

      if (response.ok) {
        login(cedula, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión. Intenta más tarde.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue to-medical-dark flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Salud Ocupacional
        </h1>
        <p className="text-center text-gray-600 mb-8">Portal de Pacientes</p>

        {step === 'request' ? (
          <form onSubmit={handleRequestAccess} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Solicitar acceso
            </h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Número de cédula
              </label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-medical-blue text-white py-2 rounded-lg font-semibold hover:bg-medical-dark transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Solicitar código'}
            </button>
            <p className="text-center text-gray-600 text-sm">
              <Link to="/" className="text-medical-blue hover:underline">
                Volver a inicio
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Iniciar sesión
            </h2>
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Número de cédula
              </label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Código de acceso
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-medical-blue text-white py-2 rounded-lg font-semibold hover:bg-medical-dark transition disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('request');
                setCedula('');
                setCode('');
                setError('');
                setSuccessMessage('');
              }}
              className="w-full text-medical-blue py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Cambiar cédula
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
