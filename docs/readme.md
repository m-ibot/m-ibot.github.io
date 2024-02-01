# Readme

This repository contains the website for the github user `m-ibot`. This page is build and deployed with GitHub Pages, GitHub Actions and Jekyll.

This file includes some documentation that is not included in the website itself. The documentation is no full documentation of all used technologies. It just contains additional information that are specific for this website / repository.

All files within this directory itself will be ignored by jekyll and not be included in the website itself.

## External Resources

The following technics and technologies are used. Please refer to these documentations for more information.

- [GitHub repository](https://github.com/m-ibot/m-ibot.github.io)
- [GitHub pages](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions) including...

  - [Checkout](https://github.com/actions/checkout)
  - [configure-pages](https://github.com/actions/configure-pages) and [deploy-pages](https://github.com/actions/deploy-pages) (see GitHub pages)
  - [jekyll-build-pages](https://github.com/actions/jekyll-build-pages) (also see Jekyll)
  - [dependency-review-action](https://github.com/actions/dependency-review-action) (see Dependency reviews)

- [GitHub Security](https://github.com/security) including...
  - [Dependency Review](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review)
  - [Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot)
- [Jekyll](https://jekyllrb.com/) (see [docs](https://jekyllrb.com/docs/))
- [Minimal Mistakes Theme for Jekyll](https://jekyllthemes.io/theme/minimal-mistakes) (see [Quick-Start Guide](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/))
- [Font Awesome](https://fontawesome.com/icons) icons

Big THANKS to everybody who put their time and effort in building, documenting and publishing these amazing tools. A lot of developers and business use theses tools daily and you make their life much easier with it.

## Run locally

To run and test the website locally, run `bundle exec jekyll serve` and open [`http://localhost:4000`](http://localhost:4000) in your browser.

For more information see [testing-your-github-pages-site-locally-with-jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)

## Markdown

The pages content is mostly written in markdown. The file [MarkdownSample.md](./MarkdownSample.md) incudes samples for most markdown formar options.

## Variables

I wanted to display some data on the website, that I did not want to include in this repository. Therefore I decided to use some variables within the repository that are replaced by the actual data during the page deployment.

One might argue that any information that it published on a public website can also be published in a public repository. I would even agree with that. But I did not want so data to be found in GitHubs search results, even if the data will be found be other search engines when crawling the website.

Therefore I used some variables with the pattern `##VARIABLE_NAME##` that will be replaced during the deployment. The actually values are stored as GitHub secrets.

A simple bash command is used within a shell action during the page deployment. See the step `Find and Replace Placeholders` in [](../.github/workflows/jekyll-gh-pages.yml). This might not be the most elegant way to achive that, but it does it's job and over engineering such a simple task is also not a good idea.

## Overwrite includes from minimal mistakes theme

Templates that are included into the pages, e.g. recent posts, can be overwritten by copy and pasting (and adjusting) these includes from [minimal-mistakes `_includes` on Github](https://github.com/mmistakes/minimal-mistakes/tree/master/_includes) to the [includes directory](../_includes/) of this project.
