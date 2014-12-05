"use strict";

var CMS = require("../");
describe('Basic core functions', function(){
  var cms;
  describe('#new CMS', function(){
    it('should create a new CMS object', function(done){
      cms = new CMS();
      done(null, cms);
    });
    it('should next as long as there is no extension connected', function(done){
      cms.middleware({}, {}, done);
    });
  });
});
describe('Extensions', function(){
  var cms = new CMS();
  describe('#createExtension #getExtension', function(){
    var dummyExt;
    
    var dummyOpts = {package:{"version": "0.0.1", "description": "An extension for nce-cms just for testing", "main": "index.js", "author": "Arne Schubert <atd.schubert@gmail.com>", "license": "ISC", "bugs": {"url": "https://github.com/atd-schubert/node-nce/issues"},"homepage": "https://github.com/atd-schubert/node-nce"}};
    
    it('should not create an extension without package information', function(done){
      try { cms.createExtension(); } catch (e){ return done();}
      return done(new Error("Created an extension without package information"));
    });
    it('should not create an extension without a name in package information', function(done){
      try { cms.createExtension(dummyOpts); } catch (e){ return done();}
      return done(new Error("Created an extension without name"));
    });
    it('should create an extension', function(done){
      dummyOpts.package.name="first";
      dummyExt = cms.createExtension(dummyOpts);
      done();
    });
    it('should get created extension', function(done){
      if(cms.getExtension("first") === dummyExt) return done();
      return done(new Error("Get not the right extension!"));
    });
    it('should not create another extension with the same name', function(done){
      try {cms.createExtension(dummyOpts); } catch(e){return done()};
      return done(new Error("Created another extension with the same name!"));
    });
    it('should create extension without name-prefix "nce-"', function(done){
      dummyOpts.package.name="nce-second";
      dummyExt = cms.createExtension(dummyOpts);
      done();
    });
    it('should get created extension without name-prefix "nce-"', function(done){
      if(dummyExt === cms.getExtension("second")) return done();
      return done(new Error("Get not the right extension!"));
    });
  });
  
  describe('configuration', function(){
    var dummyOpts = {package:{"name":"config", "version": "0.0.1", "description": "An extension for nc-cms just for testing", "main": "index.js", "author": "Arne Schubert <atd.schubert@gmail.com>", "license": "ISC", "bugs": {"url": "https://github.com/atd-schubert/node-nce/issues"},"homepage": "https://github.com/atd-schubert/node-nce"}};
    var dummyExt = cms.createExtension(dummyOpts);
    dummyExt.config.test = true;
    it('should get the same config in cms and extension', function(done){
      if(dummyExt.config === cms.config.config) return done();
      return done(new Error("Different config objects"));
    });
    it('should get the same config values in cms and extension', function(done){
      if(dummyExt.config.test === cms.config.config.test && cms.config.config.test === true) return done();
      return done(new Error("Different config values"));
    });
  });
  
  describe('Connecting Extension to CMS', function(){
    
    it('should fire createExtension event', function(done){
      cms.once("createExtension", function(){
        done();
      });
      cms.createExtension({package:{"name":"nce-create"}});
    });
    describe('#.install()', function(){
      var dummyExt = cms.createExtension({package:{"name":"nce-install"}});
      it('should fire install events', function(done){
        var events = {
          cms:false,
          named: false,
          ext: false,
          result: false
        };
        var getEvent = function(type){
          var hash;
          events[type] = true;
          for (hash in events) if(events[hash] === false) return;
          return done();
        };
        cms.once("installExtension", function(){
          getEvent("cms");
        });
        cms.once("installExtension:install", function(){
          getEvent("named");
        });
        dummyExt.once("install", function(){
          getEvent("ext");
        });
        if(dummyExt.install()) getEvent("result");
      });
      it('should set status to installed after installation', function(done){
        if(dummyExt.status === "installed") return done();
        return done(new Error("Wrong extension status"));
      });
      it('should not install again an installed extension', function(done){
        if(dummyExt.install() === false) return done();
        return done(new Error("Extension was installed again!"));
      });
      it('should uninstall an installed extension', function(done){
        var wait = function(){
          process.nextTick(function(){
            if(dummyExt.status !== "installed") return wait();
            if(dummyExt.uninstall() === true) return done();
            return done(new Error("Extension was not uninstalled!"));
          });
        };
        wait();
      });
    });
    describe('#.activate()', function(){
      var dummyExt = cms.createExtension({package:{"name":"nce-activate"}});
      dummyExt.install();
      it('should fire activate events', function(done){
        var events = {
          cms:false,
          named: false,
          ext: false,
          result: false
        };
        var getEvent = function(type){
          var hash;
          events[type] = true;
          for (hash in events) if(events[hash] === false) return;
          return done();
        };
        cms.once("activateExtension", function(){
          getEvent("cms");
        });
        cms.once("activateExtension:activate", function(){
          getEvent("named");
        });
        dummyExt.once("activate", function(){
          getEvent("ext");
        });
        if(dummyExt.activate()) getEvent("result");
      });
      it('should set status to activated after activation', function(done){
        if(dummyExt.status === "activated") return done();
        return done(new Error("Wrong extension status"));
      });
      it('should not activate again an activated extension', function(done){
        if(dummyExt.activate() === false) return done();
        return done(new Error("Extension was activated again!"));
      });
      it('should not install again an activated extension', function(done){
        if(dummyExt.install() === false) return done();
        return done(new Error("Extension was installed again!"));
      });
    });
    return;
    describe('#.deactivate()', function(){
      var dummyExt = cms.createExtension({package:{"name":"nce-deactivate"}});
      dummyExt.install();
      dummyExt.activate();
      it('should fire deactivate events', function(done){
        var events = {
          cms:false,
          named: false,
          ext: false,
          result: false
        };
        var getEvent = function(type){
          var hash;
          events[type] = true;
          for (hash in events) if(events[hash] === false) return;
          return done();
        };
        cms.once("deactivateExtension", function(){
          getEvent("cms");
        });
        cms.once("deactivateExtension:deactivate", function(){
          getEvent("named");
        });
        dummyExt.once("deactivate", function(){
          getEvent("ext");
        });
        if(dummyExt.deactivate()) getEvent("result");
      });
      it('should set status to deactivated after deactivation', function(done){
        if(dummyExt.status === "deactivated") return done();
        return done(new Error("Wrong extension status"));
      });
      it('should not deactivate again an deactivated extension', function(done){
        if(dummyExt.activate() === false) return done();
        return done(new Error("Extension was deactivated again!"));
      });
      it('should not install again an deactivated extension', function(done){
        if(dummyExt.install() === false) return done();
        return done(new Error("Extension was installed again!"));
      });
    });
    describe('#.uninstall()', function(){
      
      var dummyExt = cms.createExtension({package:{"name":"nce-uninstall"}});
      dummyExt.install();
      dummyExt.activate();
      dummyExt.deactivate();
      it('should fire uninstall events', function(done){
        var events = {
          cms:false,
          named: false,
          ext: false,
          result: false
        };
        var getEvent = function(type){
          var hash;
          events[type] = true;
          for (hash in events) if(events[hash] === false) return;
          return done();
        };
        cms.once("uninstallExtension", function(){
          getEvent("cms");
        });
        cms.once("uninstallExtension:uninstall", function(){
          getEvent("named");
        });
        dummyExt.once("uninstall", function(){
          getEvent("ext");
        });
        if(dummyExt.uninstall()) getEvent("result");
      });
      it('should set status to uninstalled after deinstallation', function(done){
        if(dummyExt.status === "uninstalled") return done();
        return done(new Error("Wrong extension status"));
      });
      it('should not uninstall again an uninstalled extension', function(done){
        if(dummyExt.uninstall() === false) return done();
        return done(new Error("Extension was uninstalled again!"));
      });
      it('should not deactivate again an uninstalled extension', function(done){
        if(dummyExt.activate() === false) return done();
        return done(new Error("Extension was deactivated again!"));
      });
    });
  });
  describe('Middleware', function(){
    var router = function(req, res, next){
      if(req.url === "/test") {
        res.writeHead(200, {"content-type": "text/plain"});
        return res.end("It works...");
      }
  
      return next();
    };
    cms.requestMiddlewares.push(router);
    var result = {};
    var res = {
      writeHead: function(code, headers){
        result.code = code;
        result.headers = headers;
      },
      write: function(txt){
        result.data = data;
      },
      end: function(txt){result.end(txt);}
    };
    
    describe('unmatched route', function(){
      it('should call next for unmatched route', function(done){
        cms.middleware({url:"/"}, res, done);
      });
      it('should route an existing route', function(done){
        result = {end: function(txt){
          if(result.code === 200 && result.headers["content-type"] === "text/plain" && txt === "It works...") return done();
          return done("");
        }}
        cms.middleware({url:"/test"}, res, done);
      });
    });
  });
});
describe('CMS with options', function(){
  var cms = new CMS({prefix:{str:"ok", bool:true}, test:{str:"ok", bool:true}});
  var dummyExt = cms.createExtension({package:{name:"test"}});
  var dummyPrefixExt = cms.createExtension({package:{name:"nce-prefix"}});
  
  it('should get predefined config with prefix', function(done){
    if(dummyExt.config.str === "ok" && dummyExt.config.bool) return done();
    return done(new Error("Can not get predefined config"));
  });
  it('should get predefined config with prefix', function(done){
    if(dummyPrefixExt.config.str === "ok" && dummyPrefixExt.config.bool) return done();
    return done(new Error("Can not get predefined config"));
  });
  
});