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

    if(!verCommit.version || verCommit.version > version) {
        // Update commit
        Object.assign(verCommit, {
            sha, comment, version
        })

        // Try to create tag
        const { stdout, stderr, exitCode } = await $`git tag v${verCommit.version}`
            .nothrow()
            .quiet();

        console.log(verCommit, {
            stdout, stderr, exitCode
        })
    }
}

