TEST_FOLDER ?= ./test/
TEST_FILES ?= *.test.js
REPORTER = spec
TIMEOUT = 20000
MOCHA = ./node_modules/mocha/bin/_mocha
PATH := ./node_modules/.bin:$(PATH)
SHELL := /bin/bash

lint:
	@npm run lint

validate-lint:
	@npm run validate-lint

unit-test:
	@mocha $(TEST_FOLDER) -t $(TIMEOUT) -R spec --recursive -name $(TEST_FILES)

test: lint unit-test
	
.PHONY: test clean binary