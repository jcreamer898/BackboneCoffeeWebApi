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
        'click .remove': 'delete',
        'click .edit': 'showEdit'
    render: =>
        html = @template @model.toJSON()
        @$el.html('').append(html)
        return this
	showEdit: (event) =>
		event.preventDefault()
		Vent.trigger 'edit', @model
		return this
	delete: =>
		@model.destroy()
		@remove()
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
		@model.set
			'FirstName': @$el.find('#first').val()
			'LastName': @$el.find('#last').val()
			'Email': @$el.find('#email').val()
			'Phone': @$el.find('#phone').val()
			'Birthday': @$el.find('#birthday').val()
			'Description': @$el.find('#description').val()
		if @model.isValid()			
			$('.alert').fadeOut()
			window.customers.add @model unless !@model.isNew()
			@model.save
				wait: true	
			@$el.hide()
	cancel: =>
		@$el.hide()		
	showError: (model, error) =>        
        $('.alert').html(error).fadeIn('fast');
			

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

$ -> 
    window.customers = new Customers
    edit = new CustomerEdit()
    list = new CustomerList
        collection: customers
        el: '#customerList'

    $('#add').click ->
        Vent.trigger 'edit'
    $(".alert").alert()
