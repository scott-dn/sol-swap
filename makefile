install:
	npm i
	cargo check

init-local:
	solana config set --url localhost
	npm run init

init-testnet:
	solana config set --url testnet
	ENV=testnet npm run init

build:
	npm run build
	cargo-build-sbf

local:
	solana-test-validator -r

swap-local:
	solana config set --url localhost
	npm run main

swap-testnet:
	solana config set --url testnet
	ENV=testnet PROGRAM_ID=Z3qvn5jv4CRidrmYwne8wK1cGB4zBmNxeqkgKkrEh3j npm run main

deploy-local: build
	solana config set --url localhost
	solana deploy target/sbf-solana-solana/release/swap.so

deploy-testnet: build
	solana config set --url testnet
	solana deploy target/sbf-solana-solana/release/swap.so

test-suite: build init-local
	PROGRAM_ID=$(shell solana deploy target/sbf-solana-solana/release/swap.so | grep 'Program Id:' | sed 's/Program Id: //g') npm t

format:
	npm run prettier
	cargo fmt --all

lint:
	npm run lint
	cargo clippy --all-targets --all-features -- -D warnings -D clippy::all

clean:
	cargo clean
	npm run clean
