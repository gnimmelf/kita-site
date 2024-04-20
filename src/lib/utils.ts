export const sqlParameterize = (dict: Record<string, string>, prefix = '$') => {
    const sqlParams = Object.entries(dict).reduce((acc: Record<string, string>, [k, v]) => {
        acc[prefix + k] = v
        return acc
    }, {})
    return sqlParams
}

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

export const isDev = !!process.env.NODE_ENV

export const makeSecretPhrase = () => isDev ? 'Simple and same as always' : crypto.randomUUID()

