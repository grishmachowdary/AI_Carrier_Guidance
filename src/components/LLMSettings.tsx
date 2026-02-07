import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Zap, 
  DollarSign, 
  Shield,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink
} from 'lucide-react'
import LLMService, { type LLMConfig } from '@/services/llmService'

export function LLMSettings() {
  const [config, setConfig] = useState<LLMConfig>(LLMService.getConfig())
  const [showApiKey, setShowApiKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleToggleEnabled = () => {
    const newConfig = { ...config, enabled: !config.enabled }
    setConfig(newConfig)
    LLMService.configure(newConfig)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleProviderChange = (provider: 'openai' | 'anthropic' | 'mock') => {
    const newConfig = { ...config, provider }
    setConfig(newConfig)
    LLMService.configure(newConfig)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleApiKeyChange = (apiKey: string) => {
    const newConfig = { ...config, apiKey }
    setConfig(newConfig)
  }

  const handleSaveApiKey = () => {
    LLMService.configure(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleModelChange = (model: string) => {
    const newConfig = { ...config, model }
    setConfig(newConfig)
    LLMService.configure(newConfig)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const isConfigured = config.provider === 'mock' || !!config.apiKey

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl">
              <Settings className="w-6 h-6 mr-2 text-blue-600" />
              LLM Fallback Settings
              <Badge className="ml-3 bg-purple-100 text-purple-800">
                Optional Enhancement
              </Badge>
            </CardTitle>
            <CardDescription className="mt-2">
              Configure AI-powered responses for questions outside the knowledge base
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {saved && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Saved
              </Badge>
            )}
            <Button
              onClick={handleToggleEnabled}
              className={config.enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-500'}
            >
              {config.enabled ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Enabled
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Disabled
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Feature Overview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-gray-900">What is LLM Fallback?</p>
              <p>
                When your question isn't covered by the knowledge base, the system can optionally use a Large Language Model (LLM) 
                to generate responses. This provides comprehensive coverage while keeping costs low by only using LLM when necessary.
              </p>
              <div className="flex items-center space-x-4 mt-3 text-xs">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 text-yellow-600 mr-1" />
                  <span>Hybrid Approach</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                  <span>Cost-Effective</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-blue-600 mr-1" />
                  <span>Graceful Degradation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Select LLM Provider
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mock Provider */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                config.provider === 'mock'
                  ? 'bg-blue-50 border-blue-600 shadow-md'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleProviderChange('mock')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Mock (Demo)</h3>
                {config.provider === 'mock' && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Simulated LLM responses for demonstration
              </p>
              <Badge className="bg-green-100 text-green-800 text-xs">
                Free • No API Key
              </Badge>
            </div>

            {/* OpenAI Provider */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                config.provider === 'openai'
                  ? 'bg-blue-50 border-blue-600 shadow-md'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleProviderChange('openai')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">OpenAI</h3>
                {config.provider === 'openai' && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">
                GPT-4, GPT-3.5 Turbo
              </p>
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                API Key Required
              </Badge>
            </div>

            {/* Anthropic Provider */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                config.provider === 'anthropic'
                  ? 'bg-blue-50 border-blue-600 shadow-md'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleProviderChange('anthropic')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Anthropic</h3>
                {config.provider === 'anthropic' && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Claude 3 (Opus, Sonnet, Haiku)
              </p>
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                API Key Required
              </Badge>
            </div>
          </div>
        </div>

        {/* API Key Configuration */}
        {config.provider !== 'mock' && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              API Key
            </label>
            <div className="flex space-x-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={config.apiKey || ''}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder={`Enter your ${config.provider === 'openai' ? 'OpenAI' : 'Anthropic'} API key`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="outline"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? 'Hide' : 'Show'}
              </Button>
              <Button onClick={handleSaveApiKey}>
                Save
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
        )}

        {/* Model Selection */}
        {config.provider !== 'mock' && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Model
            </label>
            <select
              value={config.model || ''}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {config.provider === 'openai' ? (
                <>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Cheap)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo (Balanced)</option>
                  <option value="gpt-4">GPT-4 (Most Capable)</option>
                </>
              ) : (
                <>
                  <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fast & Cheap)</option>
                  <option value="claude-3-sonnet-20240229">Claude 3 Sonnet (Balanced)</option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus (Most Capable)</option>
                </>
              )}
            </select>
          </div>
        )}

        {/* Status */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Status</p>
              <p className="text-xs text-gray-600 mt-1">
                {config.enabled
                  ? isConfigured
                    ? 'LLM fallback is active and ready to use'
                    : 'LLM fallback is enabled but needs API key configuration'
                  : 'LLM fallback is disabled - using knowledge base only'}
              </p>
            </div>
            <div>
              {config.enabled && isConfigured ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
              ) : config.enabled ? (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Info className="w-3 h-3 mr-1" />
                  Needs Config
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">
                  <XCircle className="w-3 h-3 mr-1" />
                  Disabled
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Get API Keys */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Get API Keys</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">OpenAI Platform</p>
                <p className="text-xs text-gray-600">Get your API key</p>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-600" />
            </a>
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">Anthropic Console</p>
                <p className="text-xs text-gray-600">Get your API key</p>
              </div>
              <ExternalLink className="w-4 h-4 text-purple-600" />
            </a>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-gray-900 mb-1">Cost Optimization</p>
              <p className="text-xs">
                LLM fallback only activates when the knowledge base doesn't have an answer, keeping costs minimal. 
                Typical usage: ~$0.01-0.05 per conversation with GPT-3.5 or Claude Haiku.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
