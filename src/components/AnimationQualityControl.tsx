import { useState, useEffect } from 'react';
import { useDevicePerformance } from '../hooks/use-device-performance';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { AnimationLevel } from '../stores/userSettingsStore';

interface AnimationQualityControlProps {
  className?: string;
}

export const AnimationQualityControl = ({ className = '' }: AnimationQualityControlProps) => {
  const devicePerformance = useDevicePerformance();
  const { animationLevel, setAnimationLevel, shouldReduceMotion, reducedMotion, setReducedMotion } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Show recommendation if user's setting doesn't match device capability
  useEffect(() => {
    const shouldShow = (
      (devicePerformance.tier === 'low' && animationLevel === 'full') ||
      (devicePerformance.tier === 'high' && animationLevel === 'none')
    );
    setShowRecommendation(shouldShow);
  }, [devicePerformance.tier, animationLevel]);

  const getQualityLabel = (level: string) => {
    switch (level) {
      case 'none': return 'Desabilitadas';
      case 'minimal': return 'Mínimas';
      case 'reduced': return 'Reduzidas';
      case 'full': return 'Completas';
      default: return 'Automático';
    }
  };

  const getRecommendedSetting = (): AnimationLevel => {
    switch (devicePerformance.tier) {
      case 'low': return 'none';
      case 'medium': return 'reduced';
      case 'high': return 'full';
      default: return 'reduced';
    }
  };

  const applyRecommendedSetting = () => {
    const recommended = getRecommendedSetting();
    setAnimationLevel(recommended);
    setShowRecommendation(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Control Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg border border-gray-600 transition-colors"
        aria-label="Controles de qualidade de animação"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-medium">Animações</span>
        <span className="text-xs text-gray-400">{getQualityLabel(animationLevel)}</span>
        {showRecommendation && (
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        )}
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Qualidade das Animações</h3>
            
            {/* Device Performance Info */}
            <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-300">Dispositivo:</span>
                <span className={`text-xs font-medium ${
                  devicePerformance.tier === 'high' ? 'text-green-400' :
                  devicePerformance.tier === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {devicePerformance.tier === 'high' ? 'Alto Desempenho' :
                   devicePerformance.tier === 'medium' ? 'Médio Desempenho' : 'Baixo Desempenho'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">FPS Atual:</span>
                <span className="text-xs font-medium text-blue-400">
                  {Math.round(60)} fps
                </span>
              </div>
            </div>

            {/* Recommendation Banner */}
            {showRecommendation && (
              <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs text-yellow-200 mb-2">
                      Recomendamos <strong>{getQualityLabel(getRecommendedSetting())}</strong> para melhor performance no seu dispositivo.
                    </p>
                    <button
                      onClick={applyRecommendedSetting}
                      className="text-xs bg-yellow-600 hover:bg-yellow-500 px-2 py-1 rounded transition-colors"
                    >
                      Aplicar Recomendação
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reduce Motion Toggle */}
            <div className="mb-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Reduzir movimento</span>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    reducedMotion ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <p className="text-xs text-gray-400 mt-1">
                Respeita a preferência do sistema para movimento reduzido
              </p>
            </div>

            {/* Animation Level Selector */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Nível de animação:</label>
              <div className="space-y-1">
                {[
                  { value: 'none' as AnimationLevel, label: 'Desabilitadas', desc: 'Sem animações' },
                  { value: 'reduced' as AnimationLevel, label: 'Reduzidas', desc: 'Animações essenciais' },
                  { value: 'full' as AnimationLevel, label: 'Completas', desc: 'Todas as animações' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="animationLevel"
                      value={option.value}
                      checked={animationLevel === option.value}
                      onChange={(e) => setAnimationLevel(e.target.value as AnimationLevel)}
                      className="text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-white">{option.label}</div>
                      <div className="text-xs text-gray-400">{option.desc}</div>
                    </div>
                    {getRecommendedSetting() === option.value && (
                      <span className="text-xs bg-green-600 px-2 py-0.5 rounded text-white">
                        Recomendado
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Performance Impact Info */}
            <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
              <h4 className="text-xs font-medium text-gray-300 mb-2">Impacto na Performance:</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <div>• <strong>Desabilitadas:</strong> Máxima performance</div>
                <div>• <strong>Reduzidas:</strong> Performance média</div>
                <div>• <strong>Completas:</strong> Pode impactar performance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AnimationQualityControl;