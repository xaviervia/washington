all: bootstrap test

bootstrap:
	npm run bootstrap

test:
	cd packages/washington.core && npm test
	cd packages/washington.formatter.browser && npm test
	cd packages/washington.formatter.json && npm test
	cd packages/washington.formatter.tap && npm test
	cd packages/washington.formatter.terminal && npm test
