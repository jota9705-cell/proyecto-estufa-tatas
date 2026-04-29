import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || 'placeholder-token',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Solo nos interesan las notificaciones de pagos
    if (type === 'payment') {
      const paymentId = data.id;
      
      const payment = new Payment(client);
      const paymentDetails = await payment.get({ id: paymentId });

      if (paymentDetails.status === 'approved') {
        const donationId = paymentDetails.external_reference;

        if (donationId) {
          const { error } = await supabase
            .from('donaciones')
            .update({ estado: 'aprobado' })
            .eq('id', donationId);

          if (error) {
            console.error('Error updating supabase:', error);
            return NextResponse.json({ error: 'Error updating database' }, { status: 500 });
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
