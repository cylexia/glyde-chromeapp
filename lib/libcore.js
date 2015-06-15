var Dict = {
  create: function() {
    return {};
  },
  
  createFromDict: function( d_dict ) {
    var n = {};
    for( var k in d_dict ) {
      n[k] = d_dict[k];
    }
    return n;
  },
  
  load: function( d_dict, m_map ) {
    for( var k in m_map ) {
      Dict.set( d_dict, k, m_map[k] );
    }
    return d_dict;
  },
  
  keys: function( d_dict ) {
    var ks = [];
    for( var k in d_dict ) {
      ks.push( k );
    }
    return ks;
  },
  
  values: function( d_dict ) {
    var vs = [];
    for( var k in d_dict ) {
      vs.push( d_dict[k] );
    }
    return vs;
  },
  
  delete: function( d_dict ) {
    return true;
  },
  
  // Frame value/key functions
  set: function( d_dict, s_k, s_v ) {
    d_dict[s_k] = s_v;
  },
  
  valueOf: function( d_dict, s_k, s_d ) {
    if( s_k in d_dict ) {
      return d_dict[s_k];
    } else {
      return (s_d ? s_d : "");
    }
  },
  
  intValueOf: function( d_dict, s_k, s_d ) {
    var n;
    if( s_k in d_dict ) {
      n = parseInt( d_dict[s_k] );
    } else {
      n = (s_d ? s_d : 0);
    }
    if( isNaN( n ) ) {
      return 0;
    }
    return n;
  },
  
  dictValueOf: function( d_dict, s_k, s_d ) {
    if( s_k in d_dict ) {
      return d_dict[s_k];
    } else {
      if( s_d ) {
        return s_d;
      } else {
        return {};
      }
    }
  },
  
  unset: function( d_dict, s_k ) {
    if( s_k in d_dict ) {
      delete d_dict[s_k];
      return true;
    }
  },
  
  containsKey: function( d_dict, s_k ) {
    return (s_k in d_dict);
  }
};