const Jwt = require('@hapi/jwt');

class Authentication {}

Authentication.getStrategy = function(database){
    return {
        keys: 'some_shared_secret',
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15
        },
        validate: async (artifacts, request, h) => {            
            const user = await database.getUser(artifacts.decoded.payload.user);
            if (!user) {
                return { isValid: false };
            }
            return {
                isValid: true,
                credentials: { username: artifacts.decoded.payload.user }
            };
        }
    }
};

Authentication.generateToken = async function(username){
    const token = Jwt.token.generate(
        {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            user: username,
            group: 'hapi_community'
        },
        {
            key: 'some_shared_secret',
            algorithm: 'HS512'
        },
        {
            ttlSec: 14400 // 4 hours
        }
    );
    return token;
}

module.exports = Authentication