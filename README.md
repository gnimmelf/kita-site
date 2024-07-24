# Kita-site

Bun + Elysia + Kita and github repo backend-storage.


## Why

No need to change mindset into that of an irritating static-site genereator with tons of restrictions. 

Just learn more of the stuff you'd like to work with anyways

If you ever needed a small site to hack away at for your own amusement and show-off, then this is it:

- Bun: A lean and nicely opinionated NodeJS

- Elysia: Express replacemant

- Github: Filestorage

- Kita: JSX for server

The boon is using JSX + whatever serverside for a super-smooth DX.

### How

"CMS" backend is github. `octokit` fetches all `.md` files from root of github repo on branch `main`.
These repo-files are cached to a json file on local disk, and updated by pinging github tree for non-304:

- 304 based on etag + last-modified headers

- 304 Doesn't deplete quota

- 200 implies updates to repo and fetches files anew

Files are id'ed by their filename, and the content is `front-matter` markedown.


### Still missing

- Image storage

- Some markdown plugins for ekstra bling


## Getting Started

[Install bun](https://bun.sh/docs/installation)

```bash
bun install 
```


## Run

**Development**

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

**Production**

```bash
bun run start
```
