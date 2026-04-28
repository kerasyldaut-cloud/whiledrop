import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageBase64, style } = body

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const { text } = await generateText({
      model: 'anthropic/claude-sonnet-4.6',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this outfit photo. The user's preferred style is "${style}".

Provide a brief analysis including:
1. What clothing items are visible
2. The overall style/aesthetic of the current outfit
3. What works well
4. Suggestions for improvement or complementary pieces

Keep the response concise (2-3 sentences max) and focus on actionable insights.`,
            },
            {
              type: 'image',
              image: imageBase64,
            },
          ],
        },
      ],
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error('Photo analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze photo' },
      { status: 500 }
    )
  }
}
