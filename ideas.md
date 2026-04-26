1. In .github/workflows/deploy.yml there is a section that replaces some placeholders with GitHub secrets. It searches for placeholders in the whole repository. I think this is outdated. The placeholders are only used in index.html, right?
2. Is there an easy way to minimize our css file without using any complex build tools?
3. Can we create a simple local build script, that creates a version of the website with replaced placeholders?
    - copy the website to a temporary folder
    - exclude the temporary folder from git
    - prepare a file with dummy data for the placeholder.
4. Add a licence.md. Which licence would be recommended?
5. Update the readme.md
6. That's a big one: Is it possible to load my work experience from LinkedIn and add it to the "About me" section on the website? Does LinkedIn offer an API for that? Could this be done during the build process?
7. Should Keyboard-Navigation with tab only be possible for interacticve elements (e.g. links) or also for text elements (e.g. Headlines)?
