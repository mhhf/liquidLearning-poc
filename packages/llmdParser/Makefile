all: src/llmdParser.y
	jison src/llmdParser.y
	echo "\nLlmdParser = llmdParser;" >> llmdParser.js

test:
	mocha test

