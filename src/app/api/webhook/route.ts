import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || 'placeholder-token',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Webhook received:', body);
    const { action, type, data } = body;

    // Mercado Pago envía 'payment' como type y 'payment.created' o 'payment.updated' como action
    if (type === 'payment' || action === 'payment.created' || action === 'payment.updated') {
      const paymentId = data?.id || body.data?.id;
      
      if (!paymentId) {
        console.error('No payment ID found in webhook body');
        return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
      }

      const payment = new Payment(client);
      const paymentDetails = await payment.get({ id: paymentId });

      console.log('Payment status:', paymentDetails.status);
      console.log('External reference:', paymentDetails.external_reference);

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
          console.log('Donation approved successfully in Supabase');
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
