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

export const isDev = !!(process.env.NODE_ENV || '').startsWith('dev')

export const makeSecretPhrase = () => isDev ? 'Simple and same as always' : crypto.randomUUID()

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