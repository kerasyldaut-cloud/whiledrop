import { generateText, Output } from 'ai'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const outfitItemSchema = z.object({
  type: z.string(),
  name: z.string(),
  brand: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  productUrl: z.string(),
})

const outfitSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(outfitItemSchema),
  totalCost: z.number(),
})

const outputSchema = z.object({
  outfits: z.array(outfitSchema),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { profile, weather, photoAnalysis } = body

    console.log('[v0] Generate outfits request:', { profile, weather: !!weather, photoAnalysis: !!photoAnalysis })

    const styleDescriptions: Record<string, string> = {
      'old-money': 'Old Money aesthetic - quiet luxury, understated elegance, classic pieces from Loro Piana, Brunello Cucinelli, Ralph Lauren, Tod\'s. Neutral tones, cashmere, fine wool.',
      'grunge': 'Grunge style - oversized flannels, band tees, ripped jeans, combat boots from Acne Studios, AllSaints, Dr. Martens.',
      'drill': 'UK Drill style - puffer jackets, tracksuits from Moncler, Trapstar, Corteiz, Nike, Stone Island.',
      'sport': 'Sporty athletic style - technical fabrics, matching sets from Nike, Adidas, Lululemon.',
      'casual': 'Casual everyday style - basics from Carhartt WIP, Uniqlo, Levi\'s, New Balance.',
      'opium': 'Opium avant-garde style - dark experimental pieces from Rick Owens, Balenciaga, Comme des Garçons.',
    }

    const styleContext = styleDescriptions[profile.style] || styleDescriptions['casual']
    
    let weatherContext = ''
    if (weather) {
      weatherContext = `Weather: ${weather.temperature}°C, ${weather.description}.`
    }

    const prompt = `Generate 3 outfit recommendations as JSON.

Profile: ${profile.gender}, age ${profile.age}, budget $${profile.budget}
Style: ${styleContext}
${weatherContext}

Return JSON with this exact structure:
{
  "outfits": [
    {
      "id": "1",
      "name": "Outfit Name",
      "items": [
        {
          "type": "Top",
          "name": "Product Name",
          "brand": "Brand",
          "price": 99,
          "imageUrl": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
          "productUrl": "https://www.zara.com"
        }
      ],
      "totalCost": 299
    }
  ]
}

Requirements:
- Exactly 3 outfits
- 3-5 items per outfit
- Stay within $${profile.budget} budget per outfit
- Use real brand names and realistic prices
- Use Unsplash image URLs for images
- Use real brand website URLs`

    console.log('[v0] Calling AI model...')

    const { output } = await generateText({
      model: 'anthropic/claude-sonnet-4.6',
      output: Output.object({
        schema: outputSchema,
      }),
      prompt,
    })

    console.log('[v0] AI response received:', output)

    if (!output || !output.outfits) {
      throw new Error('Invalid AI response structure')
    }

    return NextResponse.json(output)
  } catch (error) {
    console.error('[v0] AI generation error:', error)
    
    // Return fallback mock data so the app still works
    const fallbackOutfits = {
      outfits: [
        {
          id: '1',
          name: 'Classic Casual',
          items: [
            { type: 'Top', name: 'Oxford Shirt', brand: 'Uniqlo', price: 39, imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop', productUrl: 'https://www.uniqlo.com' },
            { type: 'Pants', name: '501 Original Jeans', brand: "Levi's", price: 89, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop', productUrl: 'https://www.levi.com' },
            { type: 'Shoes', name: '550 Sneakers', brand: 'New Balance', price: 110, imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=500&fit=crop', productUrl: 'https://www.newbalance.com' },
          ],
          totalCost: 238,
        },
        {
          id: '2',
          name: 'Street Essential',
          items: [
            { type: 'Jacket', name: 'Coach Jacket', brand: 'Carhartt WIP', price: 159, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop', productUrl: 'https://www.carhartt-wip.com' },
            { type: 'Top', name: 'Basic Tee', brand: 'Zara', price: 25, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', productUrl: 'https://www.zara.com' },
            { type: 'Pants', name: 'Cargo Pants', brand: 'Bershka', price: 49, imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop', productUrl: 'https://www.bershka.com' },
            { type: 'Shoes', name: 'Air Force 1', brand: 'Nike', price: 110, imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=500&fit=crop', productUrl: 'https://www.nike.com' },
          ],
          totalCost: 343,
        },
        {
          id: '3',
          name: 'Minimal Luxe',
          items: [
            { type: 'Sweater', name: 'Cashmere Crew', brand: 'COS', price: 175, imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop', productUrl: 'https://www.cos.com' },
            { type: 'Pants', name: 'Tailored Trousers', brand: 'Massimo Dutti', price: 89, imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop', productUrl: 'https://www.massimodutti.com' },
            { type: 'Shoes', name: 'Leather Loafers', brand: 'Mango', price: 79, imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=500&fit=crop', productUrl: 'https://www.mango.com' },
          ],
          totalCost: 343,
        },
      ],
    }
    
    return NextResponse.json(fallbackOutfits)
  }
}
