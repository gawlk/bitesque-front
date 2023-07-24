import {
  IconCurrency,
  IconCurrencyBahraini,
  IconCurrencyBaht,
  IconCurrencyDinar,
  IconCurrencyDirham,
  IconCurrencyDollar,
  IconCurrencyDollarAustralian,
  IconCurrencyDollarCanadian,
  IconCurrencyDollarSingapore,
  IconCurrencyEuro,
  IconCurrencyForint,
  IconCurrencyFrank,
  IconCurrencyKroneCzech,
  IconCurrencyKroneDanish,
  IconCurrencyKroneSwedish,
  IconCurrencyLira,
  IconCurrencyNaira,
  IconCurrencyPound,
  IconCurrencyReal,
  IconCurrencyRenminbi,
  IconCurrencyRiyal,
  IconCurrencyRubel,
  IconCurrencyRupee,
  IconCurrencyShekel,
  IconCurrencyTaka,
  IconCurrencyWon,
  IconCurrencyYen,
  IconCurrencyZloty,
} from '@tabler/icons-solidjs'

export const findCurrency = (symbol: string) =>
  currencies.find((currency) => currency.symbol === symbol) || currencies[0]

export const currencies = (
  [
    {
      symbol: 'AED',
      name: 'United Arab Emirates Dirham',
      icon: IconCurrencyDirham,
    },
    {
      symbol: 'ARS',
      name: 'Argentine Peso',
    },
    {
      symbol: 'AUD',
      name: 'Australian Dollar',
      icon: IconCurrencyDollarAustralian,
    },
    {
      symbol: 'BDT',
      name: 'Bangladeshi Taka',
      icon: IconCurrencyTaka,
    },
    {
      symbol: 'BHD',
      name: 'Bahraini Dinar',
      icon: IconCurrencyBahraini,
    },
    {
      symbol: 'BMD',
      name: 'Bermudian Dollar',
    },
    {
      symbol: 'BRL',
      name: 'Brazil Real',
      icon: IconCurrencyReal,
    },
    {
      symbol: 'CAD',
      name: 'Canadian Dollar',
      icon: IconCurrencyDollarCanadian,
    },
    {
      symbol: 'CHF',
      name: 'Swiss Franc',
      icon: IconCurrencyFrank,
    },
    {
      symbol: 'CLP',
      name: 'Chilean Peso',
    },
    {
      symbol: 'CNY',
      name: 'Chinese Yuan',
      icon: IconCurrencyRenminbi,
    },
    {
      symbol: 'CZK',
      name: 'Czech Koruna',
      icon: IconCurrencyKroneCzech,
    },
    {
      symbol: 'DKK',
      name: 'Danish Krone',
      icon: IconCurrencyKroneDanish,
    },
    {
      symbol: 'EUR',
      name: 'Euro',
      icon: IconCurrencyEuro,
    },
    {
      symbol: 'GBP',
      name: 'British Pound Sterling',
      icon: IconCurrencyPound,
    },
    {
      symbol: 'HKD',
      name: 'Hong Kong Dollar',
    },
    {
      symbol: 'HUF',
      name: 'Hungarian Forint',
      icon: IconCurrencyForint,
    },
    {
      symbol: 'IDR',
      name: 'Indonesian Rupiah',
    },
    {
      symbol: 'ILS',
      name: 'Israeli New Shekel',
      icon: IconCurrencyShekel,
    },
    {
      symbol: 'INR',
      name: 'Indian Rupee',
      icon: IconCurrencyRupee,
    },
    {
      symbol: 'JPY',
      name: 'Japanese Yen',
      icon: IconCurrencyYen,
    },
    {
      symbol: 'KRW',
      name: 'South Korean Won',
      icon: IconCurrencyWon,
    },
    {
      symbol: 'KWD',
      name: 'Kuwaiti Dinar',
      icon: IconCurrencyDinar,
    },
    {
      symbol: 'LKR',
      name: 'Sri Lankan Rupee',
    },
    {
      symbol: 'MMK',
      name: 'Burmese Kyat',
    },
    {
      symbol: 'MXN',
      name: 'Mexican Peso',
    },
    {
      symbol: 'MYR',
      name: 'Malaysian Ringgit',
    },
    {
      symbol: 'NGN',
      name: 'Nigerian Naira',
      icon: IconCurrencyNaira,
    },
    {
      symbol: 'NOK',
      name: 'Norwegian Krone',
      icon: IconCurrencyKroneSwedish,
    },
    {
      symbol: 'NZD',
      name: 'New Zealand Dollar',
    },
    {
      symbol: 'PHP',
      name: 'Philippine Peso',
    },
    {
      symbol: 'PKR',
      name: 'Pakistani Rupee',
    },
    {
      symbol: 'PLN',
      name: 'Polish Zloty',
      icon: IconCurrencyZloty,
    },
    {
      symbol: 'RUB',
      name: 'Russian Ruble',
      icon: IconCurrencyRubel,
    },
    {
      symbol: 'SAR',
      name: 'Saudi Riyal',
      icon: IconCurrencyRiyal,
    },
    {
      symbol: 'SEK',
      name: 'Swedish Krona',
    },
    {
      symbol: 'SGD',
      name: 'Singapore Dollar',
      icon: IconCurrencyDollarSingapore,
    },
    {
      symbol: 'THB',
      name: 'Thai Baht',
      icon: IconCurrencyBaht,
    },
    {
      symbol: 'TRY',
      name: 'Turkish Lira',
      icon: IconCurrencyLira,
    },
    {
      symbol: 'TWD',
      name: 'New Taiwan Dollar',
    },
    {
      symbol: 'UAH',
      name: 'Ukrainian hryvnia',
    },
    {
      symbol: 'USD',
      name: 'US Dollar',
      icon: IconCurrencyDollar,
    },
    {
      symbol: 'VEF',
      name: 'Venezuelan bolívar fuerte',
    },
    {
      symbol: 'VND',
      name: 'Vietnamese đồng',
    },
    {
      symbol: 'ZAR',
      name: 'South African Rand',
    },
    {
      symbol: 'XDR',
      name: 'IMF Special Drawing Rights',
    },
  ] as RawCurrency[]
).map(
  (currency): Currency => ({
    icon: IconCurrency,
    ...currency,
  })
)
