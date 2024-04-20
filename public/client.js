(function(globalThis) {

    function getArticleData() {
        const adminEl = document.getElementsByTagName('editor-app')[0]
        const res = adminEl.getArticleState({ html: true })
        const data = {
            title: res.title,
            slug: res.slug,
            content: res.content.html
        }
        return data
    }


    globalThis.htmx.defineExtension('saveArticle', {
        /* 
        Abuse `defineExtension` to get and save article data.
        Use in theme as `hx-ext="<name>"`
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

    globalThis.htmx.defineExtension('redirectToResponseUrl', {
        /* 
        Abuse `defineExtension` to redirect on a known 302 response.
        Use in theme as `hx-ext="<name>"`
        */
        transformResponse: function (text, xhr) {
            globalThis.document.location = xhr.responseURL
            return 'Redirecting...'
        }
    })



}) (window)