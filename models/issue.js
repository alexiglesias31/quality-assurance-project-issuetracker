const mongoose = require('mongoose')

const IssueSchema = mongoose.Schema({
    project: {type: String, required: true},
    title: {type: String, required: true, unique: true},
    text: {type: String, required: true},
    createdBy: {type: String, required: true},
    assignedTo: {type: String},
    statusText: {type: String},
    open: {type: Boolean},
    createdOn: {type: Date},
    updatedOn: {type: Date}
})

const Issue = new mongoose.model('Issue', IssueSchema)

module.exports = Issue