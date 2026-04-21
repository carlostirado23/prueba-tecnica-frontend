import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-medical-blue">
              Salud Ocupacional
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#inicio" className={`transition ${scrolled ? 'text-gray-800' : 'text-gray-200'}`}>
                Inicio
              </a>
              <a href="#nosotros" className={`transition ${scrolled ? 'text-gray-800' : 'text-gray-200'}`}>
                Nosotros
              </a>
              <a href="#servicios" className={`transition ${scrolled ? 'text-gray-800' : 'text-gray-200'}`}>
                Servicios
              </a>
              <a href="#contacto" className={`transition ${scrolled ? 'text-gray-800' : 'text-gray-200'}`}>
                Contacto
              </a>
            </div>
            <Link
              to="/login"
              className="bg-medical-blue text-white px-6 py-2 rounded-lg hover:bg-medical-dark transition"
            >
              Consultar resultados
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="inicio"
        className="pt-32 pb-20 bg-gradient-to-r from-medical-blue to-medical-dark text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Salud Ocupacional de los Andes
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Servicios integrales en salud ocupacional
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-medical-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Consultar resultados
          </Link>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Exámenes Ocupacionales
              </h3>
              <p className="text-gray-600">
                Evaluaciones periódicas y pre-ocupacionales adaptadas a tu sector laboral.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">🧬</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Paraclínicos
              </h3>
              <p className="text-gray-600">
                Laboratorio, radiografías y pruebas especializadas de alta precisión.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Evaluaciones Médicas
              </h3>
              <p className="text-gray-600">
                Diagnóstico integral con especialistas en medicina ocupacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Sobre Nosotros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 mb-4">
                Salud Ocupacional de los Andes es una institución prestadora de salud (IPS) con más de 10 años de experiencia en el cuidado integral de la salud laboral.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Nuestro equipo de profesionales altamente capacitados se dedica a brindar servicios de calidad, utilizando la tecnología más avanzada en medicina ocupacional.
              </p>
              <p className="text-lg text-gray-600">
                Contamos con laboratorios acreditados y personal certificado para asegurar resultados confiables y oportunos a nuestros pacientes.
              </p>
            </div>
            <div className="bg-medical-blue text-white p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <p>Pacientes activos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <p>Empresas asociadas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">98%</div>
                  <p>Satisfacción</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <p>Atención disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Teléfono</h3>
              <p className="text-gray-600">(1) 234 5678 - Ext. 100</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Email</h3>
              <p className="text-gray-600">info@saludocupacional.co</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Ubicación</h3>
              <p className="text-gray-600">Cra 5 # 12-45, Bogotá D.C.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Salud Ocupacional de los Andes. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
