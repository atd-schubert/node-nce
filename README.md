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

var yourOptions = {"name-of-an-extension": {hash:"value"}};

var nce = NCE(yourOptions);
var extMgr = require("nce-extension-manager")(nce);
extMgr.activateExtension(extMgr);

// extMgr.getActivatedExtesion("name-of-an-extension");
```

### List of extensions
The status of this module is beta. As long it is in beta-status, take a look at the [repository wiki](https://github.com/atd-schubert/node-nce/wiki/Extensions) for extensions.

## Concept of extensions
For further informations and examples look at the repository wiki, the [wiki-page for concept of extensions](https://github.com/atd-schubert/node-nce/wiki/Concept-of-extensions), or the [dummy extionsion](https://github.com/atd-schubert/nce-dummy).