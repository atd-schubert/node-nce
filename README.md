#node-nce
## Description
Core for an extension based content-management-system.

## How to install
Install with npm: `npm install --save nce`

## How to use
The core of nce make it possible to add extensions. Every other functionality is served by other extensions.

### Basic setup
```
"use strict";
var NCE = require("nce");

var yourOptions = {"Name of an extension": {hash:"value"}};

var nce = NCE(yourOptions);

// var anExtension = require("nce-an-extension");
// var ext = anExtension(nc);
// var ext.install();
// var ext.activate();

```

### List of extensions
The status of this module is beta. As long it is in beta-status, take a look at the repository for extensions.

## Concept of extensions
For further informations and examples look at the [dummy extionsion](https://github.com/atd-schubert/nce-dummy).