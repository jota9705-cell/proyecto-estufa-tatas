import Stats from '@/components/Stats';
import DonationForm from '@/components/DonationForm';
import StatusMessage from '@/components/StatusMessage';
import { Flame } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-600 text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <Flame size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Calorcito para los Tatas
          </h1>
          <p className="text-orange-100 text-lg md:text-xl max-w-2xl mx-auto">
            Ayúdanos a recaudar sacos de pellet para pasar el invierno y a mantener la estufa funcionando impecable.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-10 px-6 space-y-8">
        {/* Mensaje de estado de pago */}
        <StatusMessage />

        {/* Estadísticas */}
        <section>
          <Stats />
        </section>

        {/* Formulario de Donación */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 order-2 md:order-1">
            <DonationForm />
          </div>

          <div className="space-y-6 order-1 md:order-2 sticky top-8">
            <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-zinc-900">¿Por qué donar?</h3>
              <p className="text-zinc-600 leading-relaxed">
                Nuestros abuelos usan una estufa <strong>Bosca Hera +</strong> que consume aproximadamente 1.5kg de pellet por hora.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-zinc-600">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span><strong>1 saco</strong> = 2 días de calor (6h/día).</span>
                </li>
                <li className="flex gap-3 text-zinc-600">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span><strong>$4.500</strong> es el valor de un saco de 18,5kg.</span>
                </li>
                <li className="flex gap-3 text-zinc-600">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span>El fondo de estufa es para limpiezas de cañón y repuestos.</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900 p-8 rounded-3xl text-white space-y-4">
              <h3 className="text-xl font-bold">Transparencia Total</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Todo lo recaudado va directamente a la cuenta del administrador. Los pagos con tarjeta se procesan vía Mercado Pago y se descuenta una pequeña comisión de la plataforma.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-20 text-center text-zinc-400 text-sm">
        <p>Hecho con ❤️ para la familia</p>
      </footer>
    </main>
  );
}
