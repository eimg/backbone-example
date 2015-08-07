var config = {
    priority: ['Normal', 'Important', 'Urgent'],
    severity: ['Minor', 'Major', 'Crash'],
    status: ['Assigned', 'Doing', 'Done', 'Close']
};

var Issue = Backbone.Model.extend({
    defaults: {
        subject: 'Issue summary',
        priority: 1,
        severity: 1,
        assignedTo: 'none',
        status: 1
    },

    changeStatus: function(value) {
        this.save({status: value});
    }
});

var IssueList = Backbone.Collection.extend({
    url: '#',
    model: Issue
});

var Issues = new IssueList();

var IssueView = Backbone.View.extend({
    tagName: 'tr',

    events: {
        'change .change-status': 'changeStatus',
        'click .del': 'delSelf'
    },

    template: _.template( $('#row').html() ),
    
    initialize: function() {
        this.listenTo(this.model, 'change', this.render),
        this.listenTo(this.model, 'destroy', this.remove)
    },

    render: function() {
        var modelData = this.model.toJSON();
        modelData.config = config;

        this.$el.html( this.template(modelData) );
        return this;
    },

    changeStatus: function() {
        var newStatus = this.$('.change-status').val();
        this.model.set({status: newStatus});
    },

    delSelf: function() {
        this.model.destroy();
    }
});

var AppView = Backbone.View.extend({
    el: 'body',

    events: {
        'click #submit': 'addIssue'
    },

    initialize: function() {
        this.listenTo(Issues, 'add', this.addRow);
    },

    addIssue: function() {
        var newIssue = new Issue({
            subject: $('#subject').val(),
            priority: $('#priority').val(),
            severity: $('#severity').val(),
            assignedTo: $('#assigned-to').val(),
            status: $('#status').val()
        });

        Issues.add(newIssue);
    },

    addRow: function(issue) {
        var view = new IssueView({ model: issue });
        $('#list').append( view.render().el );

        $('#subject,  #assigned-to').val('');
        $('#priority, #severity, #status').val(0);
        $('#new').modal('hide');
    }
});

$(function() {
    new AppView();
});