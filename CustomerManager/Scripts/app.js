(function() {
  var Customer, CustomerItem, CustomerList, Customers,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  CustomerList = (function(_super) {

    __extends(CustomerList, _super);

    function CustomerList() {
      this.render = __bind(this.render, this);
      this.renderAll = __bind(this.renderAll, this);
      this.initialize = __bind(this.initialize, this);
      CustomerList.__super__.constructor.apply(this, arguments);
    }

    CustomerList.prototype.initialize = function() {
      this.collection.on('reset', this.renderAll);
      this.collection.on('add', this.render);
      this.collection.fetch();
      _.bindAll(this, 'renderAll');
      return this;
    };

    CustomerList.prototype.renderAll = function() {
      this.collection.each(this.render);
      return this;
    };

    CustomerList.prototype.render = function(model) {
      var item;
      item = new CustomerItem({
        model: model
      });
      this.$el.append(item.el);
      return this;
    };

    return CustomerList;

  })(Backbone.View);

  CustomerItem = (function(_super) {

    __extends(CustomerItem, _super);

    function CustomerItem() {
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      CustomerItem.__super__.constructor.apply(this, arguments);
    }

    CustomerItem.prototype.initialize = function() {
      this.template = Handlebars.compile($('#customer').html());
      this.render();
      return this;
    };

    CustomerItem.prototype.render = function() {
      var html;
      html = this.template(this.model.toJSON());
      this.$el.append(html);
      return this;
    };

    return CustomerItem;

  })(Backbone.View);

  Customer = (function(_super) {

    __extends(Customer, _super);

    function Customer() {
      Customer.__super__.constructor.apply(this, arguments);
    }

    return Customer;

  })(Backbone.Model);

  Customers = (function(_super) {

    __extends(Customers, _super);

    function Customers() {
      Customers.__super__.constructor.apply(this, arguments);
    }

    Customers.prototype.url = '/api/customers/';

    Customers.prototype.model = Customer;

    return Customers;

  })(Backbone.Collection);

  $(function() {
    var customers;
    customers = new Customers;
    return new CustomerList({
      collection: customers,
      el: '#customerList'
    });
  });

}).call(this);
