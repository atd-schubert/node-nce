"use strict";

var EventEmitter = require("events").EventEmitter;
var util = require("util");

var NodeContentManagement = function NodeContent(opts){
  EventEmitter.call(this);
  var self = this;
  
  // Configuration...
  opts = opts || {};
  
  // Extension Class:
  var Extension = function(opts){
    EventEmitter.call(this);
    
    if(!opts) throw new Error("An extension has to have a option parameter");
    if(!opts.package) throw new Error("An extension has to have package informations");
    if(!opts.package.name) throw new Error("An extension has to have a name");
    var name = opts.package.name;
    
    if(name.substr(0, 4) === "nce-") name = name.substr(4);
    
    if(Extension.extensions[name]) throw new Error("There is already an extension with the name '"+name+"'.");
    Extension.extensions[name] = this;
    
    this.status = undefined;
    var status;
    
	  this.activate = function(){
  	  if(status !== "installed") return false;
		  this.nce.emit("activateExtension", {target: this, args: arguments});
		  this.nce.emit("activateExtension:"+name, {target: this, args: arguments});
		  this.emit("activate", {target: this, args: arguments});
		  this.status = status = "activated";
		  return true;
	  };
	  this.deactivate = function(){
  	  if(status !== "activated") return false;
		  this.nce.emit("deactivateExtension", {target: this, args: arguments});
		  this.nce.emit("deactivateExtension:"+name, {target: this, args: arguments});
		  this.emit("deactivate", {target: this, args: arguments});
		  this.status = status = "deactivated";
		  return true;
	  };
	  this.install = function(){
  	  if(status === "activated" || status === "deactivated" || status === "installed") return false;
		  this.nce.emit("installExtension", {target: this, args: arguments});
		  this.nce.emit("installExtension:"+name, {target: this, args: arguments});
		  this.emit("install", {target: this, args: arguments});
		  this.status = status = "installed";
		  return true;
	  };
	  this.uninstall = function(){
  	  if(status === "activated") this.deactivate();
  	  if(status !== "deactivated" && status !== "installed") return false;
		  this.nce.emit("uninstallExtension", {target: this, args: arguments});
		  this.nce.emit("uninstallExtension:"+name, {target: this, args: arguments});
		  this.emit("uninstall", {target: this, args: arguments});
		  this.status = status = "uninstalled";
		  return true;
	  };
	  
	  this.nce = self;
	  this.package = opts.package;
	  this.name = name;
	  this.config = this.nce.config[name] = this.nce.config[name] || {};
	  
	  this.nce.emit("createExtension", this);
  };
  util.inherits(Extension, EventEmitter);
  this.extensions = Extension.extensions = {};
  
  this.createExtension = function(opts){
	  return new Extension(opts);
  };
  this.getExtension = function(name){
	  return Extension.extensions[name];
  };
  this.removeExtension = function(name){
	  delete Extension.extensions[name];
  };
  
  // End of Extension class
  
  this.config = opts;
  
  this.requestMiddlewares = [];
  
  this.middleware = function(req, res, done){
    // cache
    req.nce = self;
    res.nce = self;
    
    var mwPosition = 0;
    
    var next = function(err){
	    if(err) return done(err);
	    if(self.requestMiddlewares[mwPosition]) return self.requestMiddlewares[mwPosition++](req, res, next);
	    done();
    };
    next();
    return;
  };
};


util.inherits(NodeContentManagement, EventEmitter);

module.exports = NodeContentManagement;
