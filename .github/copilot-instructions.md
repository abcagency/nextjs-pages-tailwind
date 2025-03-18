Use these prettier rules:

```
{
	"trailingComma": "none",
	"tabWidth": 2,
	"useTabs": true,
	"semi": true,
	"singleQuote": true,
	"bracketSpacing": true,
	"arrowParens": "avoid",
	"bracketSameLine": false,
	"jsxSingleQuote": false,
	"proseWrap": "preserve"
}
```

Prefer const over let.
Use TailwindCSS v3 for styling.
Business logic and data retrieval should be in the /lib directory.
Use the /components/modules directory for components.
Use the /pages directory for pages.
Use the /hooks directory for hooks.
Use framer (framer motion) for animations and transitions.
Use nuqs for state management that makes sense to persist in the URL (e.g. filter, sort order, visibility of elements).
Use Next.js for routing.
Use react-hook-form with yup for forms.
Yup validation files should be in /lib/validators and imported client-side and server-side.
Avoid using a useEffect hook whenever possible.
Always output the entire file, especially if changes are made throughout, unless the change is just one specific section or function or component. In that case, you can output just that section or function or component.

Write commit messages in the past tense.
Commit messages should be a very general description of the semantics of the change.
Commit messages should not reference file names or components as this is typically the names of the committed files.
