db.createCollection('user');
db.user.insertOne({
    username: 'admin',
    password: 'assessment',
    email: 'test@test.com',
    subscribedAt: new Date()
});