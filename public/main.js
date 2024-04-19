function getArticleData() {
    const adminEl = document.getElementsByTagName('editor-app')[0]
    const data = adminEl.getArticleState({ html: true })
    console.log({ article: data })
    return data 
}

