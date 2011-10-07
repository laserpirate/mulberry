dojo.provide('toura.app.Routes');

toura.app.Routes = function() {
  var app = toura.app.Config.get('app'),
      routes;

  function nodeRoute(route, nodeId, pageState) {
    pageState = pageState || {};

    var nodeModel = toura.app.Data.getModel(nodeId),
        page = toura.app.UI.getCurrentPage(),
        pf, subscription;

    if (!nodeModel) {
      console.log('Request for invalid hash', route.hash);
      toura.app.Router.home();
      return;
    }

    if (!page || !page.node || nodeId !== page.node.id) {
      // if we don't have a page yet, if we  have a page but
      // it's not a node page, or if we have a node page but
      // it's not for the requested node ... in all of these
      // cases, we need the page factory to spin up a page
      try {
        pf = toura.app.PageFactory.createPage('node', nodeModel);
      } catch(e) {
        console.log(e);
        toura.app.Router.back();
        return;
      }

      if (pf.failure) {
        if (dojo.isString(pf.failure)) {
          alert(pf.failure);
        }

        toura.app.Router.back();
        return;
      }

      pf.init(pageState);
      toura.app.UI.showPage(pf, nodeModel);
    } else {
      page.init(pageState);
    }

    // record node pageview if it is node-only
    if (nodeId && !pageState.assetType) {
      dojo.publish('/node/view', [ route.hash ]);
    }

    toura.endLogSection('NODE ROUTE');

    return true;
  }

  routes = [
    {
      route : '/home',
      handler : function(params, route) {
        toura.lastSearchTerm = null;
        return nodeRoute(route, app.homeNodeId);
      },
      defaultRoute : true
    },

    {
      route : '/about',
      handler : function(params, route) {
        return nodeRoute(route, app.aboutNodeId);
      }
    },

    {
      route : '/maps',
      handler : function(params, route) {
        return nodeRoute(route, app.mapsNodeId);
      }
    },

    {
      route : /\/node\/(.*)/,
      handler : function(params, route) {
        var splat = params.splat[0].split('/'),
            nodeId = splat[0],
            pageState = {
              assetType : splat[1],
              assetId : splat[2],
              assetSubId : splat[3]
            };

        return nodeRoute(route, nodeId, pageState);
      }
    },

    {
      route : /\/search\/?(.*)/,
      handler : function(params) {
        var page = toura.app.UI.getCurrentPage(),
            term = params.splat && params.splat[0].split('/')[0];

        if (!page || !page.type || page.type !== 'search') {
          page = toura.app.PageFactory.createPage('search');
          toura.app.UI.showPage(page);
        }

        page.init(term);

        return true;
      }
    },

    {
      route : '/feed/:feedId/item/:itemIndex',
      handler : function(params) {
        var feed = toura.app.Data.getModel(params.feedId, 'feed'),
            feedItem = feed.getItem(params.itemIndex),
            page = toura.app.PageFactory.createPage('feedItem', feedItem);

        toura.app.UI.showPage(page, feedItem);
      }
    }
  ];

  if (toura.features.debugPage) {
    routes.push({
      route : '/debug/:query',
      handler : function(params, route) {
        var page = toura.app.PageFactory.createPage('debug', params.query);
        toura.app.UI.showPage(page);
      }
    });
  }

  if (toura.features.favorites) {
    routes.push({
      route : '/favorites',
      handler : function() {
        var page = toura.app.PageFactory.createPage('favorites');
        toura.app.UI.showPage(page);
      }
    });
  }

  return routes;
};
