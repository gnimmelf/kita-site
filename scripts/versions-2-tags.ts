import { $ } from "bun";

/**
 * See:
 *  - https://bun.sh/guides/runtime/shell
 *  - https://stackoverflow.com/a/69396023/1008905
 * */

const log = console.log

const verCommit = {
    comment: '',
    version: '',
    sha: ''
}

for await (const line of $`git log --pretty=oneline`.lines()) {
    if (!line) {
        // Loop to next line
        continue
    }

    const [sha, ...rest] = line.split(' ')
    const comment = rest.join(' ')

    const { version } = JSON.parse(await $`git show "${sha}:package.json"`.text())

    if (!verCommit.version || verCommit.version > version) {
        // Update commit
        Object.assign(verCommit, {
            sha, comment, version
        })

        // Try to create tag
        const tag = `v${verCommit.version}`
        const { stdout, stderr, exitCode } = await $`git tag ${tag}`
            .nothrow()
            .quiet();

        if (exitCode === 0) {
            log(`Created tag ${tag} on commit ${verCommit.sha.substring(0, 20)}`)
        } else {
            log(`Tag ${tag}  already exists on commit ${sha.substring(0, 20)}`)
        }
    }
}

