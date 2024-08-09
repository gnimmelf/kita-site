import { Article } from "../types";


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

export const isDev = (substring?: string) => {
  const env = process.env.NODE_ENV
  let isDev = !!(env || '').startsWith('dev')

  if (isDev && substring) {
    // Check if we need to match on substring
    isDev = !!env?.includes(substring)
  }
  
  return isDev
} 

export const makeSecretPhrase = () => isDev() ? 'Simple and same as always' : crypto.randomUUID()

export const ensureArticle = (id: string, data: Article|undefined): Article => {
  const template = {
    id: '<404>',
    meta: {
      intro: `<span>[404 - ${id}]</span>`
    },
    body:`<span>[404 - ${id}]</span>`
  }
  return {
    ...template,
    ...data
  }
}

