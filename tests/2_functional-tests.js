const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

let issueID = '';

chai.use(chaiHttp);

suite('Functional Tests', async function () {
    // POST tests
    test('Create an issue with every fields', function(done){
        chai
            .request(server)
            .post('/api/issues/apitest/')
            .send({
              'issue_title': 'Post Every Field',
              'issue_text': 'Some text with every fields',
              'created_by': 'alex31',
              'assigned_to': 'alex31',
              'status_text': 'testing env',
            })
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                assert.isString(data._id)
                assert.equal(data.issue_title, 'Post Every Field')
                assert.equal(data.issue_text, 'Some text with every fields')
                assert.match(data.created_on, /^\d{4}-([0]\d|[1][0-2])-([0-2]\d|3[0-1])T[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z/)
                assert.match(data.updated_on, /^\d{4}-([0]\d|[1][0-2])-([0-2]\d|3[0-1])T[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z/)
                assert.equal(data.created_by, 'alex31')
                assert.equal(data.assigned_to, 'alex31')
                assert.isTrue(data.open)
                assert.equal(data.status_text, 'testing env')
                issueID = data._id
                done()
            })
    })
    test('Post issue with only required fields', function(done){
        chai
            .request(server)
            .post('/api/issues/apitest/')
            .send({
                'issue_title': 'Post Required Field',
                'issue_text': 'Some text with required fields',
                'created_by': 'user2',
            })
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                assert.isString(data._id)
                assert.equal(data.issue_title, 'Post Required Field')
                assert.equal(data.issue_text, 'Some text with required fields')
                assert.match(data.created_on, /^\d{4}-([0]\d|[1][0-2])-([0-2]\d|3[0-1])T[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z/)
                assert.match(data.updated_on, /^\d{4}-([0]\d|[1][0-2])-([0-2]\d|3[0-1])T[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z/)
                assert.equal(data.created_by, 'user2')
                assert.isEmpty(data.assigned_to)
                assert.isTrue(data.open)
                assert.isEmpty(data.status_text)
                done()
            })
    })
    test('Post with missing required fields', function(done){
        chai
            .request(server)
            .post('/api/issues/apitest/')
            .send({
                'issue_title': 'Post Required Field',
            })
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                assert.equal(data.error, 'required field(s) missing')
                done()
            })
    })

    // GET tests
    test('Get issues on a project', function(done){
        chai
            .request(server)
            .get('/api/issues/apitest')
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                data.forEach(issue => {
                    assert.isNotEmpty(issue.issue_title)
                    assert.isNotEmpty(issue.issue_text)
                    assert.isNotEmpty(issue.created_by)
                    assert.isBoolean(issue.open)
                    assert.isString(issue.created_on)
                    assert.isString(issue.updated_on)
                })
                done()
            })
    })
    test('Get issues with one filter', function(done){
        chai
            .request(server)
            .get('/api/issues/apitest?open=true')
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                data.forEach(issue => {
                    assert.isBoolean(issue.open)
                    assert.isTrue(issue.open)
                })
            })
        
            chai
            .request(server)
            .get('/api/issues/apitest?created_by=alex31')
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                data.forEach(issue => {
                    assert.equal(issue.created_by, 'alex31')
                })
            })

            done()
    })
    test('Get issues with multiple filter', function(done){
        chai
            .request(server)
            .get('/api/issues/apitest?open=true&created_by=user2')
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                data.forEach(issue => {
                    assert.isBoolean(issue.open)
                    assert.isTrue(issue.open)
                    assert.equal(issue.created_by, 'user2')
                })
                done()
            })
    })

    // PUT tests
    test('Update one field on an issue', function(done){
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id: issueID,
                issue_text: 'Updated text'
            })
            .end((err, res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                assert.equal(data._id, issueID)
                assert.equal(data.result, 'successfully updated')
                done()
            })

    })
    test('Update multiple fields on an issue', function(done){
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id: issueID,
                issue_text: 'Updated text',
                created_by: 'GhostUser'
            })
            .end((err, res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                assert.equal(data._id, issueID)
                assert.equal(data.result, 'successfully updated')
                done()
            })

    })
    test('Update issue with missing _id', function(done){
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                issue_text: 'Updated text',
            })
            .end((err, res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                assert.equal(data.error, 'missing _id')
                done()
            })

    })

    // DELETE tests
    test('Delete an issue', function(done) {
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({
                _id: issueID
            })
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                assert.equal(data._id, issueID)
                assert.equal(data.result, 'successfully deleted')
                done()
            })
    })
    test('Delete an issue with invalid _id', function(done) {
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({
                _id: '111111111111111111111111'
            })
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                assert.equal(data._id, '111111111111111111111111')
                assert.equal(data.error, 'could not delete')
                done()
            })
    })
    test('Delete an issue with missing _id', function(done) {
        chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({})
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                assert.equal(data.error, 'missing _id')
                done()
            })
    })
});
