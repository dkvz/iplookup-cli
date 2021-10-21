# iplookup-cli
I needed something to quickly check IPs and networks and registered AS without reaching the limit on some API or website.

Kinda niche to my specific uses.

Expects 3 environement variables that I use for other scripts of mine (see `.env`).

## Usage
Provide a list of IP addresses as arguments.

```
node index.js 8.8.8.8 1.1.1.1
```

## NPM package
Can be installed as a CLI tool from npm:
```
npm install -g @dkvz/iplookup-cli
```

Which should allow you to use the command `iplookup-node`. For instance: `iplookup-node 8.8.8.8 1.1.1.1`.

# TODO
- [x] Add error handling
- [x] Could be a CLI npm package. Just set the env varibles globally in bashrc or something to set your own database paths
- [ ] Add a flag to query the GeoIP API instead of using the local DBs