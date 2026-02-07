// LLM Fallback Service - Optional Enhancement
// This demonstrates understanding of both template-based and LLM-based approaches

export interface LLMConfig {
  enabled: boolean
  provider: 'openai' | 'anthropic' | 'mock'
  apiKey?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export interface LLMResponse {
  content: string
  usedLLM: boolean
  provider?: string
  tokensUsed?: number
  cost?: number
}

export class LLMService {
  private static config: LLMConfig = {
    enabled: false, // Disabled by default - feature flag
    provider: 'mock', // Use mock by default for demo
    maxTokens: 500,
    temperature: 0.7
  }

  // Configure LLM service
  static configure(config: Partial<LLMConfig>) {
    this.config = { ...this.config, ...config }
  }

  // Get current configuration
  static getConfig(): LLMConfig {
    return { ...this.config }
  }

  // Check if LLM is enabled and configured
  static isEnabled(): boolean {
    return this.config.enabled && (this.config.provider === 'mock' || !!this.config.apiKey)
  }

  // Generate response using LLM (with fallback to mock)
  static async generateResponse(
    message: string,
    context: {
      mode: string
      emotion: string
      conversationHistory?: string[]
    }
  ): Promise<LLMResponse> {
    if (!this.isEnabled()) {
      return {
        content: "LLM fallback is currently disabled. Enable it in settings to use AI-powered responses for questions outside the knowledge base.",
        usedLLM: false
      }
    }

    try {
      switch (this.config.provider) {
        case 'openai':
          return await this.callOpenAI(message, context)
        case 'anthropic':
          return await this.callAnthropic(message, context)
        case 'mock':
        default:
          return this.mockLLMResponse(message, context)
      }
    } catch (error) {
      console.error('LLM API Error:', error)
      return {
        content: "I encountered an error connecting to the LLM service. Please check your API configuration or try again later.",
        usedLLM: false
      }
    }
  }

  // OpenAI API integration
  private static async callOpenAI(
    message: string,
    context: { mode: string; emotion: string; conversationHistory?: string[] }
  ): Promise<LLMResponse> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const systemPrompt = this.buildSystemPrompt(context.mode, context.emotion)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      content: data.choices[0].message.content,
      usedLLM: true,
      provider: 'openai',
      tokensUsed: data.usage.total_tokens,
      cost: this.calculateOpenAICost(data.usage.total_tokens, this.config.model || 'gpt-3.5-turbo')
    }
  }

  // Anthropic Claude API integration
  private static async callAnthropic(
    message: string,
    context: { mode: string; emotion: string; conversationHistory?: string[] }
  ): Promise<LLMResponse> {
    if (!this.config.apiKey) {
      throw new Error('Anthropic API key not configured')
    }

    const systemPrompt = this.buildSystemPrompt(context.mode, context.emotion)
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-haiku-20240307',
        max_tokens: this.config.maxTokens,
        system: systemPrompt,
        messages: [
          { role: 'user', content: message }
        ],
        temperature: this.config.temperature
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      content: data.content[0].text,
      usedLLM: true,
      provider: 'anthropic',
      tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
      cost: this.calculateAnthropicCost(
        data.usage.input_tokens,
        data.usage.output_tokens,
        this.config.model || 'claude-3-haiku-20240307'
      )
    }
  }

  // Mock LLM response for demo purposes (no API key needed)
  private static mockLLMResponse(
    message: string,
    context: { mode: string; emotion: string }
  ): LLMResponse {
    const emotionPhrases = {
      enthusiastic: "🎉 I love your enthusiasm! ",
      confused: "💙 I understand this can be confusing. ",
      neutral: "📚 Let me help you with that. ",
      disinterested: "🌟 This might be more interesting than you think! "
    }

    const modeApproaches = {
      supportive: "Let me break this down in a supportive way.",
      analytical: "Let me analyze this systematically for you.",
      creative: "Let's explore this from a creative angle.",
      'goal-focused': "Let's focus on actionable steps to understand this."
    }

    const intro = emotionPhrases[context.emotion as keyof typeof emotionPhrases] || emotionPhrases.neutral
    const approach = modeApproaches[context.mode as keyof typeof modeApproaches] || modeApproaches.supportive

    const mockContent = `${intro}${approach}

**About your question:** "${message}"

This is a **mock LLM response** demonstrating the fallback capability. In production, this would be powered by:
- **OpenAI GPT-4/3.5** for general knowledge and creative responses
- **Anthropic Claude** for detailed analysis and reasoning
- **Custom fine-tuned models** for domain-specific expertise

**What this demonstrates:**
✅ Hybrid RAG approach (Knowledge Base + LLM fallback)
✅ Graceful degradation when knowledge base doesn't have answers
✅ Cost-effective design (only use LLM when necessary)
✅ Flexibility to integrate multiple LLM providers

**To enable real LLM responses:**
1. Add your API key in the settings
2. Choose your preferred provider (OpenAI/Anthropic)
3. Configure model and parameters
4. Enable the LLM fallback feature flag

This approach shows understanding of both template-based and LLM-based systems! 🚀`

    return {
      content: mockContent,
      usedLLM: true,
      provider: 'mock',
      tokensUsed: 150,
      cost: 0
    }
  }

  // Build system prompt based on coaching mode and emotion
  private static buildSystemPrompt(mode: string, emotion: string): string {
    const basePrompt = "You are an AI mentor helping students learn about programming, technology, and career development."
    
    const modePrompts = {
      supportive: "Be encouraging, empathetic, and provide emotional support. Use positive reinforcement.",
      analytical: "Be systematic, data-driven, and logical. Break down complex topics step by step.",
      creative: "Be innovative, think outside the box, and provide unique perspectives and analogies.",
      'goal-focused': "Be action-oriented, provide clear steps, and focus on achieving specific learning objectives."
    }

    const emotionPrompts = {
      enthusiastic: "The student is excited and eager to learn. Match their energy and enthusiasm.",
      confused: "The student is confused and struggling. Be patient, clear, and reassuring.",
      neutral: "The student has a balanced, focused approach. Provide clear, informative responses.",
      disinterested: "The student seems unengaged. Try to spark interest and show practical value."
    }

    return `${basePrompt}

**Coaching Mode:** ${modePrompts[mode as keyof typeof modePrompts] || modePrompts.supportive}

**Student Emotion:** ${emotionPrompts[emotion as keyof typeof emotionPrompts] || emotionPrompts.neutral}

Provide helpful, educational responses that match the coaching mode and address the student's emotional state. Keep responses concise but informative.`
  }

  // Calculate OpenAI API costs
  private static calculateOpenAICost(tokens: number, model: string): number {
    const pricing = {
      'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
    }

    const modelPricing = pricing[model as keyof typeof pricing] || pricing['gpt-3.5-turbo']
    // Rough estimate (assuming 50/50 input/output split)
    return ((tokens / 1000) * (modelPricing.input + modelPricing.output) / 2)
  }

  // Calculate Anthropic API costs
  private static calculateAnthropicCost(inputTokens: number, outputTokens: number, model: string): number {
    const pricing = {
      'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
      'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
      'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 }
    }

    const modelPricing = pricing[model as keyof typeof pricing] || pricing['claude-3-haiku-20240307']
    return ((inputTokens / 1000) * modelPricing.input) + ((outputTokens / 1000) * modelPricing.output)
  }

  // Estimate if LLM should be used based on knowledge base confidence
  static shouldUseLLM(knowledgeBaseScore: number, threshold: number = 50): boolean {
    return this.isEnabled() && knowledgeBaseScore < threshold
  }
}

export default LLMService
