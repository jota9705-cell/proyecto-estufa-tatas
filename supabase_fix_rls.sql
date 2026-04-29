-- 1. Primero eliminamos la política que está dando problemas
DROP POLICY IF EXISTS "Permitir inserción pública de donaciones" ON donaciones;

-- 2. Creamos una política más clara para permitir inserciones desde la web
CREATE POLICY "Permitir inserción pública de donaciones"
ON donaciones
FOR INSERT
TO public
WITH CHECK (true);

-- 3. (Opcional pero recomendado) Asegurémonos de que la lectura sea pública para todos los estados durante las pruebas
-- Si prefieres solo aprobados, deja la anterior. Aquí la hacemos más permisiva para debuguear:
DROP POLICY IF EXISTS "Permitir lectura pública de donaciones aprobadas" ON donaciones;
CREATE POLICY "Permitir lectura pública de donaciones" 
ON donaciones FOR SELECT 
TO public
USING (true);
