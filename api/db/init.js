db.createCollection('users');
db.user.insertOne({
    email: 'test@test.com',
    password: 'assessment',
    subscribedAt: new Date()
});