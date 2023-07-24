interface RawCurrency {
  symbol: string
  name: string
  icon?: (...args: any[]) => SolidJS.JSXElement
}

interface Currency extends RawCurrency {
  icon: (...args: any[]) => SolidJS.JSXElement
}
