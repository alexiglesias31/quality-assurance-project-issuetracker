const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    // POST tests
    test('Create an issue with every fields', function(done){
        chai
            .request(server)
            .post('/api/issues/test')
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
                done()
            })
    })
    test('Post issue with only required fields', function(done){
        chai
            .request(server)
            .post('/api/issues/test')
            .send({
                'issue_title': 'Post Required Field',
                'issue_text': 'Some text with required fields',
                'created_by': 'alex31',
            })
            .end((err,res) => {
                const data = JSON.parse(res.text)
                assert.equal(res.status, 200)
                assert.isString(data._id)
                assert.equal(data.issue_title, 'Post Required Field')
                assert.equal(data.issue_text, 'Some text with required fields')
                assert.match(data.created_on, /^\d{4}-([0]\d|[1][0-2])-([0-2]\d|3[0-1])T[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z/)
                assert.match(data.updated_on, /^\d{4}-([0]\d|[1][0-2])-([0-2]\d|3[0-1])T[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z/)
                assert.equal(data.created_by, 'alex31')
                assert.isEmpty(data.assigned_to)
                assert.isTrue(data.open)
                assert.isEmpty(data.status_text)
                done()
            })
    })
    test('Post with missing required fields', function(done){
        chai
            .request(server)
            .post('/api/issues/test')
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
});
