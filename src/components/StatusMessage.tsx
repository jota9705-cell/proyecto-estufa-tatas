'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

function StatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  if (!status) return null;

  const configs = {
    success: {
      icon: <CheckCircle2 className="text-green-500" />,
      title: '¡Pago Exitoso!',
      message: 'Muchas gracias por tu aporte. Se verá reflejado en el contador en unos minutos.',
      bg: 'bg-green-50',
      border: 'border-green-100'
    },
    failure: {
      icon: <XCircle className="text-red-500" />,
      title: 'Pago Fallido',
      message: 'Hubo un problema al procesar tu pago. Por favor intenta de nuevo.',
      bg: 'bg-red-50',
      border: 'border-red-100'
    },
    pending: {
      icon: <AlertCircle className="text-orange-500" />,
      title: 'Pago Pendiente',
      message: 'Tu pago está siendo procesado. Te avisaremos cuando se apruebe.',
      bg: 'bg-orange-50',
      border: 'border-orange-100'
    }
  };

  const config = configs[status as keyof typeof configs];
  if (!config) return null;

  return (
    <div className={`${config.bg} ${config.border} border p-6 rounded-3xl flex items-center gap-4 mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500`}>
      <div className="bg-white p-2 rounded-full shadow-sm">
        {config.icon}
      </div>
      <div>
        <h4 className="font-bold text-zinc-900">{config.title}</h4>
        <p className="text-zinc-600 text-sm">{config.message}</p>
      </div>
    </div>
  );
}

export default function StatusMessage() {
  return (
    <Suspense fallback={null}>
      <StatusContent />
    </Suspense>
  );
}
