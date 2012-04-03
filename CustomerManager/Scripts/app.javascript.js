/* File Created: April 2, 2012 */
var CustomerList = Backbone.View.extend({
    initialize: function () {
        this.collection.on('reset', this.renderAll, this);
        this.collection.on('add', this.render, this);
        this.collection.fetch();
        _.bindAll(this, 'renderAll', 'render');
        return this;
    },
    renderAll: function () {
        this.collection.each(this.render);
    },
    render: function (model) {
        var item = new CustomerItem({
            model: model
        });

        this.$el.append(item.el);
    }
});

var CustomerItem = Backbone.View.extend({
    events: {
        'click .remove': 'deleteItem',
        'click .edit': 'showEdit'
    },
    tagName: 'tr',
    initialize: function () {
        this.template = Handlebars.compile($('#customer').html());
        this.model.on('change', this.render, this);
        this.render();
    },
    render: function () {
        var html = this.template(this.model.toJSON());
        this.$el.html('').html(html);
    },
    showEdit: function (event) {
        event.preventDefault();
        Vent.trigger('edit', this.model);
    },
    deleteItem: function () {
        this.model.destroy();
        this.$el.fadeOut('fast');
        messages.succes('Deleted!');
        this.remove();
    }
});

var CustomerEdit = Backbone.View.extend({
    el: '#customerEdit',
    events: {
        'click #save': 'save',
        'click #cancel': 'cancel'
    },
    initialize: function () {
        _.bindAll(this, 'render', 'save');
        Vent.on('edit', this.render);
        this.template = Handlebars.compile($('#customerEditTemplate').html());

    },
    render: function (model) {
        var data, html;
        if (model) {
            this.model = model;
        } else {
            this.model = new Customer();
        }
        data = this.model.toJSON();
        html = this.template(data);
        this.$el.html(html)
            .show()
            .find('#first')
            .focus();
        this.model.on('error', this.showErrors, this);
    },
    save: function (event) {
        var self = this;
        this.model.save({
            'FirstName': this.$el.find('#first').val(),
            'LastName': this.$el.find('#last').val(),
            'Email': this.$el.find('#email').val(),
            'Phone': this.$el.find('#phone').val(),
            'Birthday': this.$el.find('#birthday').val(),
            'Description': this.$el.find('#description').val()
        }, {
            success: function () {
                messages.success('Saved!');
                
                if (!window.customers.any(function (customer) {
                    return customer.get('Id') === self.model.get('Id');
                })) {
                    window.customers.add(self.model);
                }
                self.$el.hide();
            }
        });
    },
    cancel: function () {
        this.$el.hide();
    },
    showErrors: function (model, error) {
        var errors = '';
        if (typeof error === 'object') {
            errors = JSON.parse(error.responseText).join('<br />');
        }
        messages.error(errors);
    }
});

var Vent = _.extend({ }, Backbone.Events);

var Customer = Backbone.Model.extend({
    urlRoot: '/api/customers/',
	idAttribute: 'Id',
	validate: function(attr) {

	    if (!attr.FirstName)
	        return "First Name is required";
	    if (!attr.LastName)
	        return "Last Name is required";
	    if (!attr.Email)
	        return "Email Address is required";
	}
});

var Customers = Backbone.Collection.extend({
   model: Customer,
   url: '/api/customers'
});

var MessageManager = Backbone.View.extend({
    el: '.alert',
    render: function(type, message, opts) {
        var defaults = {
            fade: 3000
        }, 
            typeClass,
            self = this;

        _.extend(defaults, opts);
        typeClass = "alert alert-" + type;
        this.$el.empty()
            .prepend(message)
            .removeClass()
            .addClass(typeClass)
            .fadeIn('fast');
        
        setTimeout(function() {
            self.$el.fadeOut();
        }, defaults.fade);
    },
    error: function(message, opts) {
        if (message) {
            this.render('error', message, opts);
        }
    },
    success: function(message, opts) {
        if (message) {
            this.render('success', message, opts);
        }
    }
});

window.customers = new Customers();

$(function () {
    window.messages = new MessageManager();
    
    var edit = new CustomerEdit(),
        list = new CustomerList({
            collection: window.customers,
            el: '#customerList'
        });

    $('#add').click(function () {
        Vent.trigger('edit');
    });

    $(".alert").alert();
});