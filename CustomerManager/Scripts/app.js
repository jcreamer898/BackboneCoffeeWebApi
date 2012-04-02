(function() {
  var Customer, CustomerEdit, CustomerItem, CustomerList, Customers, Vent,
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
      this["delete"] = __bind(this["delete"], this);
      this.showEdit = __bind(this.showEdit, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      CustomerItem.__super__.constructor.apply(this, arguments);
    }

    CustomerItem.prototype.tagName = 'tr';

    CustomerItem.prototype.initialize = function() {
      this.template = Handlebars.compile($('#customer').html());
      this.model.on('change', this.render);
      this.render();
      return this;
    };

    CustomerItem.prototype.events = {
      'click .remove': 'delete',
      'click .edit': 'showEdit'
    };

    CustomerItem.prototype.render = function() {
      var html;
      html = this.template(this.model.toJSON());
      this.$el.html('').append(html);
      return this;
    };

    CustomerItem.prototype.showEdit = function(event) {
      event.preventDefault();
      Vent.trigger('edit', this.model);
      return this;
    };

    CustomerItem.prototype["delete"] = function() {
      this.model.destroy();
      this.remove();
      return this;
    };

    return CustomerItem;

  })(Backbone.View);

  CustomerEdit = (function(_super) {

    __extends(CustomerEdit, _super);

    function CustomerEdit() {
      this.cancel = __bind(this.cancel, this);
      this.save = __bind(this.save, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      CustomerEdit.__super__.constructor.apply(this, arguments);
    }

    CustomerEdit.prototype.el = '#customerEdit';

    CustomerEdit.prototype.events = {
      'click #save': 'save',
      'click #cancel': 'cancel'
    };

    CustomerEdit.prototype.initialize = function() {
      Vent.on('edit', this.render);
      return this.template = Handlebars.compile($('#customerEditTemplate').html());
    };

    CustomerEdit.prototype.render = function(model) {
      var data, html;
      if (model) {
        this.model = model;
      } else {
        this.model = new Customer();
      }
      data = this.model.toJSON();
      html = this.template(data);
      this.$el.html(html).show().find('#first').focus();
      return this;
    };

    CustomerEdit.prototype.save = function(event) {
      this.model.set({
        'FirstName': this.$el.find('#first').val(),
        'LastName': this.$el.find('#last').val(),
        'Email': this.$el.find('#email').val(),
        'Phone': this.$el.find('#phone').val(),
        'Birthday': this.$el.find('#birthday').val(),
        'Description': this.$el.find('#description').val()
      });
      if (!!this.model.isNew()) window.customers.add(this.model);
      $('.alert').fadeIn();
      this.model.save({
        wait: true
      });
      return this.$el.hide();
    };

    CustomerEdit.prototype.cancel = function() {
      return this.$el.hide();
    };

    return CustomerEdit;

  })(Backbone.View);

  Vent = (function(_super) {

    __extends(Vent, _super);

    function Vent() {
      Vent.__super__.constructor.apply(this, arguments);
    }

    return Vent;

  })(Backbone.Events);

  window.Vent = Vent;

  Customer = (function(_super) {

    __extends(Customer, _super);

    function Customer() {
      Customer.__super__.constructor.apply(this, arguments);
    }

    Customer.prototype.urlRoot = '/api/customers/';

    Customer.prototype.idAttribute = 'Id';

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
    var edit, list;
    window.customers = new Customers;
    edit = new CustomerEdit();
    list = new CustomerList({
      collection: customers,
      el: '#customerList'
    });
    $('#add').click(function() {
      return Vent.trigger('edit');
    });
    return $(".alert").alert();
  });

}).call(this);
