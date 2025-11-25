import { useState, useEffect } from 'react';

/**
 * Composant de calcul de prix avec taxes
 *
 * Taxes:
 * - SumUp: 2.5% du prix TTC
 * - Plateforme: 10% du prix TTC
 * Total taxes: 12.5%
 *
 * Modes:
 * - TTC: L'utilisateur entre le prix que paiera le client
 * - NET: L'utilisateur entre le prix qu'il veut recevoir
 */
export default function PriceCalculator({ value, onChange, mode: initialMode = 'ttc' }) {
  const [mode, setMode] = useState(initialMode); // 'ttc' ou 'net'
  const [enteredPrice, setEnteredPrice] = useState(value || '');

  const SUMUP_FEE_RATE = 0.025; // 2.5%
  const PLATFORM_FEE_RATE = 0.10; // 10%
  const TOTAL_FEE_RATE = SUMUP_FEE_RATE + PLATFORM_FEE_RATE; // 12.5%

  useEffect(() => {
    if (value !== enteredPrice) {
      setEnteredPrice(value || '');
    }
  }, [value]);

  const calculatePrices = (price, priceMode) => {
    const amount = parseFloat(price) || 0;

    if (priceMode === 'ttc') {
      // L'utilisateur entre le prix TTC (ce que paie le client)
      const priceTTC = amount;
      const sumupFee = priceTTC * SUMUP_FEE_RATE;
      const platformFee = priceTTC * PLATFORM_FEE_RATE;
      const priceNet = priceTTC - sumupFee - platformFee;

      return {
        priceTTC: priceTTC.toFixed(2),
        priceNet: priceNet.toFixed(2),
        sumupFee: sumupFee.toFixed(2),
        platformFee: platformFee.toFixed(2),
        totalFees: (sumupFee + platformFee).toFixed(2),
      };
    } else {
      // L'utilisateur entre le prix NET (ce qu'il veut recevoir)
      const priceNet = amount;
      // Formule: priceTTC = priceNet / (1 - TOTAL_FEE_RATE)
      const priceTTC = priceNet / (1 - TOTAL_FEE_RATE);
      const sumupFee = priceTTC * SUMUP_FEE_RATE;
      const platformFee = priceTTC * PLATFORM_FEE_RATE;

      return {
        priceTTC: priceTTC.toFixed(2),
        priceNet: priceNet.toFixed(2),
        sumupFee: sumupFee.toFixed(2),
        platformFee: platformFee.toFixed(2),
        totalFees: (sumupFee + platformFee).toFixed(2),
      };
    }
  };

  const prices = calculatePrices(enteredPrice, mode);

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setEnteredPrice(newPrice);

    const calculated = calculatePrices(newPrice, mode);
    onChange({
      priceMode: mode,
      priceEntered: parseFloat(newPrice) || 0,
      priceTTC: parseFloat(calculated.priceTTC),
      priceNet: parseFloat(calculated.priceNet),
      sumupFee: parseFloat(calculated.sumupFee),
      platformFee: parseFloat(calculated.platformFee),
    });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);

    const calculated = calculatePrices(enteredPrice, newMode);
    onChange({
      priceMode: newMode,
      priceEntered: parseFloat(enteredPrice) || 0,
      priceTTC: parseFloat(calculated.priceTTC),
      priceNet: parseFloat(calculated.priceNet),
      sumupFee: parseFloat(calculated.sumupFee),
      platformFee: parseFloat(calculated.platformFee),
    });
  };

  return (
    <div className="space-y-4">
      {/* Sélecteur de mode */}
      <div>
        <label className="block text-sm font-semibold mb-2">Mode de calcul *</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleModeChange('ttc')}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              mode === 'ttc'
                ? 'border-purple bg-purple bg-opacity-10 text-purple font-semibold'
                : 'border-line hover:border-purple hover:border-opacity-30'
            }`}
          >
            <div className="text-left">
              <p className="font-semibold mb-1">Prix TTC</p>
              <p className="text-xs text-secondary">Ce que paie le client</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('net')}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              mode === 'net'
                ? 'border-green bg-green bg-opacity-10 text-green font-semibold'
                : 'border-line hover:border-green hover:border-opacity-30'
            }`}
          >
            <div className="text-left">
              <p className="font-semibold mb-1">Prix NET</p>
              <p className="text-xs text-secondary">Ce que vous recevez</p>
            </div>
          </button>
        </div>
      </div>

      {/* Champ de saisie du prix */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          {mode === 'ttc' ? 'Prix TTC (€) *' : 'Prix NET souhaité (€) *'}
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            value={enteredPrice}
            onChange={handlePriceChange}
            className="w-full px-4 py-3 pr-12 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder={mode === 'ttc' ? 'Ex: 99.99' : 'Ex: 85.00'}
            required
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-semibold">
            €
          </span>
        </div>
        <p className="text-xs text-secondary mt-1">
          {mode === 'ttc'
            ? 'Montant total que paiera le client'
            : 'Montant net que vous recevrez après taxes'}
        </p>
      </div>

      {/* Aperçu des calculs */}
      {enteredPrice && parseFloat(enteredPrice) > 0 && (
        <div className="p-4 bg-surface rounded-xl border border-line">
          <h4 className="text-sm font-semibold mb-3 flex items-center">
            <i className="ph-bold ph-calculator text-purple mr-2"></i>
            Détail des montants
          </h4>

          <div className="space-y-2 text-sm">
            {/* Prix client */}
            <div className="flex justify-between items-center py-2 border-b border-line">
              <span className="text-secondary">Prix client (TTC)</span>
              <span className="font-bold text-lg">{prices.priceTTC} €</span>
            </div>

            {/* Détail des frais */}
            <div className="space-y-1 py-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary">
                  <i className="ph ph-minus-circle text-red mr-1"></i>
                  Frais SumUp (2.5%)
                </span>
                <span className="text-red">- {prices.sumupFee} €</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary">
                  <i className="ph ph-minus-circle text-red mr-1"></i>
                  Frais plateforme (10%)
                </span>
                <span className="text-red">- {prices.platformFee} €</span>
              </div>
            </div>

            {/* Prix net */}
            <div className="flex justify-between items-center py-2 border-t-2 border-green bg-green bg-opacity-5 rounded px-2 -mx-2">
              <span className="font-semibold text-green flex items-center">
                <i className="ph-bold ph-wallet text-xl mr-2"></i>
                Vous recevez (NET)
              </span>
              <span className="font-bold text-xl text-green">{prices.priceNet} €</span>
            </div>
          </div>

          <p className="text-xs text-secondary mt-3 flex items-start">
            <i className="ph-bold ph-info mr-1 mt-0.5"></i>
            <span>
              Les frais totaux représentent 12.5% du prix TTC (2.5% SumUp + 10% plateforme)
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
