import { NextResponse } from 'next/server'
import { supabase, connectToMongoDB } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { rating, feedback } = await request.json()

    const { data: supabaseData, error: supabaseError } = await supabase
      .from('feedback')
      .insert([
        { rating, feedback }
      ])

    if (supabaseError) throw supabaseError

    const mongoClient = await connectToMongoDB()
    const db = mongoClient.db('your_database_name')
    const { insertedId } = await db.collection('feedback').insertOne({
      rating,
      feedback,
      createdAt: new Date()
    })

    return NextResponse.json({ 
      success: true, 
      supabaseId: supabaseData?.[0],
      mongoId: insertedId 
    })

  } catch (error) {
    console.error('Error saving feedback:', error)
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    )
  }
} 