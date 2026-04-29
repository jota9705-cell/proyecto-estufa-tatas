'use client';

import { useState } from 'react';
import { PRECIO_SACO, DIAS_POR_SACO, DATOS_TRANSFERENCIA } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { CreditCard, Landmark, Send, Heart } from 'lucide-react';

export default function DonationForm() {
  const [tipo, setTipo] = useState<'saco_pellet' | 'aporte_estufa'>('saco_pellet');
  const [cantidadSacos, setCantidadSacos] = useState(1);
  const [montoAporte, setMontoAporte] = useState(5000);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [metodoPago, setMetodoPago] = useState<'mercadopago' | 'transferencia'>('mercadopago');
  const [loading, setLoading] = useState(false);
  const [showTransferencia, setShowTransferencia] = useState(false);

  const total = tipo === 'saco_pellet' ? cantidadSacos * PRECIO_SACO : montoAporte;
  const diasCalor = tipo === 'saco_pellet' ? cantidadSacos * DIAS_POR_SACO : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Guardar en Supabase (estado pendiente)
      const { data: donation, error } = await supabase
        .from('donaciones')
        .insert({
          tipo,
          cantidad_sacos: tipo === 'saco_pellet' ? cantidadSacos : 0,
          monto_total: total,
          estado: 'pendiente',
          metodo_pago: metodoPago,
          nombre_donante: nombre,
          mensaje: mensaje
        })
        .select()
        .single();

      if (error) throw error;

      if (metodoPago === 'mercadopago') {
        // 2. Crear preferencia en Mercado Pago (necesitaremos esta API)
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: donation.id,
            title: tipo === 'saco_pellet' ? `${cantidadSacos} Sacos de Pellet` : 'Aporte Estufa',
            amount: total,
            description: mensaje
          })
        });

        const { url } = await response.json();
        window.location.href = url; // Redirigir a Mercado Pago
      } else {
        // Mostrar datos de transferencia
        setShowTransferencia(true);
      }
    } catch (err: any) {
      console.error('Error al procesar donación:', err);
      // Mostramos un alert con el mensaje de error específico para debuguear
      alert(`Error: ${err.message || 'Error desconocido'}. Revisa la consola del navegador.`);
    } finally {
      setLoading(false);
    }
  };

  if (showTransferencia) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 text-center space-y-6">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-green-600">
          <Heart size={32} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900">¡Muchas gracias, {nombre || 'familiar'}!</h2>
        <p className="text-zinc-600">Tu intención de donar <strong>${total.toLocaleString('es-CL')}</strong> ha sido registrada.</p>
        
        <div className="bg-zinc-50 p-6 rounded-2xl text-left space-y-3 border border-zinc-200">
          <p className="font-bold text-zinc-900 border-bottom pb-2">Datos para la transferencia:</p>
          <p className="text-zinc-900"><span className="text-zinc-500 text-sm">Banco:</span> {DATOS_TRANSFERENCIA.banco}</p>
          <p className="text-zinc-900"><span className="text-zinc-500 text-sm">Tipo:</span> {DATOS_TRANSFERENCIA.tipo_cuenta}</p>
          <p className="text-zinc-900"><span className="text-zinc-500 text-sm">N° Cuenta:</span> {DATOS_TRANSFERENCIA.numero}</p>
          <p className="text-zinc-900"><span className="text-zinc-500 text-sm">Nombre:</span> {DATOS_TRANSFERENCIA.nombre}</p>
          <p className="text-zinc-900"><span className="text-zinc-500 text-sm">RUT:</span> {DATOS_TRANSFERENCIA.rut}</p>
          <p className="text-zinc-900"><span className="text-zinc-500 text-sm">Email:</span> {DATOS_TRANSFERENCIA.email}</p>
        </div>
        
        <p className="text-sm text-zinc-500">
          Una vez que realices la transferencia, el administrador validará tu aporte y se verá reflejado en el contador.
        </p>
        
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 space-y-6">
      <div className="flex p-1 bg-zinc-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setTipo('saco_pellet')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${tipo === 'saco_pellet' ? 'bg-white shadow-sm text-orange-600' : 'text-zinc-500'}`}
        >
          Sacos de Pellet
        </button>
        <button
          type="button"
          onClick={() => setTipo('aporte_estufa')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${tipo === 'aporte_estufa' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500'}`}
        >
          Aporte Estufa
        </button>
      </div>

      {tipo === 'saco_pellet' ? (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-700">¿Cuántos sacos quieres regalar?</label>
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => setCantidadSacos(Math.max(1, cantidadSacos - 1))}
              className="w-12 h-12 rounded-xl border border-zinc-200 flex items-center justify-center text-xl font-bold hover:bg-zinc-50 text-zinc-900"
            >-</button>
            <div className="flex-1 text-center text-3xl font-bold text-zinc-900">{cantidadSacos}</div>
            <button 
              type="button"
              onClick={() => setCantidadSacos(cantidadSacos + 1)}
              className="w-12 h-12 rounded-xl border border-zinc-200 flex items-center justify-center text-xl font-bold hover:bg-zinc-50 text-zinc-900"
            >+</button>
          </div>
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
            <p className="text-orange-800 text-sm font-medium">
              🔥 ¡Increíble! Con esto le regalas a los tatas <strong>{diasCalor} días</strong> de calefacción (6 horas al día).
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-700">Monto del aporte (CLP)</label>
          <input
            type="number"
            value={montoAporte}
            onChange={(e) => setMontoAporte(Number(e.target.value))}
            className="w-full p-4 rounded-2xl border border-zinc-200 text-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900"
            min="1000"
            step="1000"
          />
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-4 rounded-2xl border border-zinc-200 outline-none focus:border-zinc-400 text-zinc-900 placeholder:text-zinc-400"
        />
        <textarea
          placeholder="Deja un mensajito de cariño..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="w-full p-4 rounded-2xl border border-zinc-200 outline-none focus:border-zinc-400 min-h-[100px] text-zinc-900 placeholder:text-zinc-400"
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-700">Método de pago</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMetodoPago('mercadopago')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${metodoPago === 'mercadopago' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}
          >
            <CreditCard size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Tarjeta / MP</span>
          </button>
          <button
            type="button"
            onClick={() => setMetodoPago('transferencia')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${metodoPago === 'transferencia' ? 'border-zinc-800 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}
          >
            <Landmark size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Transferencia</span>
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${loading ? 'bg-zinc-100 text-zinc-400' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200'}`}
      >
        {loading ? (
          <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-400"></span>
        ) : (
          <>
            <Send size={20} />
            Donar ${total.toLocaleString('es-CL')}
          </>
        )}
      </button>
    </form>
  );
}
