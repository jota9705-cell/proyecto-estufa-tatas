import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || 'placeholder-token',
});

export async function POST(request: Request) {
  try {
    const { id, title, amount, description } = await request.json();

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: id,
            title: title,
            quantity: 1,
            unit_price: amount,
            currency_id: 'CLP',
            description: description || 'Donación familiar',
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/?status=success`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/?status=pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
        external_reference: id, // El ID de la donación en Supabase
      },
    });

    return NextResponse.json({ url: result.init_point });
  } catch (error) {
    console.error('Error creating preference:', error);
    return NextResponse.json({ error: 'Error creating preference' }, { status: 500 });
  }
}
