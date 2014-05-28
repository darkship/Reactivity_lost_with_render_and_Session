if (Meteor.isClient) {
    Session.set("selectedGroups",[])
    groups = new Meteor.Collection(null)
    members = new Meteor.Collection(null)
    Meteor.startup(function () {
        var group_ids = []
        group_ids.push(groups.insert({name: "group 1"}))
        group_ids.push(groups.insert({name: "group 2"}))
        group_ids.push(groups.insert({name: "group 3"}))

        group_ids.forEach(function (id) {
            for (var i = 0; i < 10; i++)
            {
                members.insert({name: "member " + i, group_id: id})
            }
        })
    });

    Template.groups.helpers({
        groups: function () {
            return groups.find()
        }
    })
    Template.groups.events({
        'click button':function(evt,tpl)
        {
            var selectedGroups=Session.get("selectedGroups")

            if(_.contains(selectedGroups,this._id))
            {
                Session.set("selectedGroups", _.without(selectedGroups,this._id))
            }
            else
            {
                selectedGroups.push(this._id)
                Session.set("selectedGroups", selectedGroups)
            }

        }
    })
    Template.memberlist.helpers({
        showGroupe:function()
        {
            return Session.get("selectedGroups").length>1
        },
        group:function()
        {
            return groups.findOne(this._id)
        },
        members:function()
        {
            return members.find({group_id:this._id})
        }
    })
    var selectedGroups=[]
    Deps.autorun(function(){

        var new_groups_ids=Session.get("selectedGroups")
        console.log(new_groups_ids)
        var added_projects = _.difference(new_groups_ids, selectedGroups)
        var removed_projects = _.difference(selectedGroups, new_groups_ids)
        selectedGroups=new_groups_ids

        added_projects.forEach(function(id){
            UI.insert(UI.renderWithData(Template.memberlist,{_id:id}),document.getElementById("members_container"))
        })
        removed_projects.forEach(function(id){
            $("#groupe-"+id).remove()
        })

    })
}
