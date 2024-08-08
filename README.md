# Kita-site

Bun + Elysia + Kita and a github repo for backend-storage.

## Why

No need to change mindset into that of an irritating static-site genereator with tons of restrictions. 

Just learn more of the stuff you'd like to work with anyways

If you ever needed a small site to hack away at for your own amusement and show-off, then this is it:

- Bun: A lean and nicely opinionated NodeJS

- Elysia: Express replacement*

- Github: Filestorage ("CMS")

- Kita: JSX for server

    - JSS (css-in-js): Old, but good for JSX + Kita

The boon is using JSX + whatever serverside for a super-smooth DX.

## How

"CMS" backend is github. `octokit` fetches all `.md` files from root of github repo on branch `main`.
These repo-files are cached to a json file on local disk, and updated by pinging github tree for status:

- `304 - Not modified` based on etag + last-modified headers

    -  Doesn't deplete quota

- `200 - Ok` implies updates to repo and fetches files anew

Files are parsed to `articles`:

- `id`'ed by their filename (minus extension, slugified), 
- `meta` is `front-matter` by `parse-md`
- `body` is html parsed by `marked` (no plugins) and `dompurify`.

### Repo content files

**Filenames** must have extension `.md`

- `__header.md` and `__footer.md` are required for site header and footer content.

- Filename starting with two dashes (`--*.md`) are considered to be unpublished.

**front-matter**

```yaml
---
title: <TITLE>
intro: <INTRO TEXT>
weight: <INTEGER>
---

<MD CONTENT>
```

Articles are sorted by `weight` ascending, default is `Number.MAX_SAFE_INTEGER`.

### Still missing

- [X] Agressive caching

    - Set `etag` + `lastModified` headers to same as repo on *all* requests. - If no change in repo, then no need to fetch.

    - Only in `production`, `dev*` bypasses caching

- [X] Css (JSS)

- [X] Static file serving

    - Some bugs in Elysia plugins `html` & `static`, try reimplementing with version-ovrrerides

        - See `package.json::overrides`

- [ ] Image storage 

    - [X] For theme

        - Since staticPlugin works with overrides, just use the `public` folder

    - [ ] For articles

- [ ] Maybe some markdown plugins for ekstra bling, or at least maybe support github-flavoured markdown?


## Getting Started

1. [Install bun](https://bun.sh/docs/installation)

2. Install packages 

    ```bash
    bun install 
    ```


## Run

**env vars**

```
DB_USER=<GIT_USER>
DB_NAME=<REPO_NAME>
DB_PASS=<GITHUB-PAT_FINE-GRAINED_REPO-CONTENTS-READ>
PORT=<PORT || 3000>
```



**Development**

Running in dev-mode does not add any cache-headers on responses.

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

**Production**

```bash
bun run start
```

---

\* Elysia: As of July 2024, it has a few issues with its plugins. Hopefully that will be [ironed out](https://elysiajs.com/blog/elysia-11.html) during the year