'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Flame, Package } from 'lucide-react';

export default function Stats() {
  const [stats, setStats] = useState({ sacos: 0, estufa: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('donaciones')
        .select('tipo, cantidad_sacos, monto_total')
        .eq('estado', 'aprobado');

      if (error) {
        console.error('Error fetching stats:', error);
      } else {
        const totalSacos = data
          .filter(d => d.tipo === 'saco_pellet')
          .reduce((acc, curr) => acc + (curr.cantidad_sacos || 0), 0);
        
        const totalEstufa = data
          .filter(d => d.tipo === 'aporte_estufa')
          .reduce((acc, curr) => acc + (curr.monto_total || 0), 0);

        setStats({ sacos: totalSacos, estufa: totalEstufa });
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) return <div className="h-24 animate-pulse bg-zinc-100 rounded-xl" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
      <div className="bg-orange-50 p-4 md:p-6 rounded-2xl border border-orange-100 flex items-center gap-4">
        <div className="bg-orange-500 p-2.5 md:p-3 rounded-full text-white">
          <Package size={20} className="md:w-6 md:h-6" />
        </div>
        <div>
          <p className="text-xs md:text-sm text-orange-800 font-medium uppercase tracking-wider">Sacos Recaudados</p>
          <p className="text-2xl md:text-3xl font-bold text-orange-950">{stats.sacos}</p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 md:p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
        <div className="bg-blue-500 p-2.5 md:p-3 rounded-full text-white">
          <Flame size={20} className="md:w-6 md:h-6" />
        </div>
        <div>
          <p className="text-xs md:text-sm text-blue-800 font-medium uppercase tracking-wider">Fondo Estufa</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-950">
            ${stats.estufa.toLocaleString('es-CL')}
          </p>
        </div>
      </div>
    </div>
  );
}
