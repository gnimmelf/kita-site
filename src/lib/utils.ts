/**
 * Returns a string of comma separated fieldnames to match the passed parameters, 
 * e.g "title = $title, content = $content"
 * @param dict the data Object of type Record<key, value>
 * @param prefix the key-prefix
 * @returns 
 */
export const sqlQueryFieldsString = (dict: Record<string, any>, paramPrefix = '$') => {
    const sqlFields = Object.keys(dict).map((k: string) => `${k} = ${paramPrefix}${k}`)    
    return sqlFields.join(', ')
}

/**
 * Returns a sqlite3 parameters dict of <key, value>
 * @param dict the data Object of type Record<key, value>
 * @param prefix the key-prefix
 * @returns 
 */
export const sqlQueryParams = (dict: Record<string, any>, paramPrefix = '$') => {
    const sqlParams = Object.entries(dict).reduce((acc: Record<string, any>, [k, v]) => {
        acc[paramPrefix + k] = v
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

