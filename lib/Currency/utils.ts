export const currencyConvert = (amount: number) => {
    return Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumSignificantDigits: 2
    }).format(amount)
}