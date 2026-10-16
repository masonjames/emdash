# EmDash contribution browser evidence

Synthetic browser fixtures for the independently reviewed EmDash form, panel-layout and reduced-motion candidates. No production content or member data is included.

Forms use actual BlockRenderer/Kumo controls inside a representative content-editor form. The panel tests exercise the actual SandboxedContentEditorPanel component with controlled local responses. Screenshots show desktop and phone RTL direction; they are not full translated CMS acceptance tests.

Form screenshots accompany the DOM ownership/validation assertions. Panel-layout screenshots show unchanged current upstream behavior. Reduced-motion before/after screenshots show the same opening interaction with reduced motion enabled; browser tests separately observe real CSS height animations and verify normal-motion behavior.

Material assistance: OpenAI Codex, including GPT-6.1 Sol browser-testing work. Source changes and test results are described in their draft PRs. These images are supporting evidence, not a deployment qualification.
