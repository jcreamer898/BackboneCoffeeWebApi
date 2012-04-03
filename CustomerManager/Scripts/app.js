(function() {
  var Customer, CustomerEdit, CustomerItem, CustomerList, Customers, MessageManager, Vent,
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
      this.deleteItem = __bind(this.deleteItem, this);
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
      'click .remove': 'deleteItem',
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

    CustomerItem.prototype.deleteItem = function() {
      this.model.destroy();
      this.$el.fadeOut('fast');
      this.remove();
      messages.success('Deleted!');
      return this;
    };

    return CustomerItem;

  })(Backbone.View);

  CustomerEdit = (function(_super) {

    __extends(CustomerEdit, _super);

    function CustomerEdit() {
      this.showError = __bind(this.showError, this);
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
      this.model.on('error', this.showError);
      return this;
    };

    CustomerEdit.prototype.save = function(event) {
      var _this = this;
      this.model.save({
        'FirstName': this.$el.find('#first').val(),
        'LastName': this.$el.find('#last').val(),
        'Email': this.$el.find('#email').val(),
        'Phone': this.$el.find('#phone').val(),
        'Birthday': this.$el.find('#birthday').val(),
        'Description': this.$el.find('#description').val()
      }, {
        wait: true,
        success: function() {
          messages.success('Saved!');
          if (!window.customers.any(function(customer) {
            return customer.get('Id') === _this.model.get('Id');
          })) {
            window.customers.add(_this.model);
          }
          return _this.$el.hide();
        }
      });
      return this;
    };

    CustomerEdit.prototype.cancel = function() {
      return this.$el.hide();
    };

    CustomerEdit.prototype.showError = function(model, error) {
      if (typeof error === 'object') {
        error = JSON.parse(error.responseText).join('<br \>');
      }
      return messages.error(error);
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
      this.validate = __bind(this.validate, this);
      Customer.__super__.constructor.apply(this, arguments);
    }

    Customer.prototype.urlRoot = '/api/customers/';

    Customer.prototype.idAttribute = 'Id';

    Customer.prototype.validate = function(attr) {
      if (!attr.FirstName) return "First Name is required";
      if (!attr.LastName) return "Last Name is required";
      if (!attr.Email) return "Email Address is required";
    };

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

  MessageManager = (function(_super) {

    __extends(MessageManager, _super);

    function MessageManager() {
      this.success = __bind(this.success, this);
      this.error = __bind(this.error, this);
      this.render = __bind(this.render, this);
      MessageManager.__super__.constructor.apply(this, arguments);
    }

    MessageManager.prototype.el = '.alert';

    MessageManager.prototype.render = function(type, message, opts) {
      var defaults, typeClass,
        _this = this;
      defaults = {
        fade: 3000
      };
      _.extend(defaults, opts);
      typeClass = "alert alert-" + type;
      this.$el.empty().prepend(message).removeClass().addClass(typeClass).fadeIn('fast');
      return setTimeout((function() {
        return _this.$el.fadeOut();
      }), defaults.fade);
    };

    MessageManager.prototype.error = function(message, opts) {
      if (!!message) return this.render('error', message, opts);
    };

    MessageManager.prototype.success = function(message, opts) {
      if (!!message) return this.render('success', message, opts);
    };

    return MessageManager;

  })(Backbone.View);

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
    $(".alert").alert();
    return window.messages = new MessageManager();
  });

}).call(this);
