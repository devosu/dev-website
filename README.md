# README
[![CodeQL](https://github.com/KemingHe/contrib-dev-website/actions/workflows/codeql.yml/badge.svg?branch=staging)](https://github.com/KemingHe/contrib-dev-website/actions/workflows/codeql.yml)
[![Hugo Deploy](https://github.com/KemingHe/contrib-dev-website/actions/workflows/deploy.yml/badge.svg?branch=staging)](https://github.com/KemingHe/contrib-dev-website/actions/workflows/deploy.yml)

Source code for https://osu.dev

## Contributors

| Name        | Email                     | Role           |
|-------------|---------------------------|----------------|
| Alex Gulko  | alex@gulko.net            | President      |
| Misha Gusev | gusev.2@osu.edu           | Lead Developer |
| Keming He   | keminghe.career@gmail.com | Software QA    |

Credit: Table made using Tables Generator

> https://www.tablesgenerator.com/markdown_tables#

## Developer Guide

1. Install Hugo

> https://gohugo.io/installation/

```sh
# For Debian (Ubuntu) Linux users:
set -e; sudo apt update; sudo apt upgrade -y; sudo apt install hugo
```

2. Clone the repo and navigate to local dir

```sh
git clone https://github.com/devosu/dev-website.git
cd dev-website

# To clone a specific branch:
git fetch
git checkout remove_branch_name
```

3. To start the Hugo development server:

```sh
hugo server --config=hugo.toml
```

4. To build the static site:

```sh
set -e; \
if [ -d "build" ]; then rm -Rf build; fi; \
mkdir -p build; \
hugo -d build
```
