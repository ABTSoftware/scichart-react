# The browser tests in the same image CI uses, for a local check before pushing.
#
#   npm run test:docker
#
# A local run only reports. The baselines in tests/__screenshots__/linux/ are recorded and judged by
# CI alone: screenshots differ slightly between machines (CPU architecture among them), so nothing
# produced here is committed.
#
# The build context is the repo root. Tests and library are baked into the image, so the image is
# rebuilt on every run; the dependency layers stay cached while the lockfiles do not change.
#
# The tag must match the @playwright/test devDependency: the browsers are baked into the image.
FROM mcr.microsoft.com/playwright:v1.63.0-noble

# there is no .git in the build context, so the husky prepare script has nothing to install into
ENV HUSKY=0

WORKDIR /repo

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# the leak test's demo; it compiles the library from src/, so nothing has to be built first
RUN npm --prefix demos/features/chart-group ci --no-audit --no-fund

CMD ["npm", "run", "test:e2e"]
