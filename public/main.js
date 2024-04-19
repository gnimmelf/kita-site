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
  onEvent: function (name, evt) {
    if (name === "htmx:configRequest") {
      evt.detail.headers['Content-Type'] = "application/json"
    }
  },
  encodeParameters: function(xhr) {
    xhr.overrideMimeType('text/json')
    return (JSON.stringify(getArticleData()))
  }
})
