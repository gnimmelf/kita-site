function getArticleData() {
    const adminEl = document.getElementsByTagName('editor-app')[0]
    const res = adminEl.getArticleState({ html: true })
    const data = {
        title: res.title,
        slug: res.slug,
        content: res.content.html
    }
    console.log({ article: data })
    return data
}


htmx.defineExtension('saveArticle', {
    /* 
    Abuse `defineExtension` to get and save article data.
    Use in theme as `hx-ext="saveArticle"`
    */
    onEvent: function (name, evt) {
        if (name === "htmx:configRequest") {
            evt.detail.headers['Content-Type'] = "application/json"
        }
    },
    encodeParameters: function (xhr) {
        xhr.overrideMimeType('text/json')
        // Get the article data from custom-element
        return (JSON.stringify(getArticleData()))
    }
})
