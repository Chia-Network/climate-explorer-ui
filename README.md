# Climate Explorer User Interface

The Climate Explorer User Interface is the best way for a registry or watchdog organization to follow all on-chain activity related to the tokenization of carbon credits using the [Climate Tokenization Engine](https://github.com/Chia-Network/Climate-Tokenization-Engine). This user interface accesses data from the [Climate Explorer](https://github.com/Chia-Network/climate-token-driver/) and displays all `Tokenization`, `Detokenization`, and `Retirement` events for carbon tokens issued by a particular registry. 

The Climate Explorer UI is the final piece of the Climate Tokenization Suite to provide full transparency into the tokenization process. 

Registries leveraging the [Climate Tokenization Engine](https://github.com/Chia-Network/Climate-Tokenization-Engine) should plan on setting up a separate machine to run the Climate Explorer, as the Climate Explorer is meant to publically surface registry token activity that is occurring on the Chia blockchain. By having a separate machine running the Climate Explorer, organizations are able to better protect the CADT, Climate Tokenization Engine, & Chia Climate Tokenization services while still providing transparency to their constituents. 

## Related Projects

* [Chia Blockchain](https://github.com/Chia-Network/chia-blockchain)
* [Climate Tokenization Engine](https://github.com/Chia-Network/Climate-Tokenization-Engine)
* [Climate Tokenization Engine UI](https://github.com/Chia-Network/Climate-Tokenization-Engine-UI)
* [Climate Explorer](https://github.com/Chia-Network/climate-token-driver)
* [Chia Climate Tokenization](https://github.com/Chia-Network/climate-token-driver)
* [Climate Wallet](https://github.com/Chia-Network/Climate-Wallet)
* [Climate Action Data Trust](https://github.com/Chia-Network/cadt)
* [Climate Action Data Trust UI](https://github.com/Chia-Network/cadt-ui)

## QuickStart

### Installation

Precompiled binaries and installers are available for MacOS, Windows, and Debian-based Linux distros (Ubuntu, Mint, PopOS, etc) on the [releases](https://github.com/Chia-Network/climate-explorer-ui/releases) page. 

## Developer Guide

### Installing from Source 

```
npm install -g react-scripts
git clone git@github.com:Chia-Network/climate-explorer-ui
cd climate-explorer-ui
nvm install 16.0.0
nvm use 16.0.0
npm install foreman -g
npm install -g husky
npm install -g prettier
npm install -g lint-staged
npm install -g git-authors-cli
npm set-script prepare "husky install"
npm run prepare

// If you are on linux or mac run
chmod ug+x .husky/*
chmod ug+x .git/hooks/*

npm run start
```

### Prerequisites

You'll need:

- Git
- [nvm](https://github.com/nvm-sh/nvm)

This app uses `nvm` to align node versions across development, CI and production. If you're working on Windows you should consider [nvm-windows](https://github.com/coreybutler/nvm-windows)

## Contributing

Upon your first commit, you will automatically be added to the package.json file as a contributor.

## Commiting

[Signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) are required.

This repo uses a commit convention. A typical commit message might read:

```
    fix: correct home screen layout
```

The first part of this is the commit "type". The most common types are "feat" for new features, and "fix" for bugfixes. Using these commit types helps us correctly manage our version numbers and changelogs. Since our release process calculates new version numbers from our commits it is very important to get this right.

- `feat` is for introducing a new feature
- `fix` is for bug fixes
- `docs` for documentation only changes
- `style` is for code formatting only
- `refactor` is for changes to code which should not be detectable by users or testers
- `perf` is for a code change that improves performance
- `test` is for changes which only touch test files or related tooling
- `build` is for changes which only touch our develop/release tools
- `ci` is for changes to the continuous integration files and scripts
- `chore` is for changes that don't modify code, like a version bump
- `revert` is for reverting a previous commit

After the type and scope there should be a colon.

The "subject" of the commit follows. It should be a short indication of the change. The commit convention prefers that this is written in the present-imperative tense.

### Commit linting

Each time you commit the message will be checked against these standards in a pre-commit hook. Additionally all the commits in a PR branch will be linted before it can be merged to master.

### Branch Layout

All pull requests should be made against the `develop` branch.  Commits to the `main` branch will trigger a release, so the `main` branch is always the code in the latest release.
