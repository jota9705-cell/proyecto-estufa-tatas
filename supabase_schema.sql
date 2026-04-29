-- Tabla de donaciones
CREATE TABLE donaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tipo TEXT NOT NULL CHECK (tipo IN ('saco_pellet', 'aporte_estufa')),
  cantidad_sacos INTEGER DEFAULT 0,
  monto_total INTEGER NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
  metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('mercadopago', 'transferencia')),
  nombre_donante TEXT,
  mensaje TEXT,
  mp_preference_id TEXT
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE donaciones ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública (para los contadores)
CREATE POLICY "Permitir lectura pública de donaciones aprobadas" 
ON donaciones FOR SELECT 
USING (estado = 'aprobado');

-- Política para permitir inserción pública (para crear nuevas donaciones)
-- Nota: En un entorno de producción real, podrías querer restringir esto, 
-- pero para este caso de uso simple de familiares funciona bien.
CREATE POLICY "Permitir inserción pública de donaciones" 
ON donaciones FOR INSERT 
WITH CHECK (true);
