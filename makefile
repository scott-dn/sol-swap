install:
	npm i
	cargo check

init:
	npm run init

build:
	npm run build
	cargo-build-sbf

local:
	solana-test-validator -r

test:

deploy-local: build
	solana deploy target/sbf-solana-solana/release/swap.so

format:
	npm run prettier
	cargo fmt --all

lint:
	npm run lint
	cargo clippy --all-targets --all-features -- -D warnings -D clippy::all

clean:
	cargo clean
	npm run clean
