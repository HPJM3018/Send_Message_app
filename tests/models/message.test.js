const Message = require('../../models/message');

describe('Message Model', () => {
    
    let testId = null;
    
    beforeAll((done) => {
        setTimeout(() => {
            Message.create('Message de test initial');
            setTimeout(() => {
                Message.all((messages) => {
                    if (messages && messages.length > 0) {
                        testId = messages[0].id;
                    }
                    done();
                });
            }, 200);
        }, 200);
    });
    
    afterAll((done) => {
        setTimeout(() => {
            Message.close(done);
        }, 500);
    });

    test('all() should return array', (done) => {
        Message.all((messages) => {
            expect(Array.isArray(messages)).toBe(true);
            done();
        });
    });

    test('create() should work without error', () => {
        expect(() => {
            Message.create('Another test');
        }).not.toThrow();
    });

    test('find() should find existing message', (done) => {
        if (testId) {
            Message.find(testId, (message) => {
                expect(message).toBeDefined();
                expect(message.id).toBe(testId);
                done();
            });
        } else {
            done();
        }
    });
});