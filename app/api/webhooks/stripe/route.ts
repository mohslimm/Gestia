import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize a Supabase client with the service role key to bypass RLS during webhooks
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback for MVP
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  // Placeholder pour la logique Stripe officielle
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // let event;
  // try {
  //   event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  // } catch (err) { ... }

  try {
    // Parsing the JSON body since we don't have true stripe lib imported in this MVP boilerplate yet
    const event = JSON.parse(body);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // STUB: Retrieve user id from client_reference_id or session metadata
        const userId = session.client_reference_id;
        const subscriptionId = session.subscription;
        const customerId = session.customer;
        
        // Find which plan based on price ID
        let planLabel = 'pro'; 
        // if (session.line_items... == 'price_XXX') planLabel = 'investor';

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan: planLabel
            })
            .eq('id', userId);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await supabaseAdmin
          .from('profiles')
          .update({
            plan: 'starter'
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
}
