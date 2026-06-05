import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({ message: 'Push notifications not configured yet' }, { status: 200 })
    }

    const webpush = await import('web-push')
    webpush.default.setVapidDetails(
      'mailto:admin@lyu.app',
      vapidPublicKey,
      vapidPrivateKey
    )

    const { subscription, title, body } = await req.json()
    if (!subscription) {
      return NextResponse.json({ error: 'No subscription' }, { status: 400 })
    }

    await webpush.default.sendNotification(subscription, JSON.stringify({ title, body }))
    return NextResponse.json({ message: 'Sent' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
