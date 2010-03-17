(function () {
  var Graph = function (graph) {
    this._graph = {} // {u: {v: edge, ...}, ...}
    this._degree = {} // {u: degree, ...}
    this._vertices = []; // [u, v, ...]
    this._size = 0;
    
    if (graph)
    {
      // copy input graph
      for (var u in graph)
      {
        var adj = graph[u];
        if (adj.constructor === Object)
        {
          for (var v in adj)
          {
            this.set(u, v, adj[v]);
          }
        } else if (adj.constructor === Array)
        {
          for (var i = 0; i < adj.length; i++)
          {
            this.set(u, adj[i]);
          }
        }
      }
    }
  }
  
  Graph.prototype.copy = function ()
  {
    return new Graph(this._graph);
  }
  
  Graph.prototype.adj = function (u)
  {
    return this._graph[u];
  }
  
  Graph.prototype.get = function (u, v)
  {
    if (this._graph[u])
      return this._graph[u][v];
  }
  
  Graph.prototype.degree = function (u)
  {
    return this._degree[u];
  }
  
  Graph.prototype.size = function ()
  {
    return this._size;
  }
  
  Graph.prototype.order = function ()
  {
    return this._vertices.length;
  }
  
  Graph.prototype.each = function (f)
  {
    for (var i = 0; i < this._vertices.length; i++)
    {
      if (f(this._vertices[i], i) === false)
        break;
    }
  }
  
  Graph.prototype.grep = function (f)
  {
    var vertices = [];
    this.each(function (v)
    {
      if (f(v))
        vertices.push(v);
    });
    return vertices;
  }
  
  Graph.prototype.set = function (u, v, edge)
  {
  	// take an undefined edge as simply 'true' for convenience
  	edge = (edge === undefined ? true : edge);
  	
  	// increment/decrement size
	  if (edge && !(this._graph[u] && this._graph[u][v]))
	  {
	    this._size++;
	  } else if (!edge && this._graph[u] && this._graph[u][v])
	  {
	    this._size--;
	  }
	  
  	// set/unset edges and increment/decrement degrees
  	_set(this, u, v, edge);
  	_set(this, v, u, edge);
  	
  	return edge;
  }
  
  Graph.prototype.del = function (u, v)
  {
  	return this.set(u, v, false); // false is the edge annihilator
  }
  
  Graph.prototype.cartesian = function (g)
  {
    var h = new Graph();
    
    var vertices = [];
    for (var i = 0; i < this._vertices.length; i++)
    {
      for (var j = 0; j < g._vertices.length; j++)
      {
        vertices.push([this._vertices[i], g._vertices[j]]);
      }
    }
    
    for (var i = 0; i < vertices.length; i++)
    {
      for (var j = 0; j < vertices.length; j++)
      {
        var u = vertices[i], v = vertices[j];
        if (u[0] === v[0] && g.get(u[1], v[1]) || this.get(u[0], v[0]) && u[1] === v[1])
        {
          h.set(u, v);
        }
      }
    }
    
    return h;
  }
  
  function _set (g, u, v, e)
  {
  	// add to vertex list if the degree is unknown
  	if (!g._degree[u])
  	{
  	  g._vertices.push(u);
  		g._degree[u] = 0;
  	}
  	
  	// we are setting an edge
  	if (e)
  	{
  		// we have a *new* edge
  		if(!g._graph[u] || !g._graph[u][v])
  		{
  			g._degree[u]++;
  		}
  		
  		// add to adjacency list
  		g._graph[u] = g._graph[u] || {};
  		g._graph[u][v] = e;
  	}
  	// we are deleting an existing edge
  	else if(g._graph[u] && g._graph[u][v])
  	{
  		// remove from adjacency list
  		delete g._graph[u][v];
  		g._degree[u]--;
  	}
  }
  
  // add to global scope
  window.Graph = Graph;
}());
