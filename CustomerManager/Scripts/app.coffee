class CustomerList extends Backbone.View
	initialize: =>
        @collection.on 'reset', @renderAll
        @collection.on 'add', @render
        @collection.fetch()
        _.bindAll @,'renderAll'
        return this
    renderAll: () =>
        @collection.each @render
        return this
    render: (model) =>
        item = new CustomerItem
            model: model
        @$el.append item.el
        return this

class CustomerItem extends Backbone.View
	tagName: 'tr'
	initialize: =>
        @template = Handlebars.compile($('#customer').html())
        @model.on('change', @render)
        @render()
        return this
    events:
        'click .remove': 'deleteItem',
        'click .edit': 'showEdit'
    render: =>
        html = @template @model.toJSON()
        @$el.html('').append(html)
        return this
	showEdit: (event) =>
		event.preventDefault()
		Vent.trigger 'edit', @model
		return this
	deleteItem: =>
		@model.destroy()
		@$el.fadeOut 'fast'
		@remove()
		messages.success 'Deleted!'
		return this


class CustomerEdit extends Backbone.View
	el: '#customerEdit'
	events:
		'click #save': 'save'
		'click #cancel': 'cancel'
	initialize: =>
		Vent.on 'edit', @render
		@template = Handlebars.compile $('#customerEditTemplate').html()
	render: (model) =>
		if model
			@model = model
		else 
			@model = new Customer()
		data = @model.toJSON() 
		html = @template data
		@$el.html(html).show()
			.find('#first').focus()
		
		@model.on 'error', @showError
		return this;
	save: (event) =>
		@model.save	
			'FirstName': @$el.find('#first').val()
			'LastName': @$el.find('#last').val()
			'Email': @$el.find('#email').val()
			'Phone': @$el.find('#phone').val()
			'Birthday': @$el.find('#birthday').val()
			'Description': @$el.find('#description').val()
		,
			wait: true
			success: =>
				messages.success 'Saved!'
				window.customers.add @model unless window.customers.any( (customer) =>  
					return customer.get('Id') is @model.get('Id');
				)
                
				@$el.hide()
		return this
	cancel: =>
		@$el.hide()		
	showError: (model, error) =>        
		error = JSON.parse(error.responseText).join '<br \>' if (typeof error is 'object')
		messages.error error

class Vent extends Backbone.Events
window.Vent = Vent

class Customer extends Backbone.Model
	urlRoot: '/api/customers/'
	idAttribute: 'Id'
	validate: (attr) =>
		if !attr.FirstName 
			return "First Name is required"
		if !attr.LastName 
			return "Last Name is required"
		if !attr.Email 
			return "Email Address is required"

class Customers extends Backbone.Collection
    url: '/api/customers/'
    model: Customer    

class MessageManager extends Backbone.View
    el: '.alert'
    render: (type, message, opts) =>
        defaults =
            fade: 3000
        _.extend defaults, opts
        typeClass = "alert alert-#{type}";
        @$el.empty().prepend(message).removeClass().addClass(typeClass).fadeIn 'fast'
        setTimeout (=> @$el.fadeOut()), defaults.fade
    error: (message, opts) =>
        @render 'error', message, opts unless !message
    success: (message, opts) =>
        @render 'success', message, opts unless !message

$ -> 
    window.customers = new Customers
    edit = new CustomerEdit()
    list = new CustomerList
        collection: customers
        el: '#customerList'

    $('#add').click ->
        Vent.trigger 'edit'
    $(".alert").alert()
    window.messages = new MessageManager()
