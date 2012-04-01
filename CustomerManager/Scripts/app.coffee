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
    initialize: =>
        @template = Handlebars.compile $('#customer').html()
        @render()
        return this
    render: =>
        html = @template @model.toJSON()
        @$el.append(html)
        return this


class Customer extends Backbone.Model

class Customers extends Backbone.Collection
    url: '/api/customers/'
    model: Customer    

$ ->
    customers = new Customers
    new CustomerList
        collection: customers
        el: '#customerList'