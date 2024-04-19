export const sqlParameterize = (dict: Record<string, string>, prefix = '$') => {
    const sqlParams = Object.entries(dict).reduce((acc: Record<string, string>, [k, v]) => {
        acc[prefix + k] = v
        return acc
    }, {})
    return sqlParams
}

