# Dependency inversion

- `headless_cms_service.ts` is the high-level module.

- `directus.ts` is the low-level module.

- `headless_cms_service.ts` only cares about the abstraction provided by `directus.ts`. It does not care about it's implementation.

- Meaning, we can easily use other cms's and have `headless_cms_service.ts` still function without breaking.

- E.g. we could use sanity's headless cms by creating a `sanity.ts` and uses it's SDK (https://www.sanity.io/docs/js-client) class which implements the `headless_cms_interface` and adheres to the methods specified.
