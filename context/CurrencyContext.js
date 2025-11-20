import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('EUR');

  // Charger la devise depuis le localStorage au démarrage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency && (savedCurrency === 'EUR' || savedCurrency === 'USD')) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Sauvegarder la devise dans le localStorage quand elle change
  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  // Formater un prix selon la devise
  const formatPrice = (price) => {
    if (currency === 'EUR') {
      return `${price.toFixed(2)}€`;
    } else {
      // Conversion EUR → USD (taux approximatif: 1 EUR = 1.10 USD)
      const priceInUSD = price * 1.10;
      return `$${priceInUSD.toFixed(2)}`;
    }
  };

  // Obtenir le symbole de la devise
  const getCurrencySymbol = () => {
    return currency === 'EUR' ? '€' : '$';
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice, getCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
