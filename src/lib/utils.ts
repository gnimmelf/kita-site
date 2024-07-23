



const defaultDatetimeOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",    
  }

export const datetimeStr = (date: Date, options={}): string => {
    options = Object.assign({}, defaultDatetimeOptions, options);

    return new Intl.DateTimeFormat('no', options).format(date)
}

export const isDev = !!(process.env.NODE_ENV || '').startsWith('dev')

export const makeSecretPhrase = () => isDev ? 'Simple and same as always' : crypto.randomUUID()

