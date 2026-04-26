# Project Overview: m-ibot.github.io

This project is a personal website for **m-ibot.eu**, owned by Tobi M, a senior software engineer. It has been recreated as a high-performance static one-pager, moving away from the previous Jekyll-based implementation.

## Target Webpage
The site is a modern, accessible one-pager designed with the following constraints:
- **One Pager**: All content (About, Contact, Imprint) on a single page.
- **Light and Dark Theme**: Implemented via a CSS-only toggle (no JavaScript).
- **Static & No JS**: Built purely with HTML5 and CSS3.
- **Accessibility**: Focused on semantic HTML and ARIA standards.
- **Visuals**: Simple CSS effects including smooth scrolling and fade-in animations.

For detailed design decisions and technical specifications, see the documentation in:
- `docs/brainstorming/` (Brainstorming logs)
- `docs/superpowers/specs/` (Technical specifications)
- `docs/superpowers/plans/` (Implementation plans)

The files in ocs' *must not* be commited to git.

## Key Technologies
- **HTML5/CSS3**: Core site construction.
- **GitHub Actions**: Handles the build and deployment pipeline.

## AI Agent Policy
- **No Automated Training:** Training on this repository's content is not permitted without explicit written consent from the owner.
- **Agent Conduct:** All AI agents working in this repository MUST read and adhere to the mandates in this file.
- **Workflow Integrity:** The "No Worktrees" and "Direct Implementation" mandates are binding. Do not attempt to bypass them.

## Architecture
- **Folder Structure**:
  - `src/`: Source code including `index.html`, `style.css`, and static assets.
  - `.github/workflows/`: CI/CD definitions for deployment and verification.
  - `docs/`: (Generated) Deployment target for GitHub Pages.

### Placeholder Replacement System
Dynamic content is injected from GitHub Secrets during the CI/CD process using `sed`. The following placeholders are supported:
- `##NAME##`
- `##SOCIAL_XING##`
- `##SOCIAL_LINKEDIN##`
- `##CONTACT_E_MAIL##`
- `##SEO_BING##`
- `##SEO_GOOGLE##`

## Building and Running

### Local Development
Since the site is purely static, you can view it by opening `src/index.html` in any browser. 

*Note: Placeholders like `##NAME##` will appear as raw text locally. To preview with actual values, you must manually substitute them or use a local build script (tbd).*

### Deployment
The site is automatically deployed via GitHub Actions when changes are pushed to the `main` branch. The workflow processes placeholders in `src/index.html` and uploads the `src` directory as a GitHub Pages artifact.

## Development Conventions

## Development Workflow Mandates
- **No Worktrees:** NEVER use the `using-git-worktrees` skill or create isolated workspaces. All feature development, brainstorming, and implementation plans MUST be executed directly in the current working directory and branch.
- **Direct Implementation:** Perform all code modifications directly on the source files within the project root or relevant subdirectories.
- **No browser usage during brainstorming:** Some of what we're working on might be easier to explain if show it in a web browser. This feature is still new and can be token-intensive. Therefore we NEVER want to use it. Brainstorming should be text bases. But it is ok to create a file `docs/brainstorming/<date>-<feature-name>.md` and show layouts and similar with ascii arts instead.

### Placeholder Usage
Always use the `##PLACEHOLDER_NAME##` syntax for sensitive or configurable information to ensure it is correctly handled by the `deploy.yml` workflow.

### Code Style
- **CSS**: Use CSS variables for theme-dependent colors.
- **HTML**: Maintain semantic structure and provide `aria-label` for interactive or icon-only elements.
- **Icons**: Use inline SVGs with `fill="currentColor"` for theme compatibility.
